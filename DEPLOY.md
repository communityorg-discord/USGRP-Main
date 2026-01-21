# USGRP Citizen Portal - VPS Deployment

## Prerequisites
- Node.js 20+
- PM2 for process management
- Nginx for reverse proxy

## 1. Clone and Install

```bash
cd /var/www
git clone https://github.com/communityorg-discord/USGRP-Main.git
cd USGRP-Main
npm install
```

## 2. Environment Variables

Create `.env.local`:
```bash
# Economy Bot API Connection
ECONOMY_BOT_API_URL=http://localhost:3002
ECONOMY_BOT_API_KEY=citizen-portal-key

# Default guild ID (your Discord server ID)
MAIN_GUILD_ID=YOUR_GUILD_ID

# For now - hardcoded test user (replace with auth later)
DEV_USER_ID=YOUR_DISCORD_ID
```

## 3. Build & Start

```bash
npm run build
pm2 start npm --name "citizen-portal" -- start
pm2 save
```

## 4. Nginx Config

Add to `/etc/nginx/sites-available/citizen.usgrp.xyz`:
```nginx
server {
    listen 80;
    server_name citizen.usgrp.xyz;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/citizen.usgrp.xyz /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
sudo certbot --nginx -d citizen.usgrp.xyz
```

## 5. Start Citizen API in Bot

In CO-Economy-Bot, add to startup or run separately:

```bash
# Add to bot's index.js or run as separate PM2 process:
pm2 start utils/citizenPortalApi.js --name "citizen-api"
```

Or add to bot's `index.js`:
```javascript
// Near the end of bot startup
const { startCitizenApi } = require('./utils/citizenPortalApi');
startCitizenApi();
```

## Environment Variables for Bot

Add to CO-Economy-Bot `.env`:
```
CITIZEN_API_PORT=3002
CITIZEN_API_KEY=citizen-portal-key
MAIN_GUILD_ID=YOUR_GUILD_ID
```
