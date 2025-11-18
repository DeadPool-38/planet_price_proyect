# Planet Price - E-Commerce Platform

A full-featured, production-ready e-commerce web application built with Django REST Framework and React. MarketSphere provides a complete marketplace solution with buyer and seller functionalities, internationalization support, and a modern, responsive UI.

## 🚀 Features

### Core Functionality
- **User Authentication & Authorization**
  - User registration and login with JWT token authentication
  - Role-based access control (Buyer/Seller)
  - Seller application and approval system

### Buyer Features
- Browse products with advanced filtering and search
- Product detail pages with image galleries
- Shopping cart management
- Wishlist functionality
- Order placement and tracking
- Product reviews and ratings
- Multi-language support (English/Spanish)

### Seller Features
- Seller dashboard with analytics
- Product management (CRUD operations)
- Multiple product image uploads
- Order management and status updates
- Revenue tracking

### Technical Features
- RESTful API with Django REST Framework
- Token-based authentication
- Responsive design with Bootstrap 5
- Internationalization (i18n) support
- Modern React with Hooks and Context API
- Real-time notifications with React Toastify

## 🛠️ Technology Stack

### Backend
- **Python 3.x**
- **Django 5.2.7** - Web framework
- **Django REST Framework 3.15.2** - API development
- **django-cors-headers 4.6.0** - CORS handling
- **django-filter 24.3** - Advanced filtering
- **Pillow 11.0.0** - Image processing
- **SQLite** - Database (default)

### Frontend
- **React 18.2.0** - UI library
- **React Router 6.20.0** - Routing
- **Bootstrap 5.3.2** - CSS framework
- **React Bootstrap 2.9.1** - React components
- **Axios 1.6.2** - HTTP client
- **react-i18next 13.5.0** - Internationalization
- **React Toastify 9.1.3** - Notifications

## 📋 Prerequisites

- Python 3.8 or higher
- Node.js 16.x or higher
- npm or yarn package manager
- Git (optional)

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
cd "d:\Curso Programación Web con React y Python BLOQUE\bloquesite"
```

### 2. Backend Setup

#### Create and activate a virtual environment (recommended)

**Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

**macOS/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

#### Install Python dependencies

```bash
pip install -r requirements.txt
```

#### Run database migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

#### Create a superuser (admin account)

```bash
python manage.py createsuperuser
```

Follow the prompts to create an admin account.

#### Create locale directories for translations

```bash
mkdir locale
python manage.py makemessages -l es
python manage.py compilemessages
```

#### Start the Django development server

```bash
python manage.py runserver
```

The backend API will be available at: `http://localhost:8000`
Admin panel: `http://localhost:8000/admin`

### 3. Frontend Setup

Open a new terminal window and navigate to the frontend directory:

```bash
cd frontend
```

#### Install Node.js dependencies

```bash
npm install
```

#### Start the React development server

```bash
npm start
```

The frontend application will open automatically at: `http://localhost:3000`

## 🎯 Usage

### First Steps

1. **Access the Application**
   - Open your browser and navigate to `http://localhost:3000`

2. **Create User Accounts**
   - Register as a Buyer to shop products
   - Register as a Seller to sell products (requires admin approval)

3. **Approve Sellers (Admin)**
   - Log in to the admin panel at `http://localhost:8000/admin`
   - Navigate to Users
   - Find seller accounts and set `seller_approved` to True

4. **Add Categories (Admin)**
   - In the admin panel, add product categories
   - Categories are required before sellers can add products

5. **Add Products (Seller)**
   - Log in as an approved seller
   - Navigate to Seller Dashboard
   - Add products with images, descriptions, and pricing

6. **Shop (Buyer)**
   - Browse products
   - Add items to cart
   - Place orders
   - Leave reviews

## 📁 Project Structure

```
bloquesite/
├── amazon_clone/              # Django app
│   ├── models.py             # Database models
│   ├── serializers.py        # DRF serializers
│   ├── views.py              # API views
│   ├── urls.py               # API URL routing
│   └── admin.py              # Admin configuration
├── bloquesite/               # Django project settings
│   ├── settings.py           # Project settings
│   └── urls.py               # Main URL configuration
├── frontend/                 # React application
│   ├── public/               # Static files
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── context/          # React Context (state management)
│   │   ├── pages/            # Page components
│   │   │   ├── seller/       # Seller-specific pages
│   │   │   └── ...           # Other pages
│   │   ├── services/         # API service layer
│   │   ├── App.js            # Main App component
│   │   ├── i18n.js           # Internationalization config
│   │   └── index.js          # Entry point
│   └── package.json          # Node dependencies
├── media/                    # User-uploaded files
├── staticfiles/              # Collected static files
├── db.sqlite3                # SQLite database
├── manage.py                 # Django management script
├── requirements.txt          # Python dependencies
└── README.md                 # This file
```

## 🎨 Design System

### Color Palette
- **Primary**: #2563eb (Blue) - Main actions, links
- **Secondary**: #10b981 (Green) - Success states
- **Accent**: #f59e0b (Amber) - Highlights, promotions
- **Dark**: #1f2937 - Text, headers
- **Gray**: #6b7280 - Secondary text

### Typography
- **Display Font**: Playfair Display - Headings, branding
- **Body Font**: Inter - Body text, UI elements

### Icons
- Bootstrap Icons library for consistent iconography

## 🌍 Internationalization

The application supports multiple languages:
- English (en)
- Spanish (es)

To add more languages:

1. **Backend (Django)**:
```bash
python manage.py makemessages -l <language_code>
# Edit the .po files in locale/<language_code>/LC_MESSAGES/
python manage.py compilemessages
```

2. **Frontend (React)**:
- Edit `src/i18n.js` and add translations to the resources object

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `POST /api/auth/logout/` - User logout
- `GET /api/auth/user/` - Get current user
- `POST /api/auth/apply-seller/` - Apply to become seller

### Products
- `GET /api/products/` - List products
- `GET /api/products/{id}/` - Get product details
- `POST /api/products/` - Create product (seller only)
- `PUT /api/products/{id}/` - Update product (seller only)
- `DELETE /api/products/{id}/` - Delete product (seller only)
- `GET /api/products/featured/` - Get featured products
- `POST /api/products/{id}/upload_image/` - Upload product image

### Cart
- `GET /api/cart/` - Get user's cart
- `POST /api/cart/add/` - Add item to cart
- `PATCH /api/cart/update/` - Update cart item
- `DELETE /api/cart/remove/` - Remove cart item
- `POST /api/cart/clear/` - Clear cart

### Orders
- `GET /api/orders/` - List user's orders
- `GET /api/orders/{id}/` - Get order details
- `POST /api/orders/` - Create order
- `PATCH /api/orders/{id}/update_status/` - Update order status (seller)

### Wishlist
- `GET /api/wishlist/` - Get user's wishlist
- `POST /api/wishlist/add/` - Add product to wishlist
- `DELETE /api/wishlist/remove/` - Remove product from wishlist

### Reviews
- `GET /api/reviews/` - List reviews
- `POST /api/reviews/` - Create review
- `PUT /api/reviews/{id}/` - Update review
- `DELETE /api/reviews/{id}/` - Delete review

### Categories
- `GET /api/categories/` - List categories
- `GET /api/categories/{slug}/` - Get category by slug

## 🧪 Testing

### Backend Tests
```bash
python manage.py test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 📦 Production Deployment

### Backend
1. Update `settings.py`:
   - Set `DEBUG = False`
   - Configure `ALLOWED_HOSTS`
   - Use PostgreSQL or MySQL instead of SQLite
   - Configure static/media file serving

2. Collect static files:
```bash
python manage.py collectstatic
```

3. Use a production WSGI server (e.g., Gunicorn):
```bash
pip install gunicorn
gunicorn bloquesite.wsgi:application
```

### Frontend
1. Build the production bundle:
```bash
cd frontend
npm run build
```

2. Serve the `build` folder with a web server (Nginx, Apache, etc.)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👥 Authors

- **Development Team** - Initial work and architecture

## 🙏 Acknowledgments

- Django and React communities
- Bootstrap team for the excellent CSS framework
- All contributors and testers

## 📞 Support

For support, email support@marketsphere.com or open an issue in the repository.

## 🔄 Version History

- **1.0.0** (2024)
  - Initial release
  - Core e-commerce functionality
  - Buyer and seller features
  - Internationalization support

---

**Happy Selling & Shopping! 🛍️**
# planet_price_proyect
# planet_price_proyect
