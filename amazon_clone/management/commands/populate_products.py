from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from amazon_clone.models import Category, Product, ProductImage, Review
from decimal import Decimal
import random

User = get_user_model()


class Command(BaseCommand):
    help = 'Populate database with sample categories, products, and reviews'

    def handle(self, *args, **kwargs):
        self.stdout.write('Starting database population...')
        
        # Create seller
        seller, _ = User.objects.get_or_create(
            username='demo_seller',
            defaults={
                'email': 'seller@example.com',
                'role': 'seller',
                'seller_approved': True,
                'first_name': 'Demo',
                'last_name': 'Seller'
            }
        )
        seller.set_password('demo123')
        seller.save()
        
        # Create buyers
        buyers = []
        buyer_names = [
            ('juan_perez', 'Juan', 'Pérez'),
            ('maria_garcia', 'María', 'García'),
            ('carlos_lopez', 'Carlos', 'López'),
            ('ana_martinez', 'Ana', 'Martínez'),
            ('pedro_rodriguez', 'Pedro', 'Rodríguez')
        ]
        
        for username, first_name, last_name in buyer_names:
            buyer, _ = User.objects.get_or_create(
                username=username,
                defaults={
                    'email': f'{username}@example.com',
                    'role': 'buyer',
                    'first_name': first_name,
                    'last_name': last_name
                }
            )
            buyer.set_password('demo123')
            buyer.save()
            buyers.append(buyer)
        
        # Categories and products data
        categories_data = self.get_categories_data()
        
        # Create categories and products
        for cat_name, cat_info in categories_data.items():
            category, _ = Category.objects.get_or_create(
                name=cat_name,
                defaults={'description': cat_info['description']}
            )
            self.stdout.write(f'Created category: {cat_name}')
            
            for product_data in cat_info['products']:
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
                        'is_featured': random.choice([True, False])
                    }
                )
                
                if created:
                    self.stdout.write(f'  - Created product: {product.title}')
                    
                    # Create reviews (2-5 reviews per product)
                    num_reviews = random.randint(2, 5)
                    review_buyers = random.sample(buyers, min(num_reviews, len(buyers)))
                    
                    for buyer in review_buyers:
                        rating = random.randint(3, 5)  # 3-5 stars
                        comments = self.get_review_comments(rating)
                        
                        Review.objects.get_or_create(
                            product=product,
                            buyer=buyer,
                            defaults={
                                'rating': rating,
                                'comment': random.choice(comments),
                                'is_verified_purchase': random.choice([True, False])
                            }
                        )
        
        self.stdout.write(self.style.SUCCESS('Database populated successfully!'))
    
    def get_review_comments(self, rating):
        comments = {
            5: [
                "¡Excelente producto! Superó mis expectativas. Totalmente recomendado.",
                "Calidad premium, llegó rápido y bien empaquetado. Muy satisfecho.",
                "El mejor producto que he comprado. Vale cada peso.",
                "Increíble calidad, justo como se describe. 5 estrellas merecidas."
            ],
            4: [
                "Muy buen producto, cumple con lo prometido. Recomendado.",
                "Buena calidad precio. Llegó en tiempo y forma.",
                "Satisfecho con la compra, aunque podría mejorar en algunos detalles.",
                "Buen producto en general, lo volvería a comprar."
            ],
            3: [
                "Producto aceptable, cumple su función básica.",
                "Está bien por el precio, aunque esperaba un poco más.",
                "Ni bueno ni malo, es lo que esperaba por el costo.",
                "Funciona correctamente, pero hay mejores opciones."
            ]
        }
        return comments.get(rating, comments[4])
    
    def get_categories_data(self):
        return {
            'Electrónica': {
                'description': 'Dispositivos electrónicos y gadgets tecnológicos',
                'products': [
                    {
                        'title': 'Smartphone Samsung Galaxy S23',
                        'description': 'Smartphone de última generación con pantalla AMOLED de 6.1", cámara de 50MP y procesador Snapdragon 8 Gen 2.',
                        'price': Decimal('899.99'),
                        'discount_price': Decimal('799.99'),
                        'stock': 50,
                        'specifications': {
                            'Pantalla': '6.1" AMOLED 120Hz',
                            'Procesador': 'Snapdragon 8 Gen 2',
                            'RAM': '8GB',
                            'Almacenamiento': '256GB',
                            'Cámara': '50MP + 12MP + 10MP',
                            'Batería': '3900mAh'
                        }
                    },
                    {
                        'title': 'Laptop HP Pavilion 15',
                        'description': 'Laptop potente con procesador Intel Core i7, 16GB RAM y SSD de 512GB.',
                        'price': Decimal('1299.99'),
                        'discount_price': Decimal('1099.99'),
                        'stock': 30,
                        'specifications': {
                            'Procesador': 'Intel Core i7-12700H',
                            'RAM': '16GB DDR4',
                            'Almacenamiento': '512GB SSD NVMe',
                            'Pantalla': '15.6" Full HD IPS',
                            'Gráficos': 'Intel Iris Xe'
                        }
                    },
                    {
                        'title': 'Auriculares Sony WH-1000XM5',
                        'description': 'Auriculares inalámbricos con cancelación de ruido líder en la industria.',
                        'price': Decimal('399.99'),
                        'discount_price': Decimal('349.99'),
                        'stock': 75,
                        'specifications': {
                            'Tipo': 'Over-ear inalámbricos',
                            'Cancelación de ruido': 'Activa (ANC)',
                            'Conectividad': 'Bluetooth 5.2',
                            'Batería': 'Hasta 30 horas',
                            'Peso': '250g'
                        }
                    },
                    {
                        'title': 'Tablet iPad Air 2024',
                        'description': 'Tablet versátil con chip M1 y pantalla Liquid Retina de 10.9".',
                        'price': Decimal('649.99'),
                        'discount_price': None,
                        'stock': 40,
                        'specifications': {
                            'Chip': 'Apple M1',
                            'Pantalla': '10.9" Liquid Retina',
                            'Almacenamiento': '256GB',
                            'Cámara': '12MP trasera y frontal',
                            'Conectividad': 'Wi-Fi 6, Bluetooth 5.0'
                        }
                    },
                    {
                        'title': 'Smartwatch Apple Watch Series 9',
                        'description': 'Reloj inteligente con pantalla siempre activa y monitoreo de salud avanzado.',
                        'price': Decimal('429.99'),
                        'discount_price': Decimal('399.99'),
                        'stock': 60,
                        'specifications': {
                            'Pantalla': 'OLED Retina siempre activa',
                            'Chip': 'S9 SiP',
                            'Sensores': 'ECG, oxígeno, temperatura',
                            'GPS': 'Integrado',
                            'Resistencia': 'Agua 50m'
                        }
                    }
                ]
            },
            'Moda': {
                'description': 'Ropa y calzado para todas las ocasiones',
                'products': [
                    {
                        'title': 'Zapatillas Nike Air Max 270',
                        'description': 'Zapatillas deportivas con tecnología Air Max para máxima comodidad.',
                        'price': Decimal('159.99'),
                        'discount_price': Decimal('129.99'),
                        'stock': 100,
                        'specifications': {
                            'Marca': 'Nike',
                            'Material': 'Malla y sintético',
                            'Suela': 'Goma',
                            'Tecnología': 'Air Max',
                            'Tallas': '36-45'
                        }
                    },
                    {
                        'title': 'Jeans Levi\'s 501 Original',
                        'description': 'Jeans clásicos de corte recto en denim de alta calidad.',
                        'price': Decimal('89.99'),
                        'discount_price': Decimal('69.99'),
                        'stock': 120,
                        'specifications': {
                            'Marca': 'Levi\'s',
                            'Material': '100% Algodón Denim',
                            'Corte': 'Recto',
                            'Cierre': 'Botones',
                            'Tallas': '28-38'
                        }
                    },
                    {
                        'title': 'Chaqueta de Cuero Sintético',
                        'description': 'Chaqueta elegante con forro interior y múltiples bolsillos.',
                        'price': Decimal('129.99'),
                        'discount_price': None,
                        'stock': 45,
                        'specifications': {
                            'Material': 'Cuero sintético premium',
                            'Forro': 'Poliéster',
                            'Cierre': 'Cremallera frontal',
                            'Bolsillos': '4 exteriores, 2 interiores',
                            'Tallas': 'S, M, L, XL, XXL'
                        }
                    },
                    {
                        'title': 'Vestido Floral de Verano',
                        'description': 'Vestido ligero con estampado floral, ideal para días cálidos.',
                        'price': Decimal('59.99'),
                        'discount_price': Decimal('44.99'),
                        'stock': 80,
                        'specifications': {
                            'Material': '95% Algodón, 5% Elastano',
                            'Largo': 'Midi',
                            'Manga': 'Corta',
                            'Estampado': 'Floral multicolor',
                            'Tallas': 'XS, S, M, L, XL'
                        }
                    },
                    {
                        'title': 'Camisa Formal Ralph Lauren',
                        'description': 'Camisa de vestir slim fit en algodón egipcio de primera calidad.',
                        'price': Decimal('79.99'),
                        'discount_price': Decimal('64.99'),
                        'stock': 90,
                        'specifications': {
                            'Marca': 'Ralph Lauren',
                            'Material': '100% Algodón egipcio',
                            'Corte': 'Slim Fit',
                            'Cuello': 'Italiano',
                            'Tallas': 'S, M, L, XL, XXL'
                        }
                    }
                ]
            },
            'Accesorios': {
                'description': 'Complementos y accesorios para tu estilo de vida',
                'products': [
                    {
                        'title': 'Mochila Antirrobo USB',
                        'description': 'Mochila moderna con puerto USB y diseño antirrobo.',
                        'price': Decimal('49.99'),
                        'discount_price': Decimal('39.99'),
                        'stock': 150,
                        'specifications': {
                            'Material': 'Poliéster resistente al agua',
                            'Capacidad': '30 litros',
                            'Puerto USB': 'Integrado',
                            'Compartimentos': 'Laptop 15.6"',
                            'Dimensiones': '45 x 30 x 15 cm'
                        }
                    },
                    {
                        'title': 'Gafas de Sol Ray-Ban Aviator',
                        'description': 'Gafas clásicas con lentes polarizadas y protección UV400.',
                        'price': Decimal('159.99'),
                        'discount_price': Decimal('139.99'),
                        'stock': 70,
                        'specifications': {
                            'Marca': 'Ray-Ban',
                            'Modelo': 'Aviator Classic',
                            'Lentes': 'Polarizadas UV400',
                            'Material': 'Metal',
                            'Tamaño': '58mm, 62mm'
                        }
                    },
                    {
                        'title': 'Billetera de Cuero Genuino',
                        'description': 'Billetera elegante con múltiples compartimentos.',
                        'price': Decimal('39.99'),
                        'discount_price': None,
                        'stock': 200,
                        'specifications': {
                            'Material': 'Cuero genuino',
                            'Compartimentos': '8 ranuras para tarjetas',
                            'Bolsillos': '2 para billetes, 1 con cremallera',
                            'Dimensiones': '11 x 9 x 2 cm'
                        }
                    },
                    {
                        'title': 'Reloj Casio G-Shock',
                        'description': 'Reloj deportivo resistente a golpes y agua con múltiples funciones.',
                        'price': Decimal('119.99'),
                        'discount_price': Decimal('99.99'),
                        'stock': 85,
                        'specifications': {
                            'Marca': 'Casio',
                            'Resistencia': 'Golpes y agua 200m',
                            'Funciones': 'Cronómetro, alarma, luz LED',
                            'Batería': '2 años',
                            'Material': 'Resina'
                        }
                    },
                    {
                        'title': 'Cinturón de Cuero Reversible',
                        'description': 'Cinturón versátil con hebilla giratoria. Dos colores en uno.',
                        'price': Decimal('34.99'),
                        'discount_price': Decimal('27.99'),
                        'stock': 110,
                        'specifications': {
                            'Material': 'Cuero genuino',
                            'Hebilla': 'Acero inoxidable',
                            'Reversible': 'Negro/Marrón',
                            'Ancho': '3.5 cm',
                            'Tallas': '85-110 cm'
                        }
                    }
                ]
            },
            'Hogar y Cocina': {
                'description': 'Productos para el hogar y utensilios de cocina',
                'products': [
                    {
                        'title': 'Cafetera Nespresso Vertuo',
                        'description': 'Cafetera de cápsulas con tecnología Centrifusion.',
                        'price': Decimal('179.99'),
                        'discount_price': Decimal('149.99'),
                        'stock': 55,
                        'specifications': {
                            'Marca': 'Nespresso',
                            'Tecnología': 'Centrifusion',
                            'Capacidad': '1.1 litros',
                            'Presión': '19 bares',
                            'Potencia': '1500W'
                        }
                    },
                    {
                        'title': 'Juego de Sartenes Antiadherentes',
                        'description': 'Set de 3 sartenes con recubrimiento de cerámica.',
                        'price': Decimal('89.99'),
                        'discount_price': Decimal('69.99'),
                        'stock': 65,
                        'specifications': {
                            'Material': 'Aluminio forjado',
                            'Recubrimiento': 'Cerámica antiadherente',
                            'Tamaños': '20cm, 24cm, 28cm',
                            'Compatible': 'Todo tipo de cocinas',
                            'Libre de': 'PFOA, PFOS'
                        }
                    },
                    {
                        'title': 'Aspiradora Robot iRobot Roomba',
                        'description': 'Robot aspirador inteligente con mapeo y control por app.',
                        'price': Decimal('399.99'),
                        'discount_price': Decimal('349.99'),
                        'stock': 35,
                        'specifications': {
                            'Marca': 'iRobot',
                            'Navegación': 'Mapeo inteligente',
                            'Batería': '75 minutos',
                            'Control': 'App, Alexa, Google',
                            'Base': 'Autovaciado incluida'
                        }
                    },
                    {
                        'title': 'Licuadora de Alta Potencia',
                        'description': 'Licuadora profesional de 1200W con jarra de vidrio.',
                        'price': Decimal('129.99'),
                        'discount_price': None,
                        'stock': 75,
                        'specifications': {
                            'Potencia': '1200W',
                            'Jarra': 'Vidrio 2 litros',
                            'Velocidades': '10 + pulso',
                            'Cuchillas': 'Acero inoxidable 6 puntas'
                        }
                    },
                    {
                        'title': 'Juego de Cuchillos Profesionales',
                        'description': 'Set de 8 cuchillos de acero inoxidable con soporte de bambú.',
                        'price': Decimal('79.99'),
                        'discount_price': Decimal('64.99'),
                        'stock': 90,
                        'specifications': {
                            'Material': 'Acero inoxidable alemán',
                            'Piezas': '8 cuchillos + soporte',
                            'Incluye': 'Chef, pan, santoku, utilidad',
                            'Soporte': 'Bambú natural'
                        }
                    }
                ]
            },
            'Deportes': {
                'description': 'Equipamiento deportivo y fitness',
                'products': [
                    {
                        'title': 'Bicicleta de Montaña Trek',
                        'description': 'Bicicleta MTB con suspensión delantera y 21 velocidades.',
                        'price': Decimal('599.99'),
                        'discount_price': Decimal('499.99'),
                        'stock': 25,
                        'specifications': {
                            'Marca': 'Trek',
                            'Cuadro': 'Aluminio ligero',
                            'Suspensión': 'Delantera 100mm',
                            'Velocidades': '21 (3x7)',
                            'Frenos': 'Disco mecánicos'
                        }
                    },
                    {
                        'title': 'Pesas Ajustables 20kg',
                        'description': 'Set de mancuernas ajustables de 2.5 a 20kg.',
                        'price': Decimal('149.99'),
                        'discount_price': Decimal('129.99'),
                        'stock': 60,
                        'specifications': {
                            'Peso': '2.5kg a 20kg',
                            'Incrementos': '2.5kg',
                            'Material': 'Hierro fundido',
                            'Incluye': 'Soporte de almacenamiento'
                        }
                    },
                    {
                        'title': 'Esterilla de Yoga Premium',
                        'description': 'Esterilla antideslizante de 6mm con bolsa de transporte.',
                        'price': Decimal('39.99'),
                        'discount_price': Decimal('29.99'),
                        'stock': 120,
                        'specifications': {
                            'Grosor': '6mm',
                            'Dimensiones': '183 x 61 cm',
                            'Material': 'TPE ecológico',
                            'Superficie': 'Antideslizante',
                            'Incluye': 'Bolsa de transporte'
                        }
                    },
                    {
                        'title': 'Balón de Fútbol Adidas',
                        'description': 'Balón oficial con tecnología de paneles termosellados.',
                        'price': Decimal('49.99'),
                        'discount_price': None,
                        'stock': 100,
                        'specifications': {
                            'Marca': 'Adidas',
                            'Tamaño': '5 (oficial)',
                            'Material': 'Cuero sintético premium',
                            'Certificación': 'FIFA Quality'
                        }
                    },
                    {
                        'title': 'Cuerda de Saltar Profesional',
                        'description': 'Cuerda con rodamientos de bolas y mangos ergonómicos.',
                        'price': Decimal('19.99'),
                        'discount_price': Decimal('14.99'),
                        'stock': 150,
                        'specifications': {
                            'Cable': 'Acero recubierto PVC',
                            'Longitud': 'Ajustable hasta 3m',
                            'Rodamientos': 'Bolas alta velocidad',
                            'Uso': 'CrossFit, boxeo, fitness'
                        }
                    }
                ]
            },
            'Libros': {
                'description': 'Libros de diversos géneros y temáticas',
                'products': [
                    {
                        'title': 'Cien Años de Soledad',
                        'description': 'Obra maestra del realismo mágico de Gabriel García Márquez.',
                        'price': Decimal('24.99'),
                        'discount_price': Decimal('19.99'),
                        'stock': 80,
                        'specifications': {
                            'Autor': 'Gabriel García Márquez',
                            'Editorial': 'Editorial Sudamericana',
                            'Páginas': '496',
                            'Idioma': 'Español',
                            'Formato': 'Tapa blanda'
                        }
                    },
                    {
                        'title': 'El Principito',
                        'description': 'Clásico de la literatura universal de Antoine de Saint-Exupéry.',
                        'price': Decimal('14.99'),
                        'discount_price': Decimal('11.99'),
                        'stock': 150,
                        'specifications': {
                            'Autor': 'Antoine de Saint-Exupéry',
                            'Editorial': 'Salamandra',
                            'Páginas': '96',
                            'Idioma': 'Español',
                            'Ilustraciones': 'A color'
                        }
                    },
                    {
                        'title': 'Sapiens: De animales a dioses',
                        'description': 'Historia de la humanidad por Yuval Noah Harari.',
                        'price': Decimal('29.99'),
                        'discount_price': None,
                        'stock': 70,
                        'specifications': {
                            'Autor': 'Yuval Noah Harari',
                            'Editorial': 'Debate',
                            'Páginas': '496',
                            'Idioma': 'Español',
                            'Género': 'Historia, Ensayo'
                        }
                    },
                    {
                        'title': 'Hábitos Atómicos',
                        'description': 'Guía práctica para formar buenos hábitos por James Clear.',
                        'price': Decimal('19.99'),
                        'discount_price': Decimal('16.99'),
                        'stock': 95,
                        'specifications': {
                            'Autor': 'James Clear',
                            'Editorial': 'Paidós',
                            'Páginas': '328',
                            'Idioma': 'Español',
                            'Género': 'Autoayuda, Desarrollo personal'
                        }
                    },
                    {
                        'title': 'Don Quijote de la Mancha',
                        'description': 'Obra cumbre de Miguel de Cervantes.',
                        'price': Decimal('34.99'),
                        'discount_price': Decimal('27.99'),
                        'stock': 60,
                        'specifications': {
                            'Autor': 'Miguel de Cervantes',
                            'Editorial': 'Real Academia Española',
                            'Páginas': '1248',
                            'Idioma': 'Español',
                            'Edición': 'Completa ilustrada'
                        }
                    }
                ]
            }
        }
