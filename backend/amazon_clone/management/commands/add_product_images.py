from django.core.management.base import BaseCommand
from django.core.files.base import ContentFile
from amazon_clone.models import Product, ProductImage
import requests
from io import BytesIO


class Command(BaseCommand):
    help = 'Add high-quality modern images to existing products'

    def handle(self, *args, **kwargs):
        self.stdout.write('Adding images to products...')
        
        # Modern high-quality product images from Unsplash
        product_images = {
            # Electrónica
            'Smartphone Samsung Galaxy S23': [
                'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&q=80',  # Samsung phone
            ],
            'Laptop HP Pavilion 15': [
                'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80',  # Modern laptop
            ],
            'Auriculares Sony WH-1000XM5': [
                'https://images.unsplash.com/photo-1545127398-14699f92334b?w=800&q=80',  # Premium headphones
            ],
            'Tablet iPad Air 2024': [
                'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80',  # iPad tablet
            ],
            'Smartwatch Apple Watch Series 9': [
                'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&q=80',  # Apple Watch
            ],
            
            # Moda
            'Zapatillas Nike Air Max 270': [
                'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',  # Nike sneakers
            ],
            "Jeans Levi's 501 Original": [
                'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80',  # Jeans
            ],
            'Chaqueta de Cuero Sintético': [
                'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80',  # Leather jacket
            ],
            'Vestido Floral de Verano': [
                'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80',  # Summer dress
            ],
            'Camisa Formal Ralph Lauren': [
                'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=80',  # Formal shirt
            ],
            
            # Accesorios
            'Mochila Antirrobo USB': [
                'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',  # Modern backpack
            ],
            'Gafas de Sol Ray-Ban Aviator': [
                'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80',  # Sunglasses
            ],
            'Billetera de Cuero Genuino': [
                'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&q=80',  # Leather wallet
            ],
            'Reloj Casio G-Shock': [
                'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',  # Watch
            ],
            'Cinturón de Cuero Reversible': [
                'https://images.unsplash.com/photo-1624222247344-550fb60583b1?w=800&q=80',  # Leather belt
            ],
            
            # Hogar y Cocina
            'Cafetera Nespresso Vertuo': [
                'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800&q=80',  # Coffee maker
            ],
            'Juego de Sartenes Antiadherentes': [
                'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',  # Pans
            ],
            'Aspiradora Robot iRobot Roomba': [
                'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800&q=80',  # Robot vacuum
            ],
            'Licuadora de Alta Potencia': [
                'https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&q=80',  # Blender
            ],
            'Juego de Cuchillos Profesionales': [
                'https://images.unsplash.com/photo-1593618998160-e34014e67546?w=800&q=80',  # Kitchen knives
            ],
            
            # Deportes
            'Bicicleta de Montaña Trek': [
                'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=800&q=80',  # Mountain bike
            ],
            'Pesas Ajustables 20kg': [
                'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&q=80',  # Dumbbells
            ],
            'Esterilla de Yoga Premium': [
                'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&q=80',  # Yoga mat
            ],
            'Balón de Fútbol Adidas': [
                'https://images.unsplash.com/photo-1614632537423-1e6c2e7e0aab?w=800&q=80',  # Soccer ball
            ],
            'Cuerda de Saltar Profesional': [
                'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=800&q=80',  # Jump rope
            ],
            
            # Libros
            'Cien Años de Soledad': [
                'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80',  # Book
            ],
            'El Principito': [
                'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80',  # Book
            ],
            'Sapiens: De animales a dioses': [
                'https://images.unsplash.com/photo-1589998059171-988d887df646?w=800&q=80',  # Book
            ],
            'Hábitos Atómicos': [
                'https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=800&q=80',  # Book
            ],
            'Don Quijote de la Mancha': [
                'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80',  # Classic book
            ],
        }
        
        for product_title, image_urls in product_images.items():
            try:
                product = Product.objects.get(title=product_title)
                
                # Delete existing images
                ProductImage.objects.filter(product=product).delete()
                
                # Add new images
                for idx, image_url in enumerate(image_urls):
                    try:
                        response = requests.get(image_url, timeout=10)
                        if response.status_code == 200:
                            image_content = ContentFile(response.content)
                            filename = f"{product.slug}_{idx}.jpg"
                            
                            product_image = ProductImage(
                                product=product,
                                alt_text=product.title,
                                is_primary=(idx == 0),  # First image is primary
                                order=idx
                            )
                            product_image.image.save(filename, image_content, save=True)
                            
                            self.stdout.write(
                                self.style.SUCCESS(f'  ✓ Added image {idx + 1} to: {product.title}')
                            )
                    except Exception as e:
                        self.stdout.write(
                            self.style.ERROR(f'  ✗ Failed to download image for {product.title}: {str(e)}')
                        )
                        
            except Product.DoesNotExist:
                self.stdout.write(
                    self.style.WARNING(f'  ! Product not found: {product_title}')
                )
            except Exception as e:
                self.stdout.write(
                    self.style.ERROR(f'  ✗ Error processing {product_title}: {str(e)}')
                )
        
        self.stdout.write(self.style.SUCCESS('\n✓ Image addition process completed!'))
