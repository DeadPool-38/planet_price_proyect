# 🚀 Quick Start Guide - BloqueSite E-Commerce Platform

## ✅ Status: All Systems Operational

All errors have been fixed and the project is ready to run!

---

## 🎯 One-Click Start (Windows)

Simply double-click the file:

```
bloquesite/start_servers.bat
```

This will automatically:
1. Start the Django backend server (Port 8000)
2. Start the React frontend server (Port 3000)
3. Open both in separate terminal windows

---

## 📋 Manual Start Instructions

### Option 1: Using Separate Terminals

**Terminal 1 - Backend:**
```bash
cd "d:\Curso Programación Web con React y Python BLOQUE\bloquesite"
..\bloque\Scripts\activate
python manage.py runserver
```

**Terminal 2 - Frontend:**
```bash
cd "d:\Curso Programación Web con React y Python BLOQUE\bloquesite\frontend"
npm start
```

### Option 2: Using Single Terminal (Background)

```bash
cd bloquesite
start cmd /k "..\bloque\Scripts\activate && python manage.py runserver"
cd frontend
npm start
```

---

## 🌐 Access Points

Once both servers are running:

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:3000 | Main application |
| **Backend API** | http://localhost:8000/api | REST API endpoints |
| **Admin Panel** | http://localhost:8000/admin | Django admin |

---

## 👤 Default Admin Account

If you haven't created a superuser yet:

```bash
cd bloquesite
..\bloque\Scripts\activate
python manage.py createsuperuser
```

Follow the prompts to create an admin account.

---

## 🔧 Verified Components

✅ **Backend (Django)**
- Django 5.2.7 installed
- All migrations applied
- Database ready (SQLite)
- REST API configured
- CORS enabled

✅ **Frontend (React)**
- React 18.3.1 installed
- All dependencies installed
- Tailwind CSS configured
- Build process working
- No compilation errors

✅ **Configuration**
- Virtual environment active
- All Python packages installed
- All npm packages installed
- PostCSS configured
- Proxy settings correct

---

## 📊 Project Features

### For Buyers
- Browse products with filters
- Add to cart and wishlist
- Place orders
- Track order status
- Leave product reviews
- Multi-language support (EN/ES)

### For Sellers
- Seller dashboard with analytics
- Product management (CRUD)
- Order management
- Revenue tracking
- Multiple product images

### For Admins
- User management
- Seller approval system
- Product approval workflow
- System monitoring

---

## 🐛 Troubleshooting

### Backend Won't Start

**Error:** `ModuleNotFoundError: No module named 'django'`

**Fix:**
```bash
cd bloquesite
..\bloque\Scripts\activate
pip install -r requirements.txt
```

### Frontend Won't Start

**Error:** `Cannot find module`

**Fix:**
```bash
cd bloquesite/frontend
npm install
```

### Port Already in Use

**Backend (Port 8000):**
```bash
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

**Frontend (Port 3000):**
```bash
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Browser Shows "Cannot connect"

1. Verify both servers are running
2. Check terminal for error messages
3. Ensure ports 3000 and 8000 are not blocked by firewall
4. Try accessing http://localhost:8000/api directly

---

## 📚 Additional Documentation

- **Full Setup Guide:** [`SETUP_GUIDE.md`](SETUP_GUIDE.md)
- **Deployment Guide:** [`DEPLOYMENT_GUIDE.md`](DEPLOYMENT_GUIDE.md)
- **Status Report:** [`PROJECT_STATUS_REPORT.md`](PROJECT_STATUS_REPORT.md)
- **Errors Fixed:** [`ERRORS_FIXED.md`](ERRORS_FIXED.md)
- **Main README:** [`README.md`](README.md)

---

## 🎨 Technology Stack

**Backend:**
- Django 5.2.7
- Django REST Framework 3.15.2
- SQLite Database
- Token Authentication

**Frontend:**
- React 18.3.1
- React Router 6.30.2
- Bootstrap 5.3.8
- Tailwind CSS 3.4.18
- Axios 1.13.2

---

## ✨ Next Steps

1. **Start the servers** using the batch file or manual commands
2. **Access the frontend** at http://localhost:3000
3. **Create an admin account** if you haven't already
4. **Add some categories** in the admin panel
5. **Register as a seller** and add products
6. **Test the features** - browse, cart, checkout, etc.

---

## 💡 Tips

- Keep both terminal windows open while developing
- Backend changes require server restart
- Frontend changes auto-reload (hot reload enabled)
- Check browser console for any JavaScript errors
- Check terminal for backend errors

---

## 🆘 Need Help?

If you encounter any issues:

1. Check the [`PROJECT_STATUS_REPORT.md`](PROJECT_STATUS_REPORT.md) for diagnostic information
2. Review the [`ERRORS_FIXED.md`](ERRORS_FIXED.md) for previously resolved issues
3. Ensure virtual environment is activated for backend commands
4. Verify all dependencies are installed

---

**Last Updated:** 2025-11-17  
**Status:** ✅ Ready to Run  
**All Errors Fixed:** Yes