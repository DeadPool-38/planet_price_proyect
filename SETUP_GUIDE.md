# Project Setup Guide

This guide provides the steps to set up and run the `bloquesite` project.

## 1. Backend Setup

First, ensure you have a Python virtual environment activated.

### Install Dependencies

Navigate to the `bloquesite` directory and install the required packages:

```bash
pip install -r requirements.txt
```

### Run Migrations

Apply the database migrations:

```bash
python manage.py migrate
```

### Start the Backend Server

Run the Django development server:

```bash
python manage.py runserver
```

## 2. Frontend Setup

In a new terminal, navigate to the `frontend` directory.

### Install Dependencies

Install the Node.js packages:

```bash
npm install
```

### Start the Frontend Server

Run the React development server:

```bash
npm start
```

## 3. Optional: Enable JWT Authentication

The project is currently configured to use basic token authentication. If you want to enable JWT authentication (recommended for production), follow these steps after the basic setup is working:

1. Uncomment the JWT-related lines in `bloquesite/settings.py`:
   - Uncomment `"rest_framework_simplejwt",` in `INSTALLED_APPS`
   - Change authentication class to `'rest_framework_simplejwt.authentication.JWTAuthentication'`

2. Uncomment the JWT imports and URL patterns in `bloquesite/urls.py`

3. Update the authentication views in `amazon_clone/views.py` and `amazon_clone/urls.py` to use JWT

The application should now be running and accessible in your browser.
