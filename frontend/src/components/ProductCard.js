import React, { useMemo } from 'react';
import { Card, Badge, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { FaCrown } from 'react-icons/fa';

const ProductCard = ({ product }) => {
  const { t } = useTranslation();
  const { addToCart } = useCart();
  const { isAuthenticated, isBuyer } = useAuth();
  
  // Check if product is a Prime product (randomly assigned based on product ID)
  const isPrime = useMemo(() => {
    // Use a simple hash of the product ID to ensure consistent results
    const hash = product.id.toString().split('').reduce((acc, char) => {
      return ((acc << 5) - acc) + char.charCodeAt(0);
    }, 0);
    // About 20% of products will be Prime
    return Math.abs(hash) % 5 === 0;
  }, [product.id]);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }
    
    if (isBuyer) {
      await addToCart(product.id);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={`full-${i}`} className="bi bi-star-fill text-warning"></i>);
    }
    if (hasHalfStar) {
      stars.push(<i key="half" className="bi bi-star-half text-warning"></i>);
    }
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={`empty-${i}`} className="bi bi-star text-warning"></i>);
    }
    return stars;
  };

  return (
    <Card className="h-100 product-card scale-in">
      <Link to={`/products/${product.id}`} className="text-decoration-none">
        <div className="position-relative" style={{ height: '250px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8f9fa' }}>
          {product.primary_image ? (
            <Card.Img
              variant="top"
              src={product.primary_image}
              alt={product.title}
              style={{ 
                maxHeight: '100%',
                maxWidth: '100%',
                width: 'auto',
                height: 'auto',
                objectFit: 'contain',
                padding: '1rem'
              }}
              className="img-fluid"
            />
          ) : (
            <div className="d-flex align-items-center justify-content-center bg-light h-100">
              <i className="bi bi-image text-muted" style={{ fontSize: '3rem' }}></i>
            </div>
          )}
          
          {product.discount_percentage > 0 && (
            <Badge 
              bg="danger" 
              className="position-absolute top-0 end-0 m-2 glow"
              style={{ fontSize: '0.9rem' }}
            >
              -{product.discount_percentage}% {t('products.discount')}
            </Badge>
          )}
          
          {isPrime && (
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>{t('products.primeBadge')}</Tooltip>}
            >
              <Badge 
                bg="primary" 
                className="position-absolute top-0 start-0 m-2 glow"
                style={{ 
                  background: 'linear-gradient(135deg, #00A8E1 0%, #00C4A7 100%)',
                  border: 'none',
                  fontWeight: 'bold',
                  letterSpacing: '0.5px'
                }}
              >
                <i className="bi bi-lightning-charge-fill me-1"></i>
                {t('products.primeBadge')}
              </Badge>
            </OverlayTrigger>
          )}
          {product.is_featured && !isPrime && (
            <Badge 
              bg="warning" 
              text="dark"
              className="position-absolute top-0 start-0 m-2 pulse"
            >
              <i className="bi bi-star-fill me-1"></i>
              {t('products.featuredBadge')}
            </Badge>
          )}
        </div>

        <Card.Body className="d-flex flex-column">
          <Card.Title className="text-dark mb-2" style={{ fontSize: '1rem', minHeight: '2.5rem' }}>
            {product.title.length > 60 ? `${product.title.substring(0, 60)}...` : product.title}
          </Card.Title>

          <div className="mb-2">
            <small className="text-muted">
              <i className="bi bi-shop me-1"></i>
              {product.seller_name}
            </small>
          </div>

          <div className="mb-2">
            {renderStars(product.average_rating)}
            <small className="text-muted ms-2">
              ({product.review_count})
            </small>
          </div>

          <div className="mt-auto">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <div>
                <div className="d-flex align-items-center">
                  {isPrime && (
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip>{t('products.primeTooltip')}</Tooltip>}
                    >
                      <span className="me-2" style={{ color: '#00A8E1' }}>
                        <FaCrown size={20} />
                      </span>
                    </OverlayTrigger>
                  )}
                  <div>
                    {product.discount_price ? (
                      <>
                        <h5 className="mb-0 text-primary">${product.final_price}</h5>
                        <small className="text-muted text-decoration-line-through">
                          ${product.price}
                        </small>
                      </>
                    ) : (
                      <h5 className="mb-0 text-primary">${product.price}</h5>
                    )}
                  </div>
                </div>
              </div>
              
              <div>
                {product.stock > 0 ? (
                  <Badge bg="success">{t('products.inStock')}</Badge>
                ) : (
                  <Badge bg="secondary">{t('products.outOfStock')}</Badge>
                )}
              </div>
            </div>

            {isBuyer && product.stock > 0 && (
              <Button 
                variant="primary" 
                size="sm" 
                className="w-100"
                onClick={handleAddToCart}
              >
                <i className="bi bi-cart-plus me-2"></i>
                {t('products.addToCart')}
              </Button>
            )}
          </div>
        </Card.Body>
      </Link>

      <style jsx>{`
        .product-card {
          transition: all 0.3s ease;
        }
        .product-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </Card>
  );
};

export default ProductCard;
