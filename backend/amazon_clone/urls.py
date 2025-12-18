from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'categories', views.CategoryViewSet, basename='category')
router.register(r'products', views.ProductViewSet, basename='product')
router.register(r'reviews', views.ReviewViewSet, basename='review')
router.register(r'orders', views.OrderViewSet, basename='order')
router.register(r'admin', views.AdminViewSet, basename='admin')

urlpatterns = [
    # Authentication
    path('auth/register/', views.register_view, name='register'),
    path('auth/login/', views.login_view, name='login'),
    path('auth/logout/', views.logout_view, name='logout'),
    path('auth/user/', views.current_user_view, name='current-user'),
    path('auth/apply-seller/', views.apply_seller_view, name='apply-seller'),
    
    # Cart
    path('cart/', views.CartViewSet.as_view({'get': 'list'}), name='cart'),
    path('cart/add/', views.CartViewSet.as_view({'post': 'add_item'}), name='cart-add'),
    path('cart/update/', views.CartViewSet.as_view({'patch': 'update_item'}), name='cart-update'),
    path('cart/remove/', views.CartViewSet.as_view({'delete': 'remove_item'}), name='cart-remove'),
    path('cart/clear/', views.CartViewSet.as_view({'post': 'clear'}), name='cart-clear'),
    
    # Wishlist
    path('wishlist/', views.WishlistViewSet.as_view({'get': 'list'}), name='wishlist'),
    path('wishlist/add/', views.WishlistViewSet.as_view({'post': 'add_product'}), name='wishlist-add'),
    path('wishlist/remove/', views.WishlistViewSet.as_view({'delete': 'remove_product'}), name='wishlist-remove'),
    
    # Seller Dashboard
    path('seller/dashboard/', views.seller_dashboard, name='seller-dashboard'),
    
    # Router URLs
    path('', include(router.urls)),
]
