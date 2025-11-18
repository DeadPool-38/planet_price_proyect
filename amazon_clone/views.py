from rest_framework import viewsets, status, filters
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAuthenticatedOrReadOnly, IsAdminUser
from rest_framework.authtoken.models import Token
from django.shortcuts import get_object_or_404
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q

from .models import (
    User, Category, Product, ProductImage, Order, OrderItem,
    Review, Wishlist, Cart, CartItem
)
from .serializers import (
    UserSerializer, RegisterSerializer, LoginSerializer,
    CategorySerializer, ProductListSerializer, ProductDetailSerializer,
    ProductCreateUpdateSerializer, ProductImageSerializer,
    OrderSerializer, OrderCreateSerializer, OrderItemSerializer,
    ReviewSerializer, CartSerializer, CartItemSerializer,
    WishlistSerializer
)


# Authentication Views
@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    """Register a new user"""
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        token, _ = Token.objects.get_or_create(user=user)
        
        # Create cart and wishlist for buyer
        if user.role == 'buyer':
            Cart.objects.get_or_create(buyer=user)
            Wishlist.objects.get_or_create(buyer=user)
        
        return Response({
            'user': UserSerializer(user).data,
            'token': token.key
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    """Login user"""
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data
        token, _ = Token.objects.get_or_create(user=user)
        return Response({
            'user': UserSerializer(user).data,
            'token': token.key
        })
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    """Logout user"""
    request.user.auth_token.delete()
    return Response({'message': 'Successfully logged out'}, status=status.HTTP_200_OK)




@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_user_view(request):
    """Get current user info"""
    serializer = UserSerializer(request.user)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def apply_seller_view(request):
    """Apply to become a seller"""
    user = request.user
    if user.role == 'seller':
        return Response({'message': 'You are already a seller'}, status=status.HTTP_400_BAD_REQUEST)
    
    user.role = 'seller'
    user.seller_approved = False  # Requires admin approval
    user.save()
    
    return Response({
        'message': 'Seller application submitted. Awaiting approval.',
        'user': UserSerializer(user).data
    })


# Category ViewSet
class CategoryViewSet(viewsets.ModelViewSet):
    """ViewSet for Category model"""
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    lookup_field = 'slug'
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsAuthenticated()]


# Product ViewSet
class ProductViewSet(viewsets.ModelViewSet):
    """ViewSet for Product model"""
    queryset = Product.objects.filter(is_active=True)
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'seller', 'is_featured']
    search_fields = ['title', 'description']
    ordering_fields = ['price', 'created_at', 'title']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        if self.action == 'list':
            return ProductListSerializer
        elif self.action in ['create', 'update', 'partial_update']:
            return ProductCreateUpdateSerializer
        return ProductDetailSerializer
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'featured']:
            return [AllowAny()]
        elif self.action in ['create']:
            return [IsAuthenticated()]
        return [IsAuthenticated()]
    
    def get_queryset(self):
        queryset = Product.objects.all()
        user = self.request.user
        
        # If filtering by seller parameter and user is that seller, show all their products
        seller_id = self.request.query_params.get('seller')
        if seller_id and user.is_authenticated and str(user.id) == str(seller_id):
            # Seller viewing their own products - show all regardless of approval status
            queryset = queryset.filter(seller=user)
        else:
            # Public view or other users - only show approved and active products
            queryset = queryset.filter(is_active=True, is_approved=True)
        
        # Filter by price range
        min_price = self.request.query_params.get('min_price')
        max_price = self.request.query_params.get('max_price')
        if min_price:
            queryset = queryset.filter(price__gte=min_price)
        if max_price:
            queryset = queryset.filter(price__lte=max_price)
        
        # Filter by rating
        min_rating = self.request.query_params.get('min_rating')
        if min_rating:
            # This is a simplified filter; for production, consider using annotations
            queryset = [p for p in queryset if p.average_rating >= float(min_rating)]
        
        return queryset
        
    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Get featured products"""
        featured_products = self.get_queryset().filter(is_featured=True, is_active=True)
        page = self.paginate_queryset(featured_products)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
            
        serializer = self.get_serializer(featured_products, many=True)
        return Response(serializer.data)
    
    def perform_create(self, serializer):
        # Ensure user is a seller
        if self.request.user.role != 'seller' or not self.request.user.seller_approved:
            raise PermissionError("Only approved sellers can create products")
        serializer.save(seller=self.request.user)
    
    def perform_update(self, serializer):
        # Ensure user owns the product
        if serializer.instance.seller != self.request.user:
            raise PermissionError("You can only update your own products")
        serializer.save()
    
    def perform_destroy(self, instance):
        # Ensure user owns the product
        if instance.seller != self.request.user:
            raise PermissionError("You can only delete your own products")
        instance.delete()
    
    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Get featured products"""
        featured = self.queryset.filter(is_featured=True)[:10]
        serializer = ProductListSerializer(featured, many=True, context={'request': request})
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def upload_image(self, request, pk=None):
        """Upload product image"""
        product = self.get_object()
        
        if product.seller != request.user:
            return Response(
                {'error': 'You can only upload images for your own products'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        image_file = request.FILES.get('image')
        if not image_file:
            return Response(
                {'error': 'No image file provided'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        is_primary = request.data.get('is_primary', False)
        alt_text = request.data.get('alt_text', '')
        order = request.data.get('order', 0)
        
        # If this is primary, unset other primary images
        if is_primary:
            ProductImage.objects.filter(product=product, is_primary=True).update(is_primary=False)
        
        product_image = ProductImage.objects.create(
            product=product,
            image=image_file,
            alt_text=alt_text,
            is_primary=is_primary,
            order=order
        )
        
        serializer = ProductImageSerializer(product_image, context={'request': request})
        return Response(serializer.data, status=status.HTTP_201_CREATED)


# Review ViewSet
class ReviewViewSet(viewsets.ModelViewSet):
    """ViewSet for Review model"""
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        product_id = self.request.query_params.get('product')
        if product_id:
            queryset = queryset.filter(product_id=product_id)
        return queryset
    
    def perform_create(self, serializer):
        if self.request.user.role != 'buyer':
            raise PermissionError("Only buyers can leave reviews")
        serializer.save(buyer=self.request.user)
    
    def perform_update(self, serializer):
        if serializer.instance.buyer != self.request.user:
            raise PermissionError("You can only update your own reviews")
        serializer.save()
    
    def perform_destroy(self, instance):
        if instance.buyer != self.request.user:
            raise PermissionError("You can only delete your own reviews")
        instance.delete()


# Order ViewSet
class OrderViewSet(viewsets.ModelViewSet):
    """ViewSet for Order model"""
    queryset = Order.objects.all()
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return OrderCreateSerializer
        return OrderSerializer
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'buyer':
            return Order.objects.filter(buyer=user)
        elif user.role == 'seller':
            # Sellers see orders containing their products
            return Order.objects.filter(items__seller=user).distinct()
        return Order.objects.none()
    
    def perform_create(self, serializer):
        if self.request.user.role != 'buyer':
            raise PermissionError("Only buyers can create orders")
        serializer.save()
    
    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):
        """Update order status (for sellers)"""
        order = self.get_object()
        new_status = request.data.get('status')
        
        if not new_status:
            return Response(
                {'error': 'Status is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Only sellers can update status
        if request.user.role != 'seller':
            return Response(
                {'error': 'Only sellers can update order status'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Check if seller has items in this order
        has_items = order.items.filter(seller=request.user).exists()
        if not has_items:
            return Response(
                {'error': 'You can only update orders containing your products'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        order.status = new_status
        order.save()
        
        serializer = OrderSerializer(order, context={'request': request})
        return Response(serializer.data)


# Cart ViewSet
class CartViewSet(viewsets.ViewSet):
    """ViewSet for Cart operations"""
    permission_classes = [IsAuthenticated]
    
    def list(self, request):
        """Get user's cart"""
        cart, _ = Cart.objects.get_or_create(buyer=request.user)
        serializer = CartSerializer(cart, context={'request': request})
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def add_item(self, request):
        """Add item to cart"""
        product_id = request.data.get('product_id')
        quantity = request.data.get('quantity', 1)
        
        if not product_id:
            return Response(
                {'error': 'Product ID is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        product = get_object_or_404(Product, id=product_id, is_active=True)
        
        if quantity > product.stock:
            return Response(
                {'error': 'Insufficient stock'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        cart, _ = Cart.objects.get_or_create(buyer=request.user)
        cart_item, created = CartItem.objects.get_or_create(
            cart=cart,
            product=product,
            defaults={'quantity': quantity}
        )
        
        if not created:
            cart_item.quantity += quantity
            if cart_item.quantity > product.stock:
                return Response(
                    {'error': 'Insufficient stock'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            cart_item.save()
        
        serializer = CartSerializer(cart, context={'request': request})
        return Response(serializer.data)
    
    @action(detail=False, methods=['patch'])
    def update_item(self, request):
        """Update cart item quantity"""
        item_id = request.data.get('item_id')
        quantity = request.data.get('quantity')
        
        if not item_id or quantity is None:
            return Response(
                {'error': 'Item ID and quantity are required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        cart_item = get_object_or_404(CartItem, id=item_id, cart__buyer=request.user)
        
        if quantity <= 0:
            cart_item.delete()
        else:
            if quantity > cart_item.product.stock:
                return Response(
                    {'error': 'Insufficient stock'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            cart_item.quantity = quantity
            cart_item.save()
        
        cart = cart_item.cart
        serializer = CartSerializer(cart, context={'request': request})
        return Response(serializer.data)
    
    @action(detail=False, methods=['delete'])
    def remove_item(self, request):
        """Remove item from cart"""
        item_id = request.data.get('item_id')
        
        if not item_id:
            return Response(
                {'error': 'Item ID is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        cart_item = get_object_or_404(CartItem, id=item_id, cart__buyer=request.user)
        cart = cart_item.cart
        cart_item.delete()
        
        serializer = CartSerializer(cart, context={'request': request})
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def clear(self, request):
        """Clear cart"""
        cart, _ = Cart.objects.get_or_create(buyer=request.user)
        cart.items.all().delete()
        
        serializer = CartSerializer(cart, context={'request': request})
        return Response(serializer.data)


# Wishlist ViewSet
class WishlistViewSet(viewsets.ViewSet):
    """ViewSet for Wishlist operations"""
    permission_classes = [IsAuthenticated]
    
    def list(self, request):
        """Get user's wishlist"""
        wishlist, _ = Wishlist.objects.get_or_create(buyer=request.user)
        serializer = WishlistSerializer(wishlist, context={'request': request})
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def add_product(self, request):
        """Add product to wishlist"""
        product_id = request.data.get('product_id')
        
        if not product_id:
            return Response(
                {'error': 'Product ID is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        product = get_object_or_404(Product, id=product_id, is_active=True)
        wishlist, _ = Wishlist.objects.get_or_create(buyer=request.user)
        wishlist.products.add(product)
        
        serializer = WishlistSerializer(wishlist, context={'request': request})
        return Response(serializer.data)
    
    @action(detail=False, methods=['delete'])
    def remove_product(self, request):
        """Remove product from wishlist"""
        product_id = request.data.get('product_id')
        
        if not product_id:
            return Response(
                {'error': 'Product ID is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        product = get_object_or_404(Product, id=product_id)
        wishlist, _ = Wishlist.objects.get_or_create(buyer=request.user)
        wishlist.products.remove(product)
        
        serializer = WishlistSerializer(wishlist, context={'request': request})
        return Response(serializer.data)


# Admin Views
class AdminViewSet(viewsets.ViewSet):
    """ViewSet for admin operations"""
    permission_classes = [IsAuthenticated, IsAdminUser]

    @action(detail=False, methods=['get'])
    def list_users(self, request):
        """List all users, with optional filter for pending sellers"""
        queryset = User.objects.all().order_by('-date_joined')
        
        pending_only = request.query_params.get('pending', None)
        if pending_only is not None:
            queryset = queryset.filter(role='seller', seller_approved=False)
            
        serializer = UserSerializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def approve_seller(self, request, pk=None):
        """Approve a seller application"""
        user = get_object_or_404(User, pk=pk)
        
        if user.role != 'seller':
            return Response({'error': 'This user is not a seller.'}, status=status.HTTP_400_BAD_REQUEST)
            
        user.seller_approved = True
        user.save()
        
        serializer = UserSerializer(user)
        return Response(serializer.data)
        
    @action(detail=False, methods=['get'])
    def pending_products(self, request):
        """List all products pending admin approval"""
        # Get products that are either not approved or not active
        pending_products = Product.objects.filter(
            is_approved=False  # Products that haven't been approved yet
        ).select_related('seller')
        
        # Add seller name and format the response
        products_data = []
        for product in pending_products:
            product_data = ProductListSerializer(product).data
            product_data['seller_name'] = product.seller.get_full_name() or product.seller.username
            product_data['created_at'] = product.created_at
            products_data.append(product_data)
        
        # Sort by creation date, newest first
        products_data.sort(key=lambda x: x['created_at'], reverse=True)
            
        return Response(products_data)
        
    @action(detail=False, methods=['post'], url_path='products/(?P<product_id>[^/.]+)/approve')
    def approve_product(self, request, product_id=None):
        """Approve a product"""
        try:
            product = get_object_or_404(Product, id=product_id)
            product.is_active = True
            product.is_approved = True
            product.save()
            
            return Response({
                'status': 'success',
                'message': 'Product approved successfully',
                'product_id': product.id
            })
        except Product.DoesNotExist:
            return Response({
                'status': 'error',
                'message': 'Product not found'
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)
        
    @action(detail=False, methods=['post'], url_path='products/(?P<product_id>[^/.]+)/reject')
    def reject_product(self, request, product_id=None):
        """Reject a product"""
        try:
            product = get_object_or_404(Product, id=product_id)
            product_data = {
                'id': product.id,
                'title': product.title,
                'seller': product.seller.username
            }
            product.delete()
            
            return Response({
                'status': 'success',
                'message': 'Product rejected and removed',
                'product': product_data
            })
        except Product.DoesNotExist:
            return Response({
                'status': 'error',
                'message': 'Product not found'
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)


# Seller Dashboard Views
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def seller_dashboard(request):
    """Get seller dashboard data"""
    if request.user.role != 'seller':
        return Response(
            {'error': 'Only sellers can access this endpoint'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    products = Product.objects.filter(seller=request.user)
    orders = OrderItem.objects.filter(seller=request.user)
    
    data = {
        'total_products': products.count(),
        'active_products': products.filter(is_active=True).count(),
        'total_orders': orders.count(),
        'pending_orders': orders.filter(order__status='pending').count(),
        'total_revenue': sum(item.subtotal for item in orders.filter(order__status='delivered')),
    }
    
    return Response(data)
