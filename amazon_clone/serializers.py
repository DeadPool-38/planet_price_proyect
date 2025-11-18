from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import (
    User, Category, Product, ProductImage, Order, OrderItem,
    Review, Wishlist, Cart, CartItem
)


class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model"""
    password = serializers.CharField(write_only=True, required=False)
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'role', 'phone_number', 'address', 'profile_image',
            'seller_approved', 'is_superuser', 'created_at', 'password'
        ]
        read_only_fields = ['id', 'created_at', 'seller_approved']

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = User(**validated_data)
        if password:
            user.set_password(password)
        user.save()
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance


class RegisterSerializer(serializers.ModelSerializer):
    """Serializer for user registration"""
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = [
            'username', 'email', 'password', 'password_confirm',
            'first_name', 'last_name', 'role'
        ]

    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError("Passwords do not match")
        return data

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


class LoginSerializer(serializers.Serializer):
    """Serializer for user login"""
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Invalid credentials")


class CategorySerializer(serializers.ModelSerializer):
    """Serializer for Category model"""
    subcategories = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description', 'parent', 'subcategories']
        read_only_fields = ['id', 'slug']

    def get_subcategories(self, obj):
        if obj.subcategories.exists():
            return CategorySerializer(obj.subcategories.all(), many=True).data
        return []


class ProductImageSerializer(serializers.ModelSerializer):
    """Serializer for ProductImage model"""
    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'alt_text', 'is_primary', 'order']
        read_only_fields = ['id']


class ProductListSerializer(serializers.ModelSerializer):
    """Serializer for Product list view"""
    seller_name = serializers.CharField(source='seller.username', read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    primary_image = serializers.SerializerMethodField()
    final_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    discount_percentage = serializers.IntegerField(read_only=True)
    average_rating = serializers.FloatField(read_only=True)
    review_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'title', 'slug', 'price', 'discount_price', 'final_price',
            'discount_percentage', 'stock', 'is_active', 'is_approved', 'is_featured',
            'seller_name', 'category_name', 'primary_image', 'average_rating',
            'review_count', 'created_at'
        ]

    def get_primary_image(self, obj):
        primary = obj.images.filter(is_primary=True).first()
        if primary:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(primary.image.url)
        return None


class ProductDetailSerializer(serializers.ModelSerializer):
    """Serializer for Product detail view"""
    seller = UserSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    final_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    discount_percentage = serializers.IntegerField(read_only=True)
    average_rating = serializers.FloatField(read_only=True)
    review_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'seller', 'category', 'title', 'slug', 'description',
            'specifications', 'price', 'discount_price', 'final_price',
            'discount_percentage', 'stock', 'is_active', 'is_featured',
            'images', 'average_rating', 'review_count', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'slug', 'created_at', 'updated_at']


class ProductCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer for creating/updating products"""
    images = serializers.ListField(
        child=serializers.ImageField(allow_empty_file=False, use_url=False),
        write_only=True,
        required=False
    )
    primary_image_index = serializers.IntegerField(write_only=True, required=False, default=0)
    image_urls = ProductImageSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'category', 'title', 'description', 'specifications',
            'price', 'discount_price', 'stock', 'is_active', 'is_featured',
            'images', 'primary_image_index', 'image_urls'
        ]
        read_only_fields = ['id', 'image_urls']

    def create(self, validated_data):
        images_data = validated_data.pop('images', [])
        primary_image_index = validated_data.pop('primary_image_index', 0)
        
        # Create the product
        validated_data['seller'] = self.context['request'].user
        product = super().create(validated_data)
        
        # Save images
        for index, image_data in enumerate(images_data):
            is_primary = (index == primary_image_index)
            ProductImage.objects.create(
                product=product,
                image=image_data,
                is_primary=is_primary,
                order=index
            )
        
        return product
        
    def update(self, instance, validated_data):
        images_data = validated_data.pop('images', None)
        primary_image_index = validated_data.pop('primary_image_index', None)
        
        # Update product fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        # Handle image updates if provided
        if images_data is not None:
            # Delete existing images
            instance.images.all().delete()
            
            # Add new images
            for index, image_data in enumerate(images_data):
                is_primary = (index == primary_image_index) if primary_image_index is not None else False
                ProductImage.objects.create(
                    product=instance,
                    image=image_data,
                    is_primary=is_primary,
                    order=index
                )
        
        instance.save()
        return instance


class ReviewSerializer(serializers.ModelSerializer):
    """Serializer for Review model"""
    buyer_name = serializers.CharField(source='buyer.username', read_only=True)
    product_title = serializers.CharField(source='product.title', read_only=True)

    class Meta:
        model = Review
        fields = [
            'id', 'product', 'buyer', 'buyer_name', 'product_title',
            'rating', 'comment', 'is_verified_purchase', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'buyer', 'is_verified_purchase', 'created_at', 'updated_at']

    def create(self, validated_data):
        validated_data['buyer'] = self.context['request'].user
        # Check if user has purchased this product
        product = validated_data['product']
        user = validated_data['buyer']
        has_purchased = OrderItem.objects.filter(
            order__buyer=user,
            product=product,
            order__status='delivered'
        ).exists()
        validated_data['is_verified_purchase'] = has_purchased
        return super().create(validated_data)


class OrderItemSerializer(serializers.ModelSerializer):
    """Serializer for OrderItem model"""
    product_title = serializers.CharField(source='product.title', read_only=True)
    product_image = serializers.SerializerMethodField()
    subtotal = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = OrderItem
        fields = [
            'id', 'product', 'product_title', 'product_image',
            'quantity', 'price', 'subtotal', 'seller'
        ]
        read_only_fields = ['id', 'seller']

    def get_product_image(self, obj):
        primary = obj.product.images.filter(is_primary=True).first()
        if primary:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(primary.image.url)
        return None


class OrderSerializer(serializers.ModelSerializer):
    """Serializer for Order model"""
    items = OrderItemSerializer(many=True, read_only=True)
    buyer_name = serializers.CharField(source='buyer.username', read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'order_number', 'buyer', 'buyer_name', 'status',
            'total_amount', 'shipping_address', 'shipping_phone',
            'notes', 'items', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'order_number', 'buyer', 'created_at', 'updated_at']


class OrderCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating orders"""
    class Meta:
        model = Order
        fields = ['shipping_address', 'shipping_phone', 'notes']

    def create(self, validated_data):
        user = self.context['request'].user
        cart = Cart.objects.filter(buyer=user).first()
        
        if not cart or not cart.items.exists():
            raise serializers.ValidationError("Cart is empty")

        # Create order
        order = Order.objects.create(
            buyer=user,
            total_amount=cart.total_amount,
            **validated_data
        )

        # Create order items from cart
        for cart_item in cart.items.all():
            OrderItem.objects.create(
                order=order,
                product=cart_item.product,
                seller=cart_item.product.seller,
                quantity=cart_item.quantity,
                price=cart_item.product.final_price
            )
            # Update stock
            product = cart_item.product
            product.stock -= cart_item.quantity
            product.save()

        # Clear cart
        cart.items.all().delete()

        return order


class CartItemSerializer(serializers.ModelSerializer):
    """Serializer for CartItem model"""
    product_title = serializers.CharField(source='product.title', read_only=True)
    product_price = serializers.DecimalField(
        source='product.final_price',
        max_digits=10,
        decimal_places=2,
        read_only=True
    )
    product_image = serializers.SerializerMethodField()
    product_stock = serializers.IntegerField(source='product.stock', read_only=True)
    subtotal = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = CartItem
        fields = [
            'id', 'product', 'product_title', 'product_price',
            'product_image', 'product_stock', 'quantity', 'subtotal'
        ]
        read_only_fields = ['id']

    def get_product_image(self, obj):
        primary = obj.product.images.filter(is_primary=True).first()
        if primary:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(primary.image.url)
        return None

    def validate_quantity(self, value):
        if value < 1:
            raise serializers.ValidationError("Quantity must be at least 1")
        return value


class CartSerializer(serializers.ModelSerializer):
    """Serializer for Cart model"""
    items = CartItemSerializer(many=True, read_only=True)
    total_amount = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    total_items = serializers.IntegerField(read_only=True)

    class Meta:
        model = Cart
        fields = ['id', 'items', 'total_amount', 'total_items', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class WishlistSerializer(serializers.ModelSerializer):
    """Serializer for Wishlist model"""
    products = ProductListSerializer(many=True, read_only=True)

    class Meta:
        model = Wishlist
        fields = ['id', 'products', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
