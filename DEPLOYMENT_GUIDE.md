# BloqueSite (MarketSphere) - Production Deployment Guide

This guide explains how to deploy the BloqueSite e-commerce platform to production with proper security configurations.

## 🔒 Security Configuration

### Current Status

**Development Mode (DEBUG=True):**
- ✅ Application runs with developer-friendly settings
- ⚠️ Security warnings are expected and intentional
- ✅ All security features activate automatically in production

**Production Mode (DEBUG=False):**
- ✅ All security features enabled automatically
- ✅ HTTPS enforcement
- ✅ Secure cookies
- ✅ HSTS headers
- ✅ XSS protection
- ✅ Content type sniffing prevention

### Django Security Warnings Explained

When running `python manage.py check --deploy` in development, you'll see these warnings:

1. **W004 - SECURE_HSTS_SECONDS**: ✅ Configured (activates in production)
2. **W008 - SECURE_SSL_REDIRECT**: ✅ Configured (activates in production)
3. **W009 - SECRET_KEY**: ⚠️ Use environment variable in production
4. **W012 - SESSION_COOKIE_SECURE**: ✅ Configured (activates in production)
5. **W016 - CSRF_COOKIE_SECURE**: ✅ Configured (activates in production)
6. **W018 - DEBUG**: ✅ Set DEBUG=False in production

**These warnings are INTENTIONAL in development mode** and will automatically resolve when deployed to production.

## 📋 Pre-Deployment Checklist

### 1. Generate Secure SECRET_KEY

```bash
python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'
```

Copy the output and set it as an environment variable.

### 2. Set Environment Variables

Create a `.env` file or set system environment variables:

```bash
# Required for Production
SECRET_KEY=your-generated-secret-key-here
DEBUG=False
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com

# Optional but Recommended
DATABASE_URL=postgresql://user:password@localhost/dbname
```

### 3. Update CORS Settings

In `bloquesite/settings.py`, add your production frontend URL:

```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",  # Development
    "https://yourdomain.com",  # Production
]
```

### 4. Database Migration

For production, use PostgreSQL or MySQL instead of SQLite:

```bash
# Install PostgreSQL adapter
pip install psycopg2-binary

# Update DATABASES in settings.py or use DATABASE_URL
```

### 5. Collect Static Files

```bash
python manage.py collectstatic --noinput
```

### 6. Run Migrations

```bash
python manage.py migrate
```

### 7. Create Superuser

```bash
python manage.py createsuperuser
```

## 🚀 Deployment Options

### Option 1: Traditional Server (Ubuntu/Debian)

#### Install Dependencies

```bash
sudo apt update
sudo apt install python3-pip python3-venv nginx postgresql
```

#### Setup Application

```bash
# Clone repository
git clone <your-repo-url>
cd bloquesite

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
pip install gunicorn psycopg2-binary

# Set environment variables
export SECRET_KEY="your-secret-key"
export DEBUG="False"
export ALLOWED_HOSTS="yourdomain.com,www.yourdomain.com"

# Run migrations
python manage.py migrate
python manage.py collectstatic --noinput

# Create superuser
python manage.py createsuperuser
```

#### Configure Gunicorn

Create `/etc/systemd/system/bloquesite.service`:

```ini
[Unit]
Description=BloqueSite Django Application
After=network.target

[Service]
User=www-data
Group=www-data
WorkingDirectory=/path/to/bloquesite
Environment="SECRET_KEY=your-secret-key"
Environment="DEBUG=False"
Environment="ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com"
ExecStart=/path/to/bloquesite/venv/bin/gunicorn \
    --workers 3 \
    --bind unix:/path/to/bloquesite/bloquesite.sock \
    bloquesite.wsgi:application

[Install]
WantedBy=multi-user.target
```

Start the service:

```bash
sudo systemctl start bloquesite
sudo systemctl enable bloquesite
```

#### Configure Nginx

Create `/etc/nginx/sites-available/bloquesite`:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /path/to/ssl/cert.pem;
    ssl_certificate_key /path/to/ssl/key.pem;

    location = /favicon.ico { access_log off; log_not_found off; }
    
    location /static/ {
        alias /path/to/bloquesite/staticfiles/;
    }
    
    location /media/ {
        alias /path/to/bloquesite/media/;
    }

    location / {
        proxy_pass http://unix:/path/to/bloquesite/bloquesite.sock;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/bloquesite /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### Setup SSL with Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### Option 2: Docker Deployment

Create `Dockerfile`:

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt gunicorn

COPY . .

RUN python manage.py collectstatic --noinput

EXPOSE 8000

CMD ["gunicorn", "--bind", "0.0.0.0:8000", "bloquesite.wsgi:application"]
```

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: bloquesite
      POSTGRES_USER: bloquesite
      POSTGRES_PASSWORD: your-password
    volumes:
      - postgres_data:/var/lib/postgresql/data

  web:
    build: .
    command: gunicorn bloquesite.wsgi:application --bind 0.0.0.0:8000
    volumes:
      - ./staticfiles:/app/staticfiles
      - ./media:/app/media
    ports:
      - "8000:8000"
    environment:
      - SECRET_KEY=your-secret-key
      - DEBUG=False
      - ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
      - DATABASE_URL=postgresql://bloquesite:your-password@db:5432/bloquesite
    depends_on:
      - db

volumes:
  postgres_data:
```

Deploy:

```bash
docker-compose up -d
docker-compose exec web python manage.py migrate
docker-compose exec web python manage.py createsuperuser
```

### Option 3: Platform as a Service (Heroku, Railway, Render)

Most PaaS platforms automatically handle:
- SSL certificates
- Environment variables
- Database provisioning
- Static file serving

Follow the platform-specific deployment guide and set the required environment variables.

## 🔍 Verification

After deployment, verify security settings:

```bash
# Should show 0 issues when DEBUG=False
python manage.py check --deploy
```

Test your deployment:
1. ✅ HTTPS redirect works (http:// → https://)
2. ✅ Admin panel accessible at /admin
3. ✅ API endpoints respond correctly
4. ✅ Static files load properly
5. ✅ Media uploads work
6. ✅ CORS configured for frontend

## 📊 Monitoring

### Application Logs

```bash
# Systemd service logs
sudo journalctl -u bloquesite -f

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Performance Monitoring

Consider adding:
- **Sentry** for error tracking
- **New Relic** or **DataDog** for APM
- **Prometheus** + **Grafana** for metrics

## 🔄 Updates and Maintenance

### Updating the Application

```bash
# Pull latest code
git pull origin main

# Activate virtual environment
source venv/bin/activate

# Install new dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Collect static files
python manage.py collectstatic --noinput

# Restart service
sudo systemctl restart bloquesite
```

### Database Backups

```bash
# PostgreSQL backup
pg_dump bloquesite > backup_$(date +%Y%m%d).sql

# Restore
psql bloquesite < backup_20240101.sql
```

## 🛡️ Security Best Practices

1. ✅ **Never commit** `.env` files or secrets to version control
2. ✅ **Use strong passwords** for database and admin accounts
3. ✅ **Keep dependencies updated**: `pip list --outdated`
4. ✅ **Enable firewall**: Only allow ports 80, 443, and SSH
5. ✅ **Regular backups**: Automate database and media backups
6. ✅ **Monitor logs**: Set up alerts for errors and suspicious activity
7. ✅ **Rate limiting**: Consider adding Django rate limiting middleware
8. ✅ **Two-factor authentication**: Enable for admin accounts

## 📞 Support

For deployment issues:
1. Check application logs
2. Verify environment variables are set correctly
3. Ensure database is accessible
4. Confirm static files are collected
5. Review Nginx/Apache configuration

## 🎉 Success!

Once deployed, your application will have:
- ✅ Zero security warnings in production
- ✅ HTTPS enforcement
- ✅ Secure session management
- ✅ Protection against common web vulnerabilities
- ✅ Production-ready configuration

---

**Last Updated:** 2025-11-17
**Django Version:** 5.2.7
**Python Version:** 3.8+