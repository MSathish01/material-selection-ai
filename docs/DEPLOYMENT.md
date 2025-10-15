# Deployment Guide

## Prerequisites

- Node.js 18+ and npm
- MongoDB 7.0+
- OpenAI API key
- Docker and Docker Compose (for containerized deployment)

## Environment Setup

1. **Clone the repository:**
```bash
git clone <repository-url>
cd genai-material-selection-assistant
```

2. **Set up environment variables:**
```bash
cp .env.example .env
```

Edit `.env` file with your configuration:
```env
OPENAI_API_KEY=your_openai_api_key_here
MONGODB_URI=mongodb://localhost:27017/material-selection
NODE_ENV=production
FRONTEND_URL=http://localhost:3000
```

## Local Development

### 1. Install Dependencies

```bash
# Install root dependencies
npm install

# Install all project dependencies
npm run install:all
```

### 2. Start MongoDB

**Option A: Using Docker**
```bash
docker run -d --name mongodb -p 27017:27017 mongo:7.0
```

**Option B: Local Installation**
Follow MongoDB installation guide for your OS.

### 3. Seed Database

```bash
cd backend
npm run seed
```

### 4. Start Development Servers

```bash
# Start both frontend and backend
npm run dev

# Or start individually
npm run dev:backend  # Backend on port 5000
npm run dev:frontend # Frontend on port 3000
```

### 5. Access Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Documentation: http://localhost:5000/api-docs (if implemented)

## Production Deployment

### Docker Deployment (Recommended)

1. **Build and start services:**
```bash
docker-compose up -d
```

2. **Seed the database:**
```bash
docker-compose exec backend npm run seed
```

3. **Access application:**
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

### Manual Deployment

#### Backend Deployment

1. **Install dependencies:**
```bash
cd backend
npm ci --only=production
```

2. **Build application:**
```bash
npm run build
```

3. **Start with PM2 (recommended):**
```bash
npm install -g pm2
pm2 start dist/index.js --name "material-selection-api"
pm2 startup
pm2 save
```

#### Frontend Deployment

1. **Build application:**
```bash
cd frontend
npm ci
npm run build
```

2. **Serve with Nginx:**

Create `/etc/nginx/sites-available/material-selection`:
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/frontend/build;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/material-selection /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## Cloud Deployment

### AWS Deployment

#### Using AWS ECS with Fargate

1. **Build and push Docker images:**
```bash
# Build images
docker build -t material-selection-backend ./backend
docker build -t material-selection-frontend ./frontend

# Tag for ECR
docker tag material-selection-backend:latest <account-id>.dkr.ecr.<region>.amazonaws.com/material-selection-backend:latest
docker tag material-selection-frontend:latest <account-id>.dkr.ecr.<region>.amazonaws.com/material-selection-frontend:latest

# Push to ECR
docker push <account-id>.dkr.ecr.<region>.amazonaws.com/material-selection-backend:latest
docker push <account-id>.dkr.ecr.<region>.amazonaws.com/material-selection-frontend:latest
```

2. **Create ECS task definitions and services**

3. **Set up Application Load Balancer**

4. **Configure MongoDB Atlas or DocumentDB**

#### Using AWS Elastic Beanstalk

1. **Prepare deployment package:**
```bash
zip -r material-selection-backend.zip backend/ -x "backend/node_modules/*"
```

2. **Deploy to Elastic Beanstalk**

3. **Configure environment variables in EB console**

### Google Cloud Platform

#### Using Cloud Run

1. **Build and deploy backend:**
```bash
cd backend
gcloud run deploy material-selection-backend \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

2. **Build and deploy frontend:**
```bash
cd frontend
gcloud run deploy material-selection-frontend \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

### Azure Deployment

#### Using Azure Container Instances

1. **Create resource group:**
```bash
az group create --name material-selection-rg --location eastus
```

2. **Deploy containers:**
```bash
az container create \
  --resource-group material-selection-rg \
  --name material-selection-backend \
  --image your-registry/material-selection-backend:latest \
  --ports 5000 \
  --environment-variables MONGODB_URI=<connection-string>
```

## Database Setup

### MongoDB Atlas (Cloud)

1. Create MongoDB Atlas cluster
2. Configure network access
3. Create database user
4. Update connection string in environment variables

### Self-hosted MongoDB

1. **Install MongoDB:**
```bash
# Ubuntu/Debian
sudo apt-get install -y mongodb-org

# CentOS/RHEL
sudo yum install -y mongodb-org
```

2. **Configure MongoDB:**
Edit `/etc/mongod.conf`:
```yaml
net:
  port: 27017
  bindIp: 127.0.0.1

security:
  authorization: enabled
```

3. **Create database and user:**
```javascript
use material-selection
db.createUser({
  user: "materialuser",
  pwd: "securepassword",
  roles: [{ role: "readWrite", db: "material-selection" }]
})
```

## SSL/TLS Configuration

### Using Let's Encrypt with Certbot

1. **Install Certbot:**
```bash
sudo apt-get install certbot python3-certbot-nginx
```

2. **Obtain certificate:**
```bash
sudo certbot --nginx -d your-domain.com
```

3. **Auto-renewal:**
```bash
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## Monitoring and Logging

### Application Monitoring

1. **Install monitoring tools:**
```bash
npm install --save @sentry/node @sentry/tracing
```

2. **Configure Sentry (example):**
```javascript
const Sentry = require("@sentry/node");
Sentry.init({ dsn: "YOUR_SENTRY_DSN" });
```

### Log Management

1. **Configure log rotation:**
```bash
sudo nano /etc/logrotate.d/material-selection
```

```
/path/to/logs/*.log {
    daily
    missingok
    rotate 52
    compress
    notifempty
    create 644 nodejs nodejs
}
```

### Health Checks

The application includes health check endpoints:
- Backend: `GET /health`
- Database connectivity check included

## Performance Optimization

### Backend Optimization

1. **Enable compression:**
```javascript
app.use(compression());
```

2. **Implement caching:**
```javascript
const redis = require('redis');
const client = redis.createClient();
```

3. **Database indexing:**
```javascript
// Ensure proper indexes are created
db.materials.createIndex({ "name": "text", "category": "text" });
db.materials.createIndex({ "applications.domain": 1 });
```

### Frontend Optimization

1. **Code splitting:**
```javascript
const LazyComponent = React.lazy(() => import('./Component'));
```

2. **Bundle analysis:**
```bash
npm run build
npx webpack-bundle-analyzer build/static/js/*.js
```

## Security Considerations

1. **Environment Variables:**
   - Never commit `.env` files
   - Use secure secret management in production

2. **API Security:**
   - Implement rate limiting
   - Add input validation
   - Use HTTPS in production

3. **Database Security:**
   - Enable authentication
   - Use connection encryption
   - Regular security updates

## Backup and Recovery

### Database Backup

1. **Automated backups:**
```bash
#!/bin/bash
mongodump --uri="mongodb://user:pass@host:port/database" --out="/backup/$(date +%Y%m%d)"
```

2. **Restore from backup:**
```bash
mongorestore --uri="mongodb://user:pass@host:port/database" /backup/20240101/
```

## Troubleshooting

### Common Issues

1. **MongoDB connection issues:**
   - Check connection string
   - Verify network connectivity
   - Check authentication credentials

2. **OpenAI API errors:**
   - Verify API key
   - Check rate limits
   - Monitor usage quotas

3. **Frontend build issues:**
   - Clear node_modules and reinstall
   - Check Node.js version compatibility
   - Verify environment variables

### Logs Location

- Backend logs: `backend/logs/`
- Frontend build logs: `frontend/build/`
- System logs: `/var/log/`

### Performance Issues

1. **Database performance:**
   - Check query performance with `explain()`
   - Ensure proper indexing
   - Monitor connection pool

2. **API response times:**
   - Enable request logging
   - Monitor OpenAI API latency
   - Check database query times

## Scaling Considerations

### Horizontal Scaling

1. **Load balancing:**
   - Use nginx or cloud load balancers
   - Implement session affinity if needed

2. **Database scaling:**
   - MongoDB replica sets
   - Sharding for large datasets

3. **Caching:**
   - Redis for session storage
   - CDN for static assets

### Vertical Scaling

1. **Resource monitoring:**
   - CPU and memory usage
   - Database performance metrics
   - API response times

2. **Optimization:**
   - Database query optimization
   - Code profiling and optimization
   - Efficient data structures