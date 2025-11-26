# Guía de Despliegue Final: Vercel (Frontend) + PythonAnywhere (Backend)

Esta guía detalla los pasos exactos para desplegar tu proyecto `bloquesite`.

## Parte 1: Backend en PythonAnywhere

### 1. Preparación del Código
Asegúrate de que los siguientes archivos estén actualizados en tu repositorio (ya configurados):
- `bloquesite/settings.py`: Configurado para producción (DEBUG=False, base de datos MySQL, WhiteNoise, CORS).
- `requirements.txt`: Incluye dependencias de producción (`mysqlclient`, `whitenoise`, `gunicorn`).
- `wsgi_pythonanywhere.py`: Archivo de configuración WSGI.

### 2. Configuración en PythonAnywhere
1.  **Crear cuenta y Web App:**
    *   Regístrate en [PythonAnywhere](https://www.pythonanywhere.com/).
    *   Ve a la pestaña "Web" y crea una nueva app ("Add a new web app").
    *   Elige **Manual configuration** (no Django automático) y selecciona **Python 3.10** (o la versión que uses).

2.  **Clonar el Repositorio:**
    *   Abre una consola **Bash**.
    *   Clona tu repo:
        ```bash
        git clone https://github.com/TU_USUARIO/TU_REPO.git
        ```
    *   (Opcional) Si es privado, usa un token de acceso personal o SSH.

3.  **Entorno Virtual:**
    *   Crea y activa el entorno virtual:
        ```bash
        mkvirtualenv --python=/usr/bin/python3.10 myenv
        pip install -r ~/TU_REPO/bloquesite/requirements.txt
        ```

4.  **Base de Datos (MySQL):**
    *   Ve a la pestaña **Databases**.
    *   Crea una base de datos (ej. `bloquesite`).
    *   Anota los datos: Host, Username, Database Name.
    *   Establece una contraseña para la base de datos.

5.  **Variables de Entorno (.env):**
    *   En la carpeta de tu proyecto en PythonAnywhere (`~/TU_REPO/bloquesite`), crea un archivo `.env` con el siguiente contenido (ajusta los valores):
        ```ini
        DEBUG=False
        SECRET_KEY=tu_clave_secreta_muy_larga_y_segura
        ALLOWED_HOSTS=.pythonanywhere.com
        
        # Base de Datos
        DB_NAME=tu_usuario$bloquesite
        DB_USER=tu_usuario
        DB_PASSWORD=tu_password_db
        DB_HOST=tu_usuario.mysql.pythonanywhere-services.com
        ```

6.  **Archivos Estáticos y Migraciones:**
    *   En la consola Bash (con el entorno virtual activo):
        ```bash
        cd ~/TU_REPO/bloquesite
        python manage.py migrate
        python manage.py collectstatic
        python manage.py createsuperuser
        ```

7.  **Configurar WSGI:**
    *   Ve a la pestaña **Web** -> sección **Code**.
    *   Haz clic en el enlace del archivo WSGI configuration file.
    *   Borra todo el contenido y pega el contenido de `bloquesite/wsgi_pythonanywhere.py` (asegúrate de actualizar la ruta `path` en ese archivo con tu usuario real).

8.  **Recargar:**
    *   Ve a la pestaña **Web** y haz clic en el botón verde **Reload**.

## Parte 2: Frontend en Vercel

### 1. Preparación
*   Asegúrate de que `bloquesite/frontend/vercel.json` existe (ya creado).
*   Asegúrate de que `bloquesite/frontend/.env.production` tiene la URL correcta de tu backend.

### 2. Despliegue
1.  **Crear cuenta en Vercel:**
    *   Ve a [Vercel](https://vercel.com/) y regístrate con GitHub.

2.  **Importar Proyecto:**
    *   Haz clic en "Add New..." -> "Project".
    *   Importa tu repositorio de GitHub.

3.  **Configuración del Proyecto:**
    *   **Framework Preset:** Create React App.
    *   **Root Directory:** Haz clic en "Edit" y selecciona la carpeta `bloquesite/frontend`.
    *   **Environment Variables:**
        *   `REACT_APP_API_URL`: `https://TU-USUARIO.pythonanywhere.com` (sin la barra al final).

4.  **Deploy:**
    *   Haz clic en **Deploy**.

### 3. Verificación Final
*   Una vez desplegado el frontend, obtendrás una URL (ej. `https://bloquesite.vercel.app`).
*   Ve a tu backend en PythonAnywhere (pestaña Web) y asegúrate de que esta URL esté permitida en CORS (aunque hemos configurado regex para permitir `*.vercel.app`, es bueno verificar).
*   Prueba el registro, login y la carga de productos.

## Solución de Problemas Comunes

*   **Error 500 en Backend:** Revisa los logs de error en la pestaña Web de PythonAnywhere.
*   **Error CORS en Frontend:** Verifica que la URL del frontend coincida con la regex en `settings.py` o agrégala explícitamente a `CORS_ALLOWED_ORIGINS`.
*   **Imágenes no cargan:** Asegúrate de haber ejecutado `collectstatic` y de que la configuración de medios (`MEDIA_URL`, `MEDIA_ROOT`) esté correcta. En PythonAnywhere, necesitarás configurar un mapeo de archivos estáticos en la pestaña Web si no usas un servicio externo como S3 para archivos subidos por usuarios (media).
    *   **Static files mapping en PythonAnywhere:**
        *   URL: `/static/` -> Path: `/home/tu_usuario/TU_REPO/bloquesite/staticfiles`
        *   URL: `/media/` -> Path: `/home/tu_usuario/TU_REPO/bloquesite/media`