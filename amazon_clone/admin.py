from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import (
    User, Category, Product, ProductImage, Order, OrderItem,
    Review, Wishlist, Cart, CartItem
)


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """Admin for custom User model"""
    list_display = ['username', 'email', 'role', 'seller_approved', 'is_staff']
    list_filter = ['role', 'seller_approved', 'is_staff', 'is_active']
    search_fields = ['username', 'email', 'first_name', 'last_name']
    
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Additional Info', {
            'fields': ('role', 'phone_number', 'address', 'profile_image', 'seller_approved')
        }),
    )
    
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ('Additional Info', {
            'fields': ('role', 'phone_number', 'address', 'seller_approved')
        }),
    )


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    """Admin for Category model"""
    list_display = ['name', 'slug', 'parent', 'created_at']
    list_filter = ['parent', 'created_at']
    search_fields = ['name', 'description']
    prepopulated_fields = {'slug': ('name',)}


class ProductImageInline(admin.TabularInline):
    """Inline admin for Product images"""
    model = ProductImage
    extra = 1
    fields = ['image', 'alt_text', 'is_primary', 'order']


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    """Admin for Product model"""
    list_display = ['title', 'seller', 'category', 'price', 'discount_price', 'stock', 'is_active', 'is_featured']
    list_filter = ['is_active', 'is_featured', 'category', 'created_at']
    search_fields = ['title', 'description', 'seller__username']
    prepopulated_fields = {'slug': ('title',)}
    inlines = [ProductImageInline]
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('seller', 'category', 'title', 'slug', 'description')
        }),
        ('Pricing & Stock', {
            'fields': ('price', 'discount_price', 'stock')
        }),
        ('Status', {
            'fields': ('is_active', 'is_featured')
        }),
        ('Technical Details', {
            'fields': ('specifications',),
            'classes': ('collapse',)
        }),
    )


@admin.register(ProductImage)
class ProductImageAdmin(admin.ModelAdmin):
    """Admin for ProductImage model"""
    list_display = ['product', 'is_primary', 'order', 'created_at']
    list_filter = ['is_primary', 'created_at']
    search_fields = ['product__title', 'alt_text']


class OrderItemInline(admin.TabularInline):
    """Inline admin for Order items"""
    model = OrderItem
    extra = 0
    readonly_fields = ['product', 'seller', 'quantity', 'price']


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    """Admin for Order model"""
    list_display = ['order_number', 'buyer', 'status', 'total_amount', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['order_number', 'buyer__username', 'shipping_address']
    readonly_fields = ['order_number', 'created_at', 'updated_at']
    inlines = [OrderItemInline]
    
    fieldsets = (
        ('Order Information', {
            'fields': ('order_number', 'buyer', 'status', 'total_amount')
        }),
        ('Shipping Details', {
            'fields': ('shipping_address', 'shipping_phone', 'notes')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    """Admin for OrderItem model"""
    list_display = ['order', 'product', 'seller', 'quantity', 'price']
    list_filter = ['created_at']
    search_fields = ['order__order_number', 'product__title', 'seller__username']


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    """Admin for Review model"""
    list_display = ['product', 'buyer', 'rating', 'is_verified_purchase', 'created_at']
    list_filter = ['rating', 'is_verified_purchase', 'created_at']
    search_fields = ['product__title', 'buyer__username', 'comment']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(Wishlist)
class WishlistAdmin(admin.ModelAdmin):
    """Admin for Wishlist model"""
    list_display = ['buyer', 'created_at', 'updated_at']
    search_fields = ['buyer__username']
    filter_horizontal = ['products']


@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    """Admin for Cart model"""
    list_display = ['buyer', 'created_at', 'updated_at']
    search_fields = ['buyer__username']


@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    """Admin for CartItem model"""
    list_display = ['cart', 'product', 'quantity', 'created_at']
    search_fields = ['cart__buyer__username', 'product__title']
