from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.core.files.base import ContentFile
from amazon_clone.models import Category, Product, ProductImage
from decimal import Decimal
import requests

User = get_user_model()


class Command(BaseCommand):
    help = 'Add Video Juegos category with products and images'

    def handle(self, *args, **kwargs):
        self.stdout.write('Adding Video Juegos category...')
        
        # Get or create seller
        seller = User.objects.filter(role='seller', seller_approved=True).first()
        if not seller:
            seller = User.objects.filter(is_superuser=True).first()
        
        if not seller:
            self.stdout.write(self.style.ERROR('No seller found. Please create a seller first.'))
            return
        
        # Create Video Juegos category
        category, created = Category.objects.get_or_create(
            name='Video Juegos',
            defaults={
                'description': 'Los mejores videojuegos para todas las plataformas: PlayStation, Xbox, Nintendo Switch y PC'
            }
        )
        
        if created:
            self.stdout.write(self.style.SUCCESS(f'✓ Created category: Video Juegos'))
        else:
            self.stdout.write(self.style.WARNING(f'! Category already exists: Video Juegos'))
        
        # Video games products data
        products_data = [
            {
                'title': 'The Legend of Zelda: Tears of the Kingdom',
                'description': 'La secuela del aclamado Breath of the Wild. Explora los cielos y las profundidades de Hyrule en una aventura épica. Incluye nuevas habilidades, enemigos y mazmorras desafiantes.',
                'price': Decimal('59.99'),
                'discount_price': Decimal('54.99'),
                'stock': 150,
                'specifications': {
                    'Plataforma': 'Nintendo Switch',
                    'Género': 'Aventura, Acción',
                    'Jugadores': '1 jugador',
                    'Clasificación': 'E10+ (Everyone 10+)',
                    'Desarrollador': 'Nintendo EPD',
                    'Fecha de lanzamiento': '2023',
                    'Idiomas': 'Español, Inglés, Francés, Alemán, Italiano'
                },
                'images': [
                    'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=800&q=80',  # Zelda themed
                    'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80',  # Gaming
                ]
            },
            {
                'title': 'Elden Ring',
                'description': 'El juego de rol de acción definitivo creado por FromSoftware y George R.R. Martin. Explora un vasto mundo abierto lleno de peligros, misterios y jefes épicos.',
                'price': Decimal('49.99'),
                'discount_price': Decimal('39.99'),
                'stock': 200,
                'specifications': {
                    'Plataforma': 'PlayStation 5, Xbox Series X/S, PC',
                    'Género': 'RPG, Acción',
                    'Jugadores': '1 jugador (multijugador online)',
                    'Clasificación': 'M (Mature 17+)',
                    'Desarrollador': 'FromSoftware',
                    'Fecha de lanzamiento': '2022',
                    'Idiomas': 'Español, Inglés, Japonés'
                },
                'images': [
                    'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80',  # Gaming setup
                    'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&q=80',  # Controller
                ]
            },
            {
                'title': 'FIFA 24',
                'description': 'La experiencia de fútbol más realista con HyperMotionV, nuevos modos de juego y todas las ligas oficiales. Juega con tus equipos favoritos y crea tu Ultimate Team.',
                'price': Decimal('69.99'),
                'discount_price': Decimal('49.99'),
                'stock': 300,
                'specifications': {
                    'Plataforma': 'PlayStation 5, Xbox Series X/S, PC, PS4, Xbox One',
                    'Género': 'Deportes, Simulación',
                    'Jugadores': '1-4 jugadores (multijugador online)',
                    'Clasificación': 'E (Everyone)',
                    'Desarrollador': 'EA Sports',
                    'Fecha de lanzamiento': '2023',
                    'Idiomas': 'Español, Inglés, Francés, Alemán, Italiano, Portugués'
                },
                'images': [
                    'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80',  # Soccer/Gaming
                    'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&q=80',  # Gaming
                ]
            },
            {
                'title': 'Hogwarts Legacy',
                'description': 'Vive tu propia aventura en el mundo mágico de Harry Potter. Explora Hogwarts, aprende hechizos, doma criaturas mágicas y descubre los secretos del mundo mágico en 1890.',
                'price': Decimal('59.99'),
                'discount_price': None,
                'stock': 180,
                'specifications': {
                    'Plataforma': 'PlayStation 5, Xbox Series X/S, PC, PS4, Xbox One, Switch',
                    'Género': 'RPG, Acción, Aventura',
                    'Jugadores': '1 jugador',
                    'Clasificación': 'T (Teen)',
                    'Desarrollador': 'Avalanche Software',
                    'Fecha de lanzamiento': '2023',
                    'Idiomas': 'Español, Inglés, Francés, Alemán, Italiano'
                },
                'images': [
                    'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=800&q=80',  # Fantasy gaming
                    'https://images.unsplash.com/photo-1556438064-2d7646166914?w=800&q=80',  # Gaming
                ]
            },
            {
                'title': 'Super Mario Bros. Wonder',
                'description': 'Una nueva aventura 2D de Mario con transformaciones sorprendentes, niveles creativos y multijugador local para hasta 4 jugadores. La magia de Mario en su máxima expresión.',
                'price': Decimal('59.99'),
                'discount_price': Decimal('54.99'),
                'stock': 250,
                'specifications': {
                    'Plataforma': 'Nintendo Switch',
                    'Género': 'Plataformas, Aventura',
                    'Jugadores': '1-4 jugadores',
                    'Clasificación': 'E (Everyone)',
                    'Desarrollador': 'Nintendo EPD',
                    'Fecha de lanzamiento': '2023',
                    'Idiomas': 'Español, Inglés, Francés, Alemán, Italiano, Japonés'
                },
                'images': [
                    'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=800&q=80',  # Retro gaming
                    'https://images.unsplash.com/photo-1486401899868-0e435ed85128?w=800&q=80',  # Gaming
                ]
            },
            {
                'title': 'Call of Duty: Modern Warfare III',
                'description': 'La última entrega de la franquicia COD con campaña épica, multijugador competitivo y el regreso del modo Zombies. Gráficos de nueva generación y acción trepidante.',
                'price': Decimal('69.99'),
                'discount_price': Decimal('59.99'),
                'stock': 220,
                'specifications': {
                    'Plataforma': 'PlayStation 5, Xbox Series X/S, PC, PS4, Xbox One',
                    'Género': 'Shooter, Acción',
                    'Jugadores': '1 jugador (multijugador online masivo)',
                    'Clasificación': 'M (Mature 17+)',
                    'Desarrollador': 'Sledgehammer Games',
                    'Fecha de lanzamiento': '2023',
                    'Idiomas': 'Español, Inglés, Francés, Alemán, Italiano, Portugués'
                },
                'images': [
                    'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=800&q=80',  # Gaming action
                    'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=800&q=80',  # Gaming setup
                ]
            },
            {
                'title': 'Baldur\'s Gate 3',
                'description': 'El RPG definitivo basado en Dungeons & Dragons. Crea tu personaje, forma tu grupo y embárcate en una aventura épica con decisiones que importan y combate táctico por turnos.',
                'price': Decimal('59.99'),
                'discount_price': None,
                'stock': 150,
                'specifications': {
                    'Plataforma': 'PC, PlayStation 5, Xbox Series X/S',
                    'Género': 'RPG, Estrategia',
                    'Jugadores': '1 jugador (multijugador cooperativo)',
                    'Clasificación': 'M (Mature 17+)',
                    'Desarrollador': 'Larian Studios',
                    'Fecha de lanzamiento': '2023',
                    'Idiomas': 'Español, Inglés, Francés, Alemán, Italiano'
                },
                'images': [
                    'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&q=80',  # Fantasy RPG
                    'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=800&q=80',  # Gaming
                ]
            },
            {
                'title': 'Spider-Man 2',
                'description': 'Juega como Peter Parker y Miles Morales en esta secuela épica. Nuevos poderes, villanos icónicos y una Nueva York más grande que nunca. Exclusivo de PlayStation 5.',
                'price': Decimal('69.99'),
                'discount_price': Decimal('64.99'),
                'stock': 175,
                'specifications': {
                    'Plataforma': 'PlayStation 5',
                    'Género': 'Acción, Aventura',
                    'Jugadores': '1 jugador',
                    'Clasificación': 'T (Teen)',
                    'Desarrollador': 'Insomniac Games',
                    'Fecha de lanzamiento': '2023',
                    'Idiomas': 'Español, Inglés, Francés, Alemán, Italiano, Portugués'
                },
                'images': [
                    'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=800&q=80',  # Superhero gaming
                    'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800&q=80',  # PS5 gaming
                ]
            },
            {
                'title': 'Starfield',
                'description': 'El RPG espacial de Bethesda. Explora más de 1000 planetas, personaliza tu nave, únete a diferentes facciones y descubre los misterios del universo en esta épica aventura.',
                'price': Decimal('69.99'),
                'discount_price': Decimal('54.99'),
                'stock': 190,
                'specifications': {
                    'Plataforma': 'Xbox Series X/S, PC',
                    'Género': 'RPG, Acción, Ciencia Ficción',
                    'Jugadores': '1 jugador',
                    'Clasificación': 'M (Mature 17+)',
                    'Desarrollador': 'Bethesda Game Studios',
                    'Fecha de lanzamiento': '2023',
                    'Idiomas': 'Español, Inglés, Francés, Alemán, Italiano, Japonés'
                },
                'images': [
                    'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&q=80',  # Sci-fi gaming
                    'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=800&q=80',  # Gaming
                ]
            },
            {
                'title': 'Resident Evil 4 Remake',
                'description': 'El clásico de survival horror reimaginado con gráficos de nueva generación. Revive la historia de Leon S. Kennedy con mecánicas modernas y terror intenso.',
                'price': Decimal('59.99'),
                'discount_price': Decimal('44.99'),
                'stock': 160,
                'specifications': {
                    'Plataforma': 'PlayStation 5, Xbox Series X/S, PC, PS4',
                    'Género': 'Survival Horror, Acción',
                    'Jugadores': '1 jugador',
                    'Clasificación': 'M (Mature 17+)',
                    'Desarrollador': 'Capcom',
                    'Fecha de lanzamiento': '2023',
                    'Idiomas': 'Español, Inglés, Francés, Alemán, Italiano, Japonés'
                },
                'images': [
                    'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80',  # Horror gaming
                    'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&q=80',  # Gaming
                ]
            }
        ]
        
        # Create products and download images
        for product_data in products_data:
            product, created = Product.objects.get_or_create(
                title=product_data['title'],
                defaults={
                    'seller': seller,
                    'category': category,
                    'description': product_data['description'],
                    'price': product_data['price'],
                    'discount_price': product_data.get('discount_price'),
                    'stock': product_data['stock'],
                    'specifications': product_data['specifications'],
                    'is_featured': True
                }
            )
            
            if created:
                self.stdout.write(self.style.SUCCESS(f'  ✓ Created product: {product.title}'))
                
                # Delete existing images
                ProductImage.objects.filter(product=product).delete()
                
                # Download and add images
                for idx, image_url in enumerate(product_data['images']):
                    try:
                        response = requests.get(image_url, timeout=10)
                        if response.status_code == 200:
                            image_content = ContentFile(response.content)
                            filename = f"{product.slug}_{idx}.jpg"
                            
                            product_image = ProductImage(
                                product=product,
                                alt_text=product.title,
                                is_primary=(idx == 0),
                                order=idx
                            )
                            product_image.image.save(filename, image_content, save=True)
                            
                            self.stdout.write(
                                self.style.SUCCESS(f'    ✓ Added image {idx + 1} to: {product.title}')
                            )
                    except Exception as e:
                        self.stdout.write(
                            self.style.ERROR(f'    ✗ Failed to download image for {product.title}: {str(e)}')
                        )
            else:
                self.stdout.write(self.style.WARNING(f'  ! Product already exists: {product.title}'))
        
        self.stdout.write(self.style.SUCCESS('\n✓ Video Juegos category setup completed!'))
        self.stdout.write(self.style.SUCCESS(f'Total products added: {len(products_data)}'))
