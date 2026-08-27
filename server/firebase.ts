import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const serviceAccount = {
  type: "service_account",
  project_id: "debriq-engineering",
  private_key_id: "0d6783917d842b5381a5f0cb6ca1897ba0e4307b",
  private_key: process.env.FIREBASE_PRIVATE_KEY || "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDH7S0wkD3M5c2B\n9Dx5NzGyGFi6P7CVD2HAUrAMLvAUwSp2zmxZ3PMqKSlgKNnzZTET6S091wRIVO2L\nQ82o2sYEl0z5W+mzsgnPteJ3ryYgI2v+ckFWR2lFXOvb2m9n7me09tBrier5MLAZ\n25dnKeDJd7Rzbfmv9qsNq0JIgjqtW3JElJI8NgNBDQCqboPlo2RGYQHuxU9kKwMU\n7etGSQNdBQ2pJDI6DdcLgTNDk3aPae4C/RfhTVVMbdQxC7DJJSipQ4COV5tRHB/q\nyNCuIz0vmCGCEHNBC928cMOmHCv4gDxvwc2+OZRSi+Z0CevusEVc3OmoUs/hAQm6\ncxNP/YsvAgMBAAECggEAOI+cIkocgdRd0K81UKHR2G3U5FRSc8lXQV7jWX8KAwUn\nK1d5Be9hiAL/JqpIBvkQ6m4kk4M6PfBxB95V17iVHwVjDIT5WBI9flsZx/xwT9VV\nnzXZ0DwBx1Ljk153+DJVerf8/P+Wz4r7t0UNz2zkoHrSPXnWkva5K/PQm8zkJtjh\nEfHWn5gRyuXjitl70ieuBaZlBZcN/77K9VZjju3nrAdoMsWKcOSxgaRfyirDJIg0\nL7Gk2V+swxDanqmoR7oWGNsqsuVJRs64Ph24ofH8AXY3lDaEuVEsXrKx4iOVoiJc\nq7jgSpby4+cOUOibUgfA+LcZn9CVU0ARIMvFSyTM+QKBgQDtY6v6+ztTiSDe3Mym\n0yn40siecDIFhyyRvaPS65o6EwlPjQBb9T5xF0hE0vQm/OKqbGSM6lUxSoioEidk\nWjGUNaLI3twjriGOfwIKn9yEEnUqrMpLu6eQ5pDxrEwoQ//d6jhzzIdPoEo1IHRB\nJ7RmGF1L6vMSaqvMoeQAaWl6+wKBgQDXmaMJMvEHoSwmbqptuMaLZZ3Y16UQagKW\nyM7IvL/J2yNFBJotBwji1fjtzB2BNJC50jC0dIn0/1GMuQgvMrupurs/U7ElwifT\n1gmXISt7arrtFEn3TvcPxI8i8ZrG41l2jxHdAoKgcoz+jQYYpYATkBsfVe1i+M5S\nqivhoz06XQKBgQCoLuhmXV3PtiRqoGYBfzOKTNPDpFtcHUOPUZriUPcoU9pR2OS7\nQcnmV4dk80v03087TKYES/TlghfFc28jIt9jUIiu5W1zfefaS9NHcbDKhUUrYdXE\nyANUnnVsMxSVpm99anZqXCo1WKuabg7PJnEhr/tRUPi7QIXM6ZleTVBkxwKBgChS\niqRwy5VytlAlyGgm87MkeSYSBsQQH5XVzp7KdlApVOpWlwMu2qGaBSlsUGRW0W5/\nei510Utp6PWZsYcqRODUlKqeW3ZFXq+Gy1phkMFPT9CBR+gh86EWUPLnHtxtrtC2\np0+fZZDee7Ir6+T2JwMBo6DzsCcfg28Adp6Hqi7dAoGBAKpqvESExjLnyJu5w7H5\nbwfewPUFXCJR34B5jsNFdPWZDsqHTsyFz4auvaM8B9279U1O/7UVpWzBmNH03BOG\nOQrvjh9fuRTys6qbqL1u8AnRgvY9AQnsGWxB1XVF2IWB/52Z3V/rVhfUo45wtT9Y\nUD5xBVNwSj7XBYvhdf8oe4YX\n-----END PRIVATE KEY-----\n",
  client_email: "firebase-adminsdk-fbsvc@debriq-engineering.iam.gserviceaccount.com",
  client_id: "113005419058049693011",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40debriq-engineering.iam.gserviceaccount.com"
};

if (!getApps().length) {
  try {
    initializeApp({
      credential: cert(serviceAccount as any)
    });
    console.log('[Firebase] Admin SDK initialized successfully for project: debriq-engineering');
  } catch (err) {
    console.error('[Firebase] Failed to initialize Firebase Admin SDK:', err);
  }
}

export const firestore = getFirestore();
