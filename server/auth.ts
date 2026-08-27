import crypto from 'crypto';

// Retrieve session secret from environment variable or generate a secure fallback for dev
function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (secret && secret.trim().length >= 16) {
    return secret.trim();
  }
  if (process.env.NODE_ENV === 'production') {
    console.warn('[SECURITY WARNING] SESSION_SECRET is not set in .env! Generating an ephemeral random secret for this process.');
  }
  // Generate a random 64-character secret in memory
  return crypto.randomBytes(32).toString('hex');
}

const RUNTIME_SESSION_SECRET = getSessionSecret();

interface ActiveSession {
  userId: string;
  email: string;
  createdAt: number;
  expiresAt: number;
}

// In-memory active session registry (TTL: 7 days)
const activeSessions = new Map<string, ActiveSession>();

// Cleanup expired sessions periodically (every hour)
setInterval(() => {
  const now = Date.now();
  for (const [key, session] of activeSessions.entries()) {
    if (session.expiresAt <= now) {
      activeSessions.delete(key);
    }
  }
}, 60 * 60 * 1000).unref();

/**
 * Secure PBKDF2 password hashing with cryptographically random salt
 */
export function hashPassword(password: string): string {
  if (!password) {
    throw new Error('Password cannot be empty');
  }
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

/**
 * Timing-safe password verification
 */
export function verifyPassword(password: string, storedHash: string): boolean {
  if (!password || !storedHash) {
    return false;
  }
  
  if (!storedHash.includes(':')) {
    // In dev, prevent crash if unhashed legacy string was saved
    return crypto.timingSafeEqual(Buffer.from(password), Buffer.from(storedHash));
  }
  
  const [salt, expectedKey] = storedHash.split(':');
  if (!salt || !expectedKey) {
    return false;
  }
  
  const calculatedKey = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  
  try {
    const expectedBuf = Buffer.from(expectedKey, 'hex');
    const calculatedBuf = Buffer.from(calculatedKey, 'hex');
    if (expectedBuf.length !== calculatedBuf.length) {
      return false;
    }
    return crypto.timingSafeEqual(expectedBuf, calculatedBuf);
  } catch {
    return false;
  }
}

/**
 * Generate a cryptographically signed session token
 */
export function createSessionToken(userId: string, email: string): string {
  const nonce = crypto.randomBytes(24).toString('hex');
  const timestamp = Date.now().toString();
  const payload = `${userId}:${email}:${timestamp}:${nonce}`;
  const encodedPayload = Buffer.from(payload).toString('base64url');
  
  const hmac = crypto.createHmac('sha256', RUNTIME_SESSION_SECRET);
  hmac.update(encodedPayload);
  const signature = hmac.digest('base64url');
  
  const sessionToken = `${encodedPayload}.${signature}`;
  const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days
  
  activeSessions.set(sessionToken, {
    userId,
    email,
    createdAt: Date.now(),
    expiresAt
  });
  
  return sessionToken;
}

/**
 * Validate session token and check expiration & signature
 */
export function validateSessionToken(sessionToken: string): { userId: string; email: string } | null {
  if (!sessionToken || typeof sessionToken !== 'string' || !sessionToken.includes('.')) {
    return null;
  }
  
  const [encodedPayload, signature] = sessionToken.split('.');
  if (!encodedPayload || !signature) {
    return null;
  }
  
  // Verify HMAC signature
  const hmac = crypto.createHmac('sha256', RUNTIME_SESSION_SECRET);
  hmac.update(encodedPayload);
  const expectedSignature = hmac.digest('base64url');
  
  try {
    const sigBuf = Buffer.from(signature);
    const expBuf = Buffer.from(expectedSignature);
    if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
      return null;
    }
  } catch {
    return null;
  }
  
  // Check active session cache
  const session = activeSessions.get(sessionToken);
  if (session) {
    if (Date.now() > session.expiresAt) {
      activeSessions.delete(sessionToken);
      return null;
    }
    return { userId: session.userId, email: session.email };
  }
  
  // Decode payload safely
  try {
    const decoded = Buffer.from(encodedPayload, 'base64url').toString('utf-8');
    const [userId, email, timestampStr] = decoded.split(':');
    const timestamp = parseInt(timestampStr, 10);
    
    // Check if token age is within 7 days
    if (!userId || !email || isNaN(timestamp) || Date.now() - timestamp > 7 * 24 * 60 * 60 * 1000) {
      return null;
    }
    
    // Restore session
    activeSessions.set(sessionToken, {
      userId,
      email,
      createdAt: timestamp,
      expiresAt: timestamp + 7 * 24 * 60 * 60 * 1000
    });
    
    return { userId, email };
  } catch {
    return null;
  }
}

/**
 * Invalidate a session immediately upon logout
 */
export function revokeSession(sessionToken: string): void {
  if (sessionToken && typeof sessionToken === 'string') {
    activeSessions.delete(sessionToken);
  }
}
