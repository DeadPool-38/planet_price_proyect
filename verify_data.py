import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'bloquesite.settings')
django.setup()

from amazon_clone.models import Category, Product, Review, User

print("=" * 60)
print("RESUMEN DE DATOS POBLADOS EN LA BASE DE DATOS")
print("=" * 60)

categories = Category.objects.count()
products = Product.objects.count()
reviews = Review.objects.count()
users = User.objects.count()

print(f"\nEstadisticas generales:")
print(f"  Categorias creadas: {categories}")
print(f"  Productos creados: {products}")
print(f"  Reviews creadas: {reviews}")
print(f"  Usuarios creados: {users}")

print(f"\nProductos por categoria:")
for cat in Category.objects.all():
    count = cat.products.count()
    print(f"  {cat.name}: {count} productos")

print(f"\nEjemplo de productos con calificaciones:")
for product in Product.objects.all()[:8]:
    avg = product.average_rating
    count = product.review_count
    specs_count = len(product.specifications.keys()) if product.specifications else 0
    print(f"\n  {product.title}")
    print(f"    Categoria: {product.category.name}")
    print(f"    Calificacion: {avg:.1f}/5.0 estrellas ({count} reviews)")
    print(f"    Precio: ${product.price}", end="")
    if product.discount_price:
        print(f" -> ${product.discount_price} (-{product.discount_percentage}%)")
    else:
        print()
    print(f"    Especificaciones: {specs_count} caracteristicas")
    print(f"    Stock: {product.stock} unidades")

print("\n" + "=" * 60)
print("BASE DE DATOS POBLADA EXITOSAMENTE!")
print("=" * 60)
