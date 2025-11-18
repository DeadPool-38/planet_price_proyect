from amazon_clone.models import Category, Product, Review, User

print("=" * 50)
print("RESUMEN DE DATOS POBLADOS")
print("=" * 50)

print(f"\n📊 Estadísticas generales:")
print(f"  • Categorías: {Category.objects.count()}")
print(f"  • Productos: {Product.objects.count()}")
print(f"  • Reviews: {Review.objects.count()}")
print(f"  • Usuarios: {User.objects.count()}")

print(f"\n📁 Productos por categoría:")
for cat in Category.objects.all():
    print(f"  • {cat.name}: {cat.products.count()} productos")

print(f"\n⭐ Ejemplo de productos con ratings:")
for product in Product.objects.all()[:5]:
    avg_rating = product.average_rating
    review_count = product.review_count
    print(f"  • {product.title}")
    print(f"    Rating: {avg_rating:.1f}/5.0 ({review_count} reviews)")
    print(f"    Precio: ${product.price} {'→ $' + str(product.discount_price) if product.discount_price else ''}")

print(f"\n✅ ¡Base de datos poblada exitosamente!")
print("=" * 50)
