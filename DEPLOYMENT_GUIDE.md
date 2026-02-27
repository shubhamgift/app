# Local Development & External Deployment Guide

## ✅ Your Application is Ready for Local Development

### Current Status
- **Backend:** Java Spring Boot 3.2.0 (Running on port 8081)
- **Frontend:** Angular 19 (Running on port 4200)
- **Database:** PostgreSQL 15 (Running on port 5432)
- **Design:** Gold/Black luxury theme ("Nocturnal Opulence")

---

## 🚀 Quick Start (Local Development)

### Start All Services

**1. Start PostgreSQL Database:**
```bash
sudo service postgresql start
```

**2. Start Spring Boot Backend:**
```bash
cd /app/backend-java
java -jar target/jewellery-store-1.0.0.jar

# Or rebuild and run:
mvn clean package -DskipTests
java -jar target/jewellery-store-1.0.0.jar
```

**3. Start Angular Frontend:**
```bash
cd /app/frontend-angular
ng serve --host 0.0.0.0 --port 4200
```

**4. Access Application:**
- Frontend: http://localhost:4200
- Backend API: http://localhost:8081/api
- Admin Login: admin@jewellery.com / admin123

---

## 📦 Export Your Code

### Download Project Files

You can download your complete project to deploy elsewhere:

**Option A: Download via Code Editor**
1. Use the built-in file explorer
2. Right-click on `/app` folder
3. Select "Download"

**Option B: Create Archive**
```bash
cd /app
tar -czf jewellery-store.tar.gz backend-java/ frontend-angular/ README.md API_TESTING.md ANGULAR_DEVELOPMENT_GUIDE.md PROJECT_STRUCTURE.md design_guidelines.json

# Download the archive
# The file will be at: /app/jewellery-store.tar.gz
```

---

## 🌐 Deploy to External Platforms

### Option 1: AWS (Recommended for Production)

#### Deploy Backend (Spring Boot) to AWS Elastic Beanstalk

**Prerequisites:**
- AWS Account
- AWS CLI installed
- AWS EB CLI installed

**Steps:**

1. **Package Application:**
```bash
cd /app/backend-java
mvn clean package -DskipTests
```

2. **Create RDS PostgreSQL Database:**
- Go to AWS Console → RDS
- Create PostgreSQL database
- Note the endpoint, username, password

3. **Update application.properties:**
```properties
spring.datasource.url=jdbc:postgresql://your-rds-endpoint:5432/jewellery_store
spring.datasource.username=your-username
spring.datasource.password=your-password
```

4. **Deploy to Elastic Beanstalk:**
```bash
# Initialize EB
eb init -p java-17 jewellery-store-backend

# Create environment
eb create jewellery-store-env

# Deploy
eb deploy

# Get URL
eb status
```

#### Deploy Frontend (Angular) to AWS S3 + CloudFront

1. **Build Angular for Production:**
```bash
cd /app/frontend-angular

# Update API URL in environment.prod.ts
# Change apiUrl to your EB backend URL

ng build --configuration production
```

2. **Create S3 Bucket:**
```bash
aws s3 mb s3://jewellery-store-frontend
```

3. **Upload Build Files:**
```bash
aws s3 sync dist/frontend-angular/ s3://jewellery-store-frontend --acl public-read
```

4. **Enable Static Website Hosting:**
- Go to S3 bucket → Properties
- Enable Static Website Hosting
- Index document: index.html

5. **Setup CloudFront (Optional but Recommended):**
- Create CloudFront distribution
- Point to S3 bucket
- Enable HTTPS

**Estimated AWS Cost:** $20-50/month (depending on traffic)

---

### Option 2: Heroku (Easiest Setup)

#### Deploy Backend

1. **Install Heroku CLI:**
```bash
# Install from https://devcenter.heroku.com/articles/heroku-cli
```

2. **Prepare Backend:**
```bash
cd /app/backend-java

# Create Procfile
echo "web: java -jar target/jewellery-store-1.0.0.jar" > Procfile

# Login to Heroku
heroku login

# Create app
heroku create jewellery-store-api

# Add PostgreSQL addon
heroku addons:create heroku-postgresql:mini

# Get database URL
heroku config:get DATABASE_URL
```

3. **Update application.properties for Heroku:**
```properties
# Use environment variable
spring.datasource.url=${DATABASE_URL}
server.port=${PORT:8080}
```

4. **Deploy:**
```bash
git init
git add .
git commit -m "Initial commit"
heroku git:remote -a jewellery-store-api
git push heroku master
```

#### Deploy Frontend

1. **Build Angular:**
```bash
cd /app/frontend-angular

# Update environment.prod.ts with Heroku backend URL
# apiUrl: 'https://jewellery-store-api.herokuapp.com/api'

ng build --configuration production
```

2. **Deploy to Heroku:**
```bash
# Install static server
npm install express --save

# Create server.js
cat > server.js << 'EOF'
const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(__dirname + '/dist/frontend-angular/browser'));

app.get('/*', function(req,res) {
  res.sendFile(path.join(__dirname + '/dist/frontend-angular/browser/index.html'));
});

app.listen(process.env.PORT || 8080);
EOF

# Create Procfile
echo "web: node server.js" > Procfile

# Deploy
heroku create jewellery-store-web
git push heroku master
```

**Estimated Heroku Cost:** $16-25/month (Hobby tier)

---

### Option 3: DigitalOcean App Platform

**Backend:**
1. Create DigitalOcean account
2. Go to App Platform
3. Connect GitHub repo or upload code
4. Select Java buildpack
5. Add PostgreSQL managed database
6. Configure environment variables
7. Deploy

**Frontend:**
1. Build Angular: `ng build --configuration production`
2. Create Static Site on App Platform
3. Upload build files from `dist/`
4. Configure custom domain (optional)

**Estimated Cost:** $12-25/month

---

### Option 4: Google Cloud Platform

**Backend (Cloud Run):**
1. Create Dockerfile:
```dockerfile
FROM openjdk:17-slim
COPY target/jewellery-store-1.0.0.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","/app.jar"]
```

2. Build and Deploy:
```bash
gcloud builds submit --tag gcr.io/PROJECT_ID/jewellery-store
gcloud run deploy jewellery-store --image gcr.io/PROJECT_ID/jewellery-store
```

**Frontend (Firebase Hosting):**
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
ng build --configuration production
firebase deploy
```

**Estimated Cost:** $10-30/month

---

### Option 5: VPS (DigitalOcean Droplet, Linode, Vultr)

**Most Control, Best for Learning**

1. **Create VPS ($5-10/month)**
2. **Install Required Software:**
```bash
# Java
sudo apt install openjdk-17-jdk

# Node.js & npm
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install nodejs

# PostgreSQL
sudo apt install postgresql postgresql-contrib

# Nginx
sudo apt install nginx
```

3. **Upload Your Application:**
```bash
scp -r /app/backend-java user@your-vps-ip:/var/www/
scp -r /app/frontend-angular user@your-vps-ip:/var/www/
```

4. **Setup Backend as Service:**
```bash
sudo nano /etc/systemd/system/jewellery-backend.service

[Unit]
Description=Jewellery Store Backend
After=postgresql.service

[Service]
User=www-data
WorkingDirectory=/var/www/backend-java
ExecStart=/usr/bin/java -jar /var/www/backend-java/target/jewellery-store-1.0.0.jar
Restart=always

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl enable jewellery-backend
sudo systemctl start jewellery-backend
```

5. **Build and Serve Frontend:**
```bash
cd /var/www/frontend-angular
ng build --configuration production

# Configure Nginx
sudo nano /etc/nginx/sites-available/jewellery-store

server {
    listen 80;
    server_name yourdomain.com;
    
    # Frontend
    location / {
        root /var/www/frontend-angular/dist/frontend-angular/browser;
        try_files $uri $uri/ /index.html;
    }
    
    # Backend API
    location /api {
        proxy_pass http://localhost:8081;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/jewellery-store /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

6. **Setup SSL (Free with Let's Encrypt):**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

---

## 🔧 Development Workflow

### Making Backend Changes

1. **Edit Code:** Modify Java files in `/app/backend-java/src/`
2. **Rebuild:**
```bash
cd /app/backend-java
mvn clean package -DskipTests
```
3. **Restart Backend:**
```bash
pkill -f jewellery-store
java -jar target/jewellery-store-1.0.0.jar
```

### Making Frontend Changes

1. **Edit Components:** Modify files in `/app/frontend-angular/src/`
2. **Hot Reload:** Changes auto-refresh (ng serve has hot reload)
3. **Test:** Check http://localhost:4200

### Database Changes

1. **Connect to PostgreSQL:**
```bash
psql -U jewellery_admin -d jewellery_store -h localhost
```

2. **View Tables:**
```sql
\dt
SELECT * FROM users;
SELECT * FROM categories;
SELECT * FROM products;
```

3. **JPA Auto-Update:** Spring Boot auto-updates schema on restart

---

## 📊 Monitoring & Logs

### Backend Logs
```bash
# If running in terminal, logs appear automatically

# If running as service:
tail -f /var/log/jewellery-backend.log

# Check for errors:
grep ERROR /var/log/jewellery-backend.log
```

### Frontend Logs
```bash
# Browser console (F12)
# Or Angular serve output
```

### Database Logs
```bash
sudo tail -f /var/log/postgresql/postgresql-15-main.log
```

---

## 🔐 Security Checklist for Production

- [ ] Change JWT secret in application.properties
- [ ] Use strong database passwords
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS properly (not *)
- [ ] Remove or secure actuator endpoints
- [ ] Enable rate limiting
- [ ] Set up database backups
- [ ] Use environment variables for all secrets
- [ ] Enable firewall (UFW on Linux)
- [ ] Keep dependencies updated
- [ ] Use CDN for static assets
- [ ] Enable CSRF protection
- [ ] Implement input validation
- [ ] Set secure session cookies
- [ ] Add request logging

---

## 📚 Additional Resources

### Documentation Files
- `/app/README.md` - Complete API documentation
- `/app/API_TESTING.md` - API testing examples
- `/app/ANGULAR_DEVELOPMENT_GUIDE.md` - Frontend development guide
- `/app/PROJECT_STRUCTURE.md` - Project structure overview

### Useful Commands

**Check Service Status:**
```bash
# PostgreSQL
sudo service postgresql status

# Check ports
sudo lsof -i :8081  # Backend
sudo lsof -i :4200  # Frontend
sudo lsof -i :5432  # PostgreSQL
```

**Database Backup:**
```bash
pg_dump -U jewellery_admin jewellery_store > backup.sql

# Restore
psql -U jewellery_admin jewellery_store < backup.sql
```

**Maven Useful Commands:**
```bash
mvn clean install          # Full build with tests
mvn spring-boot:run        # Run without packaging
mvn dependency:tree        # View dependencies
mvn clean                  # Clean build directory
```

**Angular Useful Commands:**
```bash
ng generate component name    # Generate component
ng generate service name       # Generate service
ng build --prod               # Production build
ng test                       # Run tests
ng lint                       # Lint code
```

---

## 🆘 Troubleshooting

### Backend Won't Start
```bash
# Check Java version
java -version  # Should be 17+

# Check port availability
sudo lsof -i :8081

# Check PostgreSQL is running
sudo service postgresql status

# Check database connection
psql -U jewellery_admin -d jewellery_store -h localhost
```

### Frontend Build Errors
```bash
# Clear cache
rm -rf node_modules package-lock.json
npm install

# Or use yarn
rm -rf node_modules yarn.lock
yarn install
```

### Database Connection Issues
```bash
# Check PostgreSQL config
sudo nano /etc/postgresql/15/main/postgresql.conf

# Check pg_hba.conf
sudo nano /etc/postgresql/15/main/pg_hba.conf

# Restart PostgreSQL
sudo service postgresql restart
```

---

## 💰 Estimated Deployment Costs

| Platform | Monthly Cost | Best For |
|----------|-------------|----------|
| VPS (Basic) | $5-10 | Learning, Small Traffic |
| Heroku (Hobby) | $16-25 | Quick Setup, Low Traffic |
| AWS (Small) | $20-50 | Scalability, Enterprise |
| DigitalOcean App | $12-25 | Balance of Features |
| GCP | $10-30 | Google Ecosystem |

**Add-ons:**
- Domain Name: $10-15/year
- SSL Certificate: Free (Let's Encrypt)
- CDN (CloudFlare): Free tier available
- Monitoring (New Relic): Free tier available

---

## 🎯 Recommended Next Steps

1. **Complete Frontend Components** (See ANGULAR_DEVELOPMENT_GUIDE.md)
   - Build login/signup pages
   - Create products listing with filters
   - Implement product detail page
   - Build user dashboard
   - Create admin panel

2. **Add More Features**
   - Email notifications (SendGrid, Mailgun)
   - Payment gateway (Stripe for international, Razorpay for India)
   - Image optimization
   - Search with Elasticsearch
   - Analytics (Google Analytics)

3. **Testing**
   - Write unit tests (JUnit for backend, Jasmine for frontend)
   - Integration tests
   - E2E tests (Playwright, Cypress)

4. **Deployment**
   - Choose platform based on needs
   - Set up CI/CD (GitHub Actions, GitLab CI)
   - Configure monitoring
   - Set up backups

5. **Marketing**
   - SEO optimization
   - Social media integration
   - Email marketing
   - Google Business listing

---

## 📞 Support

**For Development Help:**
- Spring Boot Docs: https://spring.io/projects/spring-boot
- Angular Docs: https://angular.io/docs
- PostgreSQL Docs: https://www.postgresql.org/docs/

**For Deployment Help:**
- AWS: https://aws.amazon.com/getting-started/
- Heroku: https://devcenter.heroku.com/
- DigitalOcean: https://www.digitalocean.com/community/tutorials

---

## ✨ Your Application Features

**Currently Working:**
- ✅ JWT Authentication
- ✅ User Registration & Login
- ✅ Admin Panel API
- ✅ Product Management API
- ✅ Category Management API
- ✅ Order Management API
- ✅ Custom Request API
- ✅ Image Upload Support
- ✅ Advanced Filtering & Search
- ✅ Beautiful Homepage with Hero Section
- ✅ Category Grid Display
- ✅ Luxury Gold/Black Theme

**Ready to Build:**
- Products listing page
- Product detail page
- User authentication UI
- Shopping cart
- Order placement
- User dashboard
- Admin management interface

---

Good luck with your luxury jewellery store! 🎊💎✨
