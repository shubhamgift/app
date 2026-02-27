# 🚀 Local Setup Guide - Luxury Jewellery Store

## Quick Start Guide for Running on Your Local Machine

### 📦 What You've Downloaded

The `jewellery-store-complete.tar.gz` file contains:
- Complete Java Spring Boot backend
- Complete Angular frontend
- All documentation
- Database schema and configuration
- Design guidelines

---

## 🔧 Prerequisites

Before you start, make sure you have these installed on your local machine:

### 1. Java Development Kit (JDK) 17 or higher
**Windows:**
- Download from: https://adoptium.net/
- Install and add to PATH
- Verify: `java -version`

**Mac:**
```bash
brew install openjdk@17
```

**Linux:**
```bash
sudo apt update
sudo apt install openjdk-17-jdk
```

### 2. Maven
**Windows:**
- Download from: https://maven.apache.org/download.cgi
- Extract and add to PATH
- Verify: `mvn -version`

**Mac:**
```bash
brew install maven
```

**Linux:**
```bash
sudo apt install maven
```

### 3. Node.js (v18 or higher) & npm
**All platforms:**
- Download from: https://nodejs.org/
- Verify: `node -version` and `npm -version`

### 4. Angular CLI
```bash
npm install -g @angular/cli
```

### 5. PostgreSQL (v14 or higher)
**Windows:**
- Download from: https://www.postgresql.org/download/windows/
- Use the installer (includes pgAdmin)

**Mac:**
```bash
brew install postgresql@15
brew services start postgresql@15
```

**Linux:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

---

## 📂 Step 1: Extract the Archive

### Windows (using 7-Zip or WinRAR)
1. Right-click `jewellery-store-complete.tar.gz`
2. Extract to a folder (e.g., `C:\Projects\jewellery-store\`)

### Mac/Linux
```bash
# Extract to your desired location
cd ~/Projects
tar -xzf jewellery-store-complete.tar.gz
cd jewellery-store
```

---

## 🗄️ Step 2: Set Up PostgreSQL Database

### Create Database and User

**On Windows (using pgAdmin or psql):**
```sql
-- Open pgAdmin or Command Prompt with psql
psql -U postgres

-- Run these commands:
CREATE DATABASE jewellery_store;
CREATE USER jewellery_admin WITH PASSWORD 'jewellery_2024';
GRANT ALL PRIVILEGES ON DATABASE jewellery_store TO jewellery_admin;
ALTER DATABASE jewellery_store OWNER TO jewellery_admin;
\q
```

**On Mac/Linux:**
```bash
# Start PostgreSQL (if not already running)
sudo systemctl start postgresql  # Linux
# OR
brew services start postgresql@15  # Mac

# Create database and user
sudo -u postgres psql << EOF
CREATE DATABASE jewellery_store;
CREATE USER jewellery_admin WITH PASSWORD 'jewellery_2024';
GRANT ALL PRIVILEGES ON DATABASE jewellery_store TO jewellery_admin;
ALTER DATABASE jewellery_store OWNER TO jewellery_admin;
EOF
```

### Verify Database Connection
```bash
psql -U jewellery_admin -d jewellery_store -h localhost
# Enter password: jewellery_2024
# If connected successfully, type \q to exit
```

---

## 🔨 Step 3: Set Up Backend (Spring Boot)

### Navigate to Backend Directory
```bash
cd backend-java
```

### Configure Database Connection (if needed)
The default configuration should work, but if your PostgreSQL is on a different port or host, edit:

**File:** `src/main/resources/application.properties`
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/jewellery_store
spring.datasource.username=jewellery_admin
spring.datasource.password=jewellery_2024
```

### Build the Application
```bash
# Clean and build
mvn clean package -DskipTests

# This will create: target/jewellery-store-1.0.0.jar
```

### Start the Backend
```bash
java -jar target/jewellery-store-1.0.0.jar
```

**You should see:**
```
Started JewelleryStoreApplication in X.XXX seconds
```

**Backend will be running at:** `http://localhost:8081/api`

### Test the Backend
Open a new terminal and run:
```bash
# Test categories endpoint
curl http://localhost:8081/api/categories

# Test login
curl -X POST http://localhost:8081/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@jewellery.com","password":"admin123"}'
```

**Admin Credentials:**
- Email: `admin@jewellery.com`
- Password: `admin123`

---

## 🎨 Step 4: Set Up Frontend (Angular)

### Open a NEW terminal/command prompt

### Navigate to Frontend Directory
```bash
cd frontend-angular
```

### Install Dependencies
```bash
# Using npm
npm install

# OR using yarn (if you have it)
yarn install
```

This will take a few minutes to download all dependencies.

### Configure API URL (if needed)
The default configuration should work. If your backend is on a different port, edit:

**File:** `src/environments/environment.ts`
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8081/api'
};
```

### Start the Frontend
```bash
ng serve --open
```

**Or without auto-opening browser:**
```bash
ng serve
```

**Frontend will be running at:** `http://localhost:4200`

Your browser should automatically open to `http://localhost:4200`

---

## ✅ Verification Checklist

### Backend Health Check
- [ ] PostgreSQL is running
- [ ] Backend started without errors
- [ ] Can access: http://localhost:8081/api/categories
- [ ] Returns JSON with 4 categories (Rings, Earrings, Necklaces, Bracelets)

### Frontend Health Check
- [ ] Node modules installed successfully
- [ ] Frontend started without errors
- [ ] Can access: http://localhost:4200
- [ ] See the "Timeless Elegance" hero section
- [ ] See the category grid (Rings, Earrings, Necklaces, Bracelets)
- [ ] See the "Create Your Dream Piece" section

---

## 🎯 What You Should See

### Homepage Features:
1. **Hero Section**
   - Large background image of luxury jewellery
   - "Timeless Elegance" heading in gold
   - "Discover our exquisite collection" subtitle
   - "EXPLORE COLLECTION" button

2. **Shop By Category Section**
   - Grid of 4 categories with images
   - Rings, Earrings, Necklaces, Bracelets
   - Hover effects on images

3. **Custom Request CTA**
   - "Create Your Dream Piece" heading
   - Description text
   - "REQUEST CUSTOM DESIGN" button

### Design Theme:
- **Colors:** Gold (#C6A87C) on Black (#050505) background
- **Fonts:** Bodoni Moda (headings) + Montserrat (body)
- **Style:** Minimalist modern luxury

---

## 🛠️ Troubleshooting

### Issue: Backend won't start

**Error: "Port 8081 already in use"**
```bash
# Windows
netstat -ano | findstr :8081
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:8081 | xargs kill -9
```

**Error: "Unable to connect to database"**
- Check PostgreSQL is running: `pg_isready`
- Verify credentials in `application.properties`
- Check if database exists: `psql -U jewellery_admin -d jewellery_store -h localhost`

**Error: "Java version mismatch"**
```bash
# Check Java version (should be 17+)
java -version

# If wrong version, install JDK 17
```

### Issue: Frontend won't start

**Error: "Port 4200 already in use"**
```bash
# Windows
netstat -ano | findstr :4200
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:4200 | xargs kill -9
```

**Error: "ng command not found"**
```bash
# Install Angular CLI globally
npm install -g @angular/cli

# Verify installation
ng version
```

**Error: "Module not found" or dependency errors**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Error: "Cannot connect to backend API"**
- Verify backend is running on port 8081
- Check `environment.ts` has correct API URL
- Try accessing backend directly: http://localhost:8081/api/categories

### Issue: Blank page or errors in browser

1. **Open Browser Console** (F12 or Right-click → Inspect)
2. Check for errors in Console tab
3. Check Network tab for failed API calls

**Common fixes:**
```bash
# Clear Angular cache
rm -rf .angular/cache

# Restart with fresh build
ng serve --port 4200
```

### Issue: PostgreSQL connection refused

**Mac:**
```bash
# Check if PostgreSQL is running
brew services list

# Start if stopped
brew services start postgresql@15
```

**Linux:**
```bash
# Check status
sudo systemctl status postgresql

# Start if stopped
sudo systemctl start postgresql
```

**Windows:**
- Open Services (Win + R, type `services.msc`)
- Find "PostgreSQL" service
- Right-click and Start if stopped

---

## 📱 Access Points

Once everything is running:

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://localhost:4200 | Main application UI |
| Backend API | http://localhost:8081/api | REST API endpoints |
| PostgreSQL | localhost:5432 | Database |

---

## 🔐 Default Credentials

### Admin Account
- **Email:** admin@jewellery.com
- **Password:** admin123
- **Role:** ADMIN

### Database
- **Database:** jewellery_store
- **Username:** jewellery_admin
- **Password:** jewellery_2024

---

## 📚 Next Steps

### 1. Explore the Application
- Browse the homepage
- Check out all 4 category sections
- View the documentation files:
  - `README.md` - Complete API documentation
  - `API_TESTING.md` - API testing examples
  - `ANGULAR_DEVELOPMENT_GUIDE.md` - Frontend development guide

### 2. Test the API
Try the examples in `API_TESTING.md`:
```bash
# Get all categories
curl http://localhost:8081/api/categories

# Login as admin
curl -X POST http://localhost:8081/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@jewellery.com","password":"admin123"}'
```

### 3. Continue Development
Follow `ANGULAR_DEVELOPMENT_GUIDE.md` to build:
- Login/Signup pages
- Products listing with filters
- Product detail page with image gallery
- User dashboard
- Admin panel

### 4. Add Sample Products
Use the admin API to add products:
```bash
# Save the admin token from login
TOKEN="your_token_here"

# Create a product
curl -X POST http://localhost:8081/api/admin/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Diamond Engagement Ring",
    "description": "Beautiful 18K white gold ring",
    "price": 5500.00,
    "category": {"id": 1},
    "metal": "White Gold",
    "gemstone": "Diamond",
    "style": "Classic",
    "images": [],
    "specifications": "18K Gold, 1.5ct Diamond",
    "available": true
  }'
```

---

## 🔄 Daily Development Workflow

### Starting Your Development Session
```bash
# Terminal 1: Start Backend
cd backend-java
java -jar target/jewellery-store-1.0.0.jar

# Terminal 2: Start Frontend
cd frontend-angular
ng serve
```

### Making Changes

**Backend Changes:**
1. Edit Java files
2. Rebuild: `mvn package -DskipTests`
3. Restart backend

**Frontend Changes:**
1. Edit Angular files
2. Changes auto-reload (hot reload enabled)
3. No restart needed

### Stopping Services
- Press `Ctrl + C` in each terminal
- Or close the terminal windows

---

## 💾 Database Management

### View Data
```bash
# Connect to database
psql -U jewellery_admin -d jewellery_store -h localhost

# View tables
\dt

# View users
SELECT * FROM users;

# View categories
SELECT * FROM categories;

# View products
SELECT * FROM products;

# Exit
\q
```

### Backup Database
```bash
pg_dump -U jewellery_admin jewellery_store > backup_$(date +%Y%m%d).sql
```

### Restore Database
```bash
psql -U jewellery_admin jewellery_store < backup_20240227.sql
```

---

## 🆘 Getting Help

### Documentation Files
- `README.md` - API reference
- `API_TESTING.md` - Testing examples
- `ANGULAR_DEVELOPMENT_GUIDE.md` - Frontend guide
- `PROJECT_STRUCTURE.md` - Project overview
- `DEPLOYMENT_GUIDE.md` - External deployment

### Useful Links
- Spring Boot Docs: https://spring.io/guides
- Angular Docs: https://angular.io/docs
- PostgreSQL Docs: https://www.postgresql.org/docs/

### Common Commands Reference

**Maven:**
```bash
mvn clean install          # Full build with tests
mvn package -DskipTests    # Build without tests
mvn spring-boot:run        # Run directly
mvn dependency:tree        # View dependencies
```

**Angular:**
```bash
ng serve                   # Start dev server
ng build                   # Production build
ng generate component X    # Generate component
ng test                    # Run tests
```

**PostgreSQL:**
```bash
psql -U username -d dbname -h host     # Connect
\l                                      # List databases
\dt                                     # List tables
\d table_name                          # Describe table
```

---

## 🎉 You're All Set!

Your luxury jewellery store is now running locally!

**Quick Access:**
- 🌐 **Frontend:** http://localhost:4200
- 🔌 **Backend API:** http://localhost:8081/api
- 🗄️ **Database:** localhost:5432

**Happy Coding! 💎✨**

---

## 📞 Additional Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Review error messages in terminal/console
3. Check PostgreSQL logs
4. Verify all prerequisites are installed correctly

For deployment to production servers, see `DEPLOYMENT_GUIDE.md`
