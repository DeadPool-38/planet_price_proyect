# 🚀 Guía de Despliegue MarketSphere - Vercel + PythonAnywhere

Esta guía te llevará paso a paso para desplegar tu proyecto MarketSphere usando **Vercel** (frontend) + **PythonAnywhere** (backend).

## 📋 Archivos Preparados

✅ **Backend preparado:**
- `requirements.txt` actualizado con dependencias de producción
- `settings.py` configurado para MySQL y producción
- `.env.production` creado (necesita personalización)
- `wsgi_pythonanywhere.py` creado para PythonAnywhere

✅ **Frontend preparado:**
- `package.json` actualizado (proxy removido)
- `.env.production` creado para variables de entorno
- `api.js` configurado para usar variables de entorno

## 🔧 PASO 1: Preparar Cuentas

### 1.1 Crear cuenta en PythonAnywhere
1. Ve a [pythonanywhere.com](https://www.pythonanywhere.com)
2. Crea cuenta gratuita (Beginner plan)
3. Anota tu nombre de usuario (lo necesitarás después)

### 1.2 Crear cuenta en Vercel
1. Ve a [vercel.com](https://vercel.com)
2. Regístrate con tu cuenta de GitHub
3. Conecta tu repositorio de GitHub

### 1.3 Subir código a GitHub
```bash
cd bloquesite
git init
git add .
git commit -m "Initial commit - MarketSphere ready for deployment"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/marketsphere.git
git push -u origin main
```

## 🗄️ PASO 2: Configurar Backend en PythonAnywhere

### 2.1 Subir código
**Opción A - Git (Recomendada):**
```bash
# En PythonAnywhere Bash console
git clone https://github.com/TU-USUARIO/marketsphere.git
cd marketsphere/bloquesite
```

### 2.2 Crear entorno virtual
```bash
# En PythonAnywhere Bash console
python3.10 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 2.3 Configurar base de datos MySQL
1. **En PythonAnywhere Dashboard → Databases:**
   - Crea base de datos: `TU_USUARIO$marketsphere`
   - Anota: nombre, usuario, contraseña, host

2. **Generar SECRET_KEY:**
```bash
# En PythonAnywhere Bash console
python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'
```

3. **Crear archivo .env:**
```bash
# En el directorio /home/TU_USUARIO/marketsphere/bloquesite/
nano .env
```

Contenido del archivo `.env`:
```env
SECRET_KEY=TU-SECRET-KEY-GENERADO-AQUI
DEBUG=False
ALLOWED_HOSTS=TU-USUARIO.pythonanywhere.com
DB_NAME=TU_USUARIO$marketsphere
DB_USER=TU_USUARIO
DB_PASSWORD=TU-PASSWORD-MYSQL
DB_HOST=TU-USUARIO.mysql.pythonanywhere-services.com
```

### 2.4 Configurar aplicación web
1. **Dashboard → Web → Add a new web app**
   - Manual configuration → Python 3.10
   - Source code: `/home/TU_USUARIO/marketsphere/bloquesite`
   - Working directory: `/home/TU_USUARIO/marketsphere/bloquesite`

2. **Configurar WSGI file:**
   - Edita `/var/www/TU_USUARIO_pythonanywhere_com_wsgi.py`
   - Copia el contenido de `wsgi_pythonanywhere.py` y actualiza las rutas

3. **Configurar virtualenv:**
   - Virtualenv: `/home/TU_USUARIO/marketsphere/bloquesite/venv`

### 2.5 Ejecutar migraciones
```bash
# En Bash console
cd /home/TU_USUARIO/marketsphere/bloquesite
source venv/bin/activate
python manage.py migrate
python manage.py collectstatic --noinput
python manage.py createsuperuser
```

### 2.6 Reiniciar aplicación
- En Web tab, click **"Reload TU_USUARIO.pythonanywhere.com"**

## 🎨 PASO 3: Configurar Frontend en Vercel

### 3.1 Actualizar variables de entorno
1. **Edita `frontend/.env.production`:**
```env
REACT_APP_API_URL=https://TU-USUARIO.pythonanywhere.com
```

2. **Commit y push cambios:**
```bash
git add .
git commit -m "Update API URL for production"
git push origin main
```

### 3.2 Desplegar en Vercel
1. **En Vercel Dashboard:**
   - "New Project"
   - Selecciona tu repositorio
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `build`
   - **Install Command:** `npm install`

2. **Variables de entorno en Vercel:**
   - `REACT_APP_API_URL`: `https://TU-USUARIO.pythonanywhere.com`

## 🔗 PASO 4: Conectar Frontend y Backend

### 4.1 Actualizar CORS en Django
1. **Obtén tu URL de Vercel** (ej: `https://marketsphere-tu-usuario.vercel.app`)

2. **Actualiza `.env` en PythonAnywhere:**
```env
CORS_ALLOWED_ORIGINS=https://marketsphere-tu-usuario.vercel.app,http://localhost:3000
```

3. **Reinicia la aplicación** en PythonAnywhere

## ✅ PASO 5: Verificación

### 5.1 Probar backend
- Ve a: `https://TU-USUARIO.pythonanywhere.com/admin`
- Inicia sesión con superusuario
- Verifica API: `https://TU-USUARIO.pythonanywhere.com/api/products/`

### 5.2 Probar frontend
- Ve a: `https://marketsphere-tu-usuario.vercel.app`
- Verifica que carga correctamente
- Prueba registro/login
- Verifica conexión con backend

## 🎯 URLs Finales

- **Frontend:** `https://marketsphere-tu-usuario.vercel.app`
- **Backend:** `https://TU-USUARIO.pythonanywhere.com`
- **Admin:** `https://TU-USUARIO.pythonanywhere.com/admin`

## 🔧 Solución de Problemas

### Backend no carga:
1. Revisa logs en PythonAnywhere → Web → Error log
2. Verifica que el archivo `.env` esté en la ubicación correcta
3. Confirma que las migraciones se ejecutaron

### Frontend no se conecta al backend:
1. Verifica CORS en Django settings
2. Confirma que `REACT_APP_API_URL` esté configurado
3. Revisa la consola del navegador para errores

### Base de datos:
1. Confirma credenciales MySQL en `.env`
2. Verifica que la base de datos existe en PythonAnywhere
3. Ejecuta migraciones nuevamente si es necesario

## 🎉 ¡Listo!

Tu aplicación MarketSphere está ahora desplegada y funcionando en producción con:
- ✅ Frontend rápido en Vercel
- ✅ Backend estable en PythonAnywhere
- ✅ Base de datos MySQL
- ✅ SSL automático
- ✅ Configuración de producción segura

---

**Última actualización:** 2025-11-18
**Versiones:** Django 5.2.7, React 18.2.0