# MarketSphere - Guía Rápida de Configuración

Esta guía te ayudará a poner en marcha MarketSphere en minutos.

## 🚀 Inicio Rápido (Windows)

### Paso 1: Instalar Dependencias del Backend

Abre PowerShell en el directorio `bloquesite` y ejecuta:

```powershell
# Crear entorno virtual
python -m venv venv

# Activar entorno virtual
.\venv\Scripts\Activate.ps1

# Instalar dependencias
pip install -r requirements.txt
```

### Paso 2: Configurar Base de Datos

```powershell
# Crear tablas de la base de datos
python manage.py makemigrations
python manage.py migrate

# Crear usuario administrador
python manage.py createsuperuser
```

Cuando se te solicite, ingresa:
- Nombre de usuario: admin
- Correo electrónico: admin@marketsphere.com
- Contraseña: (tu elección, ¡recuérdala!)

### Paso 3: Iniciar Servidor Backend

```powershell
python manage.py runserver
```

Mantén esta terminal abierta. El backend se ejecutará en `http://localhost:8000`

### Paso 4: Instalar Dependencias del Frontend

Abre una **NUEVA** ventana de PowerShell en el directorio `bloquesite\frontend`:

```powershell
cd frontend
npm install
```

### Paso 5: Iniciar Servidor Frontend

```powershell
npm start
```

La aplicación se abrirá automáticamente en `http://localhost:3000`

## 📝 Lista de Verificación de Configuración Inicial

Después de que ambos servidores estén en ejecución:

### 1. Acceder al Panel de Administración
- Ve a `http://localhost:8000/admin`
- Inicia sesión con las credenciales de superusuario que creaste
- Ahora estás en el panel de administración de Django

### 2. Crear Categorías
Las categorías son necesarias antes de que los vendedores puedan agregar productos.

En el panel de administración:
1. Haz clic en **Categories** (Categorías)
2. Haz clic en **Add Category** (Agregar Categoría)
3. Agrega algunas categorías como:
   - Electrónica
   - Ropa
   - Libros
   - Hogar y Jardín
   - Deportes
   - Juguetes

### 3. Crear Usuarios de Prueba

#### Opción A: A través de la Aplicación (Recomendado)
1. Ve a `http://localhost:3000`
2. Haz clic en **Registrarse**
3. Crea una cuenta de comprador
4. Crea otra cuenta como vendedor

#### Opción B: A través del Panel de Administración
1. En el admin, ve a **Users** (Usuarios)
2. Haz clic en **Add User** (Agregar Usuario)
3. Completa los detalles
4. Establece el rol como 'buyer' (comprador) o 'seller' (vendedor)

### 4. Aprobar Vendedores

Los vendedores necesitan aprobación del administrador antes de poder agregar productos:

1. En el panel de administración, ve a **Users** (Usuarios)
2. Encuentra usuarios con role = 'seller' (vendedor)
3. Haz clic en el usuario
4. Marca la casilla **Seller approved** (Vendedor aprobado)
5. Haz clic en **Save** (Guardar)

### 5. Agregar Productos de Muestra (Como Vendedor)

1. Inicia sesión en la aplicación como vendedor aprobado
2. Ve al **Panel de Vendedor**
3. Haz clic en **Añadir Nuevo Producto**
4. Completa los detalles del producto:
   - Título
   - Categoría
   - Descripción
   - Precio
   - Cantidad en stock
   - Subir imágenes
5. Haz clic en **Guardar**

### 6. Probar Funciones de Comprador

1. Cierra sesión e inicia sesión como comprador
2. Navega por los productos
3. Agrega artículos al carrito
4. Realiza un pedido
5. Deja una reseña

## 🎯 Comandos Comunes

### Backend (Django)

```powershell
# Activar entorno virtual
.\venv\Scripts\Activate.ps1

# Ejecutar servidor
python manage.py runserver

# Crear migraciones
python manage.py makemigrations

# Aplicar migraciones
python manage.py migrate

# Crear superusuario
python manage.py createsuperuser

# Recopilar archivos estáticos
python manage.py collectstatic
```

### Frontend (React)

```powershell
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm start

# Compilar para producción
npm run build

# Ejecutar pruebas
npm test
```

## 🔧 Solución de Problemas

### Problemas del Backend

**Problema**: `ModuleNotFoundError: No module named 'rest_framework'`
**Solución**: Asegúrate de que el entorno virtual esté activado y ejecuta `pip install -r requirements.txt`

**Problema**: `django.db.utils.OperationalError: no such table`
**Solución**: Ejecuta las migraciones: `python manage.py migrate`

**Problema**: El puerto 8000 ya está en uso
**Solución**: Ejecuta en un puerto diferente: `python manage.py runserver 8001`

### Problemas del Frontend

**Problema**: `npm: command not found`
**Solución**: Instala Node.js desde https://nodejs.org/

**Problema**: El puerto 3000 ya está en uso
**Solución**: La aplicación te preguntará si deseas usar un puerto diferente, presiona 'Y'

**Problema**: Las llamadas a la API fallan
**Solución**: Asegúrate de que el servidor backend esté ejecutándose en el puerto 8000

### Problemas de CORS

**Problema**: Errores de CORS en la consola del navegador
**Solución**: Verifica que `django-cors-headers` esté instalado y configurado en settings.py

## 📱 Probando la Aplicación

### Escenarios de Prueba

1. **Registro e Inicio de Sesión de Usuario**
   - Registrarse como comprador
   - Registrarse como vendedor
   - Iniciar/Cerrar sesión

2. **Gestión de Productos (Vendedor)**
   - Agregar producto
   - Subir imágenes
   - Editar producto
   - Eliminar producto

3. **Compras (Comprador)**
   - Navegar productos
   - Buscar productos
   - Filtrar por categoría/precio
   - Ver detalles del producto

4. **Carrito y Pago**
   - Agregar al carrito
   - Actualizar cantidades
   - Eliminar artículos
   - Realizar pedido

5. **Lista de Deseos**
   - Agregar a lista de deseos
   - Eliminar de lista de deseos
   - Mover al carrito

6. **Pedidos**
   - Ver historial de pedidos
   - Rastrear estado del pedido
   - Vendedor actualiza estado del pedido

7. **Reseñas**
   - Dejar reseña de producto
   - Ver reseñas
   - Editar/eliminar propia reseña

8. **Internacionalización**
   - Cambiar idioma (EN/ES)
   - Verificar traducciones

## 🎨 Personalización

### Cambiar Esquema de Colores

Edita `frontend/src/index.css` y modifica las variables CSS:

```css
:root {
  --primary-color: #2563eb;  /* Cambia esto */
  --secondary-color: #10b981; /* Cambia esto */
  --accent-color: #f59e0b;    /* Cambia esto */
}
```

### Agregar Más Idiomas

1. Backend: `python manage.py makemessages -l fr` (para francés)
2. Frontend: Edita `frontend/src/i18n.js` y agrega traducciones

### Modificar Logo/Marca

Edita `frontend/src/components/Navbar.js` y cambia "MarketSphere" por el nombre de tu marca.

## 📊 Datos de Muestra

Para poblar rápidamente la base de datos con datos de muestra, puedes crear un comando de gestión de Django o usar el panel de administración para agregar:

- 5-10 categorías
- 2-3 cuentas de vendedor (aprobadas)
- 20-30 productos con imágenes
- 2-3 cuentas de comprador
- Algunos pedidos y reseñas

## 🚀 Próximos Pasos

1. **Personalizar el diseño** para que coincida con tu marca
2. **Agregar integración de pagos** (Stripe, PayPal)
3. **Implementar notificaciones por correo electrónico**
4. **Agregar más filtros de productos**
5. **Crear banners promocionales**
6. **Agregar cálculos de envío**
7. **Implementar gestión de inventario**
8. **Agregar panel de análisis**

## 📞 ¿Necesitas Ayuda?

- Consulta el README.md principal para documentación detallada
- Revisa la documentación de Django: https://docs.djangoproject.com/
- Revisa la documentación de React: https://react.dev/

---

**¡Todo listo! ¡Feliz codificación! 🎉**
