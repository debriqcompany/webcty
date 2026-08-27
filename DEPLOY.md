# Deploy DEBRIQ on an Ubuntu VPS

The application is one Node.js service behind Nginx. It does not require Docker, a process manager, or a separate database service. CMS data and uploads are persisted under `/var/lib/debriq`.

## 1. Prepare the server

Install Node.js 22 LTS and Nginx, then create the service user and storage directories:

```bash
sudo apt update
sudo apt install -y nginx curl
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
sudo useradd --system --home /var/www/debriq --shell /usr/sbin/nologin debriq
sudo mkdir -p /var/www/debriq /var/lib/debriq/data /var/lib/debriq/uploads /etc/debriq
sudo chown -R debriq:debriq /var/www/debriq /var/lib/debriq
```

Upload and extract this project to `/var/www/debriq`, then install, build, and leave only runtime packages:

```bash
sudo -u debriq npm ci --prefix /var/www/debriq
sudo -u debriq npm run build --prefix /var/www/debriq
sudo -u debriq npm prune --omit=dev --prefix /var/www/debriq
```

## 2. Configure environment and persistent data

Create `/etc/debriq/debriq.env` from `.env.example`. Set a unique admin password and a random session secret (both are required before first production start):

```bash
sudo cp /var/www/debriq/.env.example /etc/debriq/debriq.env
sudo chmod 640 /etc/debriq/debriq.env
sudo chown root:debriq /etc/debriq/debriq.env
sudo openssl rand -hex 32
sudo nano /etc/debriq/debriq.env
```

Keep these values in the file:

```ini
NODE_ENV=production
PORT=3000
APP_ROOT=/var/www/debriq
DATA_DIR=/var/lib/debriq/data
UPLOAD_DIR=/var/lib/debriq/uploads
ADMIN_EMAIL=admin@debriq.vn
ADMIN_PASSWORD=choose-a-strong-initial-password
SESSION_SECRET=paste-at-least-32-random-characters-here
MAX_UPLOAD_SIZE_BYTES=10485760
```

`ADMIN_PASSWORD` seeds the account only if the database has no users. Change the password in the CMS after the first login; do not expect changing the environment variable to reset an existing account.

## 3. Start the Node service

```bash
sudo cp /var/www/debriq/deploy/debriq.service /etc/systemd/system/debriq.service
sudo systemctl daemon-reload
sudo systemctl enable --now debriq
curl http://127.0.0.1:3000/api/health
sudo journalctl -u debriq -f
```

## 4. Configure Nginx and HTTPS

Replace `example.com` in `/var/www/debriq/deploy/nginx-debriq.conf` with the real domain, then enable it:

```bash
sudo cp /var/www/debriq/deploy/nginx-debriq.conf /etc/nginx/sites-available/debriq
sudo ln -s /etc/nginx/sites-available/debriq /etc/nginx/sites-enabled/debriq
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d example.com -d www.example.com
```

Point both DNS records at the VPS before running Certbot. Nginx forwards `X-Forwarded-Proto`, so the production admin cookie is correctly marked secure after HTTPS is enabled.

## Updating the application

Back up persistent data, replace only application files, then rebuild and restart. Do **not** overwrite `/var/lib/debriq`.

```bash
sudo tar -C /var/lib -czf /root/debriq-backup-$(date +%F).tgz debriq
sudo -u debriq npm ci --prefix /var/www/debriq
sudo -u debriq npm run build --prefix /var/www/debriq
sudo -u debriq npm prune --omit=dev --prefix /var/www/debriq
sudo systemctl restart debriq
curl -fsS http://127.0.0.1:3000/api/health
```
