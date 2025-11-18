from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils.translation import gettext_lazy as _
from django.utils.text import slugify
import uuid


class User(AbstractUser):
    """Custom User model with buyer/seller roles"""
    ROLE_CHOICES = [
        ('buyer', _('Buyer')),
        ('seller', _('Seller')),
    ]
    
    role = models.CharField(
        max_length=10,
        choices=ROLE_CHOICES,
        default='buyer',
        verbose_name=_('Role')
    )
    phone_number = models.CharField(
        max_length=20,
        blank=True,
        null=True,
        verbose_name=_('Phone Number')
    )
    address = models.TextField(
        blank=True,
        null=True,
        verbose_name=_('Address')
    )
    profile_image = models.ImageField(
        upload_to='profiles/',
        blank=True,
        null=True,
        verbose_name=_('Profile Image')
    )
    seller_approved = models.BooleanField(
        default=False,
        verbose_name=_('Seller Approved')
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _('User')
        verbose_name_plural = _('Users')

    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"


class Category(models.Model):
    """Product categories"""
    name = models.CharField(
        max_length=100,
        unique=True,
        verbose_name=_('Name')
    )
    slug = models.SlugField(
        max_length=100,
        unique=True,
        blank=True
    )
    description = models.TextField(
        blank=True,
        null=True,
        verbose_name=_('Description')
    )
    parent = models.ForeignKey(
        'self',
        on_delete=models.CASCADE,
        blank=True,
        null=True,
        related_name='subcategories',
        verbose_name=_('Parent Category')
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = _('Category')
        verbose_name_plural = _('Categories')
        ordering = ['name']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class ProductQuerySet(models.QuerySet):
    def approved(self):
        return self.filter(is_approved=True, is_active=True)
    
    def pending_approval(self):
        return self.filter(is_approved=False, is_active=True)


class Product(models.Model):
    """Product model for items sold on the platform"""
    objects = ProductQuerySet.as_manager()
    
    seller = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='products',
        limit_choices_to={'role': 'seller'},
        verbose_name=_('Seller')
    )
    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        null=True,
        related_name='products',
        verbose_name=_('Category')
    )
    title = models.CharField(
        max_length=255,
        verbose_name=_('Title')
    )
    slug = models.SlugField(
        max_length=255,
        unique=True,
        blank=True
    )
    description = models.TextField(
        verbose_name=_('Description')
    )
    specifications = models.JSONField(
        default=dict,
        blank=True,
        verbose_name=_('Specifications'),
        help_text=_('Technical specifications in JSON format')
    )
    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)],
        verbose_name=_('Price')
    )
    discount_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        blank=True,
        null=True,
        validators=[MinValueValidator(0)],
        verbose_name=_('Discount Price')
    )
    stock = models.PositiveIntegerField(
        default=0,
        verbose_name=_('Stock')
    )
    is_active = models.BooleanField(
        default=True,
        verbose_name=_('Active')
    )
    is_approved = models.BooleanField(
        default=False,
        verbose_name=_('Approved')
    )
    is_featured = models.BooleanField(
        default=False,
        verbose_name=_('Featured')
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _('Product')
        verbose_name_plural = _('Products')
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.title)
            slug = base_slug
            counter = 1
            while Product.objects.filter(slug=slug).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title

    @property
    def final_price(self):
        """Return the final price (discount price if available, otherwise regular price)"""
        return self.discount_price if self.discount_price else self.price

    @property
    def discount_percentage(self):
        """Calculate discount percentage"""
        if self.discount_price and self.discount_price < self.price:
            return int(((self.price - self.discount_price) / self.price) * 100)
        return 0

    @property
    def average_rating(self):
        """Calculate average rating from reviews"""
        reviews = self.reviews.all()
        if reviews:
            return sum(review.rating for review in reviews) / len(reviews)
        return 0

    @property
    def review_count(self):
        """Get total number of reviews"""
        return self.reviews.count()


class ProductImage(models.Model):
    """Multiple images for a product"""
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='images',
        verbose_name=_('Product')
    )
    image = models.ImageField(
        upload_to='products/',
        verbose_name=_('Image')
    )
    alt_text = models.CharField(
        max_length=255,
        blank=True,
        verbose_name=_('Alt Text')
    )
    is_primary = models.BooleanField(
        default=False,
        verbose_name=_('Primary Image')
    )
    order = models.PositiveIntegerField(
        default=0,
        verbose_name=_('Order')
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = _('Product Image')
        verbose_name_plural = _('Product Images')
        ordering = ['order', 'created_at']

    def __str__(self):
        return f"{self.product.title} - Image {self.order}"


class Order(models.Model):
    """Customer orders"""
    STATUS_CHOICES = [
        ('pending', _('Pending')),
        ('confirmed', _('Confirmed')),
        ('processing', _('Processing')),
        ('shipped', _('Shipped')),
        ('in_transit', _('In Transit')),
        ('delivered', _('Delivered')),
        ('cancelled', _('Cancelled')),
        ('refunded', _('Refunded')),
    ]

    order_number = models.CharField(
        max_length=50,
        unique=True,
        editable=False,
        verbose_name=_('Order Number')
    )
    buyer = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='orders',
        limit_choices_to={'role': 'buyer'},
        verbose_name=_('Buyer')
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending',
        verbose_name=_('Status')
    )
    total_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)],
        verbose_name=_('Total Amount')
    )
    shipping_address = models.TextField(
        verbose_name=_('Shipping Address')
    )
    shipping_phone = models.CharField(
        max_length=20,
        verbose_name=_('Shipping Phone')
    )
    notes = models.TextField(
        blank=True,
        null=True,
        verbose_name=_('Notes')
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _('Order')
        verbose_name_plural = _('Orders')
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        if not self.order_number:
            self.order_number = f"MS-{uuid.uuid4().hex[:12].upper()}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Order {self.order_number} - {self.buyer.username}"


class OrderItem(models.Model):
    """Items in an order"""
    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name='items',
        verbose_name=_('Order')
    )
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='order_items',
        verbose_name=_('Product')
    )
    seller = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='sold_items',
        verbose_name=_('Seller')
    )
    quantity = models.PositiveIntegerField(
        default=1,
        validators=[MinValueValidator(1)],
        verbose_name=_('Quantity')
    )
    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)],
        verbose_name=_('Price')
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = _('Order Item')
        verbose_name_plural = _('Order Items')

    def __str__(self):
        return f"{self.quantity}x {self.product.title}"

    @property
    def subtotal(self):
        """Calculate subtotal for this item"""
        return self.quantity * self.price


class Review(models.Model):
    """Product reviews and ratings"""
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='reviews',
        verbose_name=_('Product')
    )
    buyer = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='reviews',
        limit_choices_to={'role': 'buyer'},
        verbose_name=_('Buyer')
    )
    rating = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        verbose_name=_('Rating')
    )
    comment = models.TextField(
        verbose_name=_('Comment')
    )
    is_verified_purchase = models.BooleanField(
        default=False,
        verbose_name=_('Verified Purchase')
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _('Review')
        verbose_name_plural = _('Reviews')
        ordering = ['-created_at']
        unique_together = ['product', 'buyer']

    def __str__(self):
        return f"{self.buyer.username} - {self.product.title} ({self.rating}★)"


class Wishlist(models.Model):
    """User wishlist"""
    buyer = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='wishlist',
        limit_choices_to={'role': 'buyer'},
        verbose_name=_('Buyer')
    )
    products = models.ManyToManyField(
        Product,
        related_name='wishlisted_by',
        blank=True,
        verbose_name=_('Products')
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _('Wishlist')
        verbose_name_plural = _('Wishlists')

    def __str__(self):
        return f"{self.buyer.username}'s Wishlist"


class Cart(models.Model):
    """Shopping cart"""
    buyer = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='cart',
        limit_choices_to={'role': 'buyer'},
        verbose_name=_('Buyer')
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _('Cart')
        verbose_name_plural = _('Carts')

    def __str__(self):
        return f"{self.buyer.username}'s Cart"

    @property
    def total_amount(self):
        """Calculate total cart amount"""
        return sum(item.subtotal for item in self.items.all())

    @property
    def total_items(self):
        """Get total number of items in cart"""
        return sum(item.quantity for item in self.items.all())


class CartItem(models.Model):
    """Items in shopping cart"""
    cart = models.ForeignKey(
        Cart,
        on_delete=models.CASCADE,
        related_name='items',
        verbose_name=_('Cart')
    )
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='cart_items',
        verbose_name=_('Product')
    )
    quantity = models.PositiveIntegerField(
        default=1,
        validators=[MinValueValidator(1)],
        verbose_name=_('Quantity')
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _('Cart Item')
        verbose_name_plural = _('Cart Items')
        unique_together = ['cart', 'product']

    def __str__(self):
        return f"{self.quantity}x {self.product.title}"

    @property
    def subtotal(self):
        """Calculate subtotal for this cart item"""
        return self.quantity * self.product.final_price
