import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Badge, Spinner, Tabs, Tab, Form, Card } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { productsAPI, reviewsAPI, wishlistAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const ProductDetail = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated, isBuyer } = useAuth();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });

  useEffect(() => {
    fetchProduct();
    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await productsAPI.getById(id);
      setProduct(response.data);
      if (response.data.images?.length > 0) {
        setSelectedImage(response.data.images.find(img => img.is_primary) || response.data.images[0]);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Product not found');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await reviewsAPI.getAll({ product: id });
      setReviews(response.data.results || response.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    await addToCart(product.id, quantity);
  };

  const handleAddToWishlist = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    try {
      await wishlistAPI.addProduct(product.id);
      toast.success(t('message.addedToWishlist'));
    } catch (error) {
      toast.error('Failed to add to wishlist');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      await reviewsAPI.create({
        product: product.id,
        ...reviewForm,
      });
      toast.success('Review submitted successfully');
      setReviewForm({ rating: 5, comment: '' });
      fetchReviews();
    } catch (error) {
      toast.error('Failed to submit review');
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <i
          key={i}
          className={`bi bi-star${i <= rating ? '-fill' : ''} text-warning`}
          style={{ fontSize: '1.2rem' }}
        ></i>
      );
    }
    return stars;
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">{t('common.loading')}</p>
      </Container>
    );
  }

  if (!product) return null;

  return (
    <Container className="py-5">
      <Row>
        {/* Product Images */}
        <Col md={6} className="mb-4">
          <div className="mb-3">
            <div className="d-flex align-items-center justify-content-center bg-light rounded" style={{ width: '100%', height: '500px', overflow: 'hidden' }}>
              <img
                src={selectedImage?.image || 'https://via.placeholder.com/500'}
                alt={product.title}
                className="img-fluid"
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: '100%',
                  objectFit: 'contain',
                  padding: '1rem'
                }}
              />
            </div>
          </div>
          {product.images?.length > 1 && (
            <div className="d-flex gap-2 overflow-auto">
              {product.images.map((img) => (
                <div 
                  key={img.id}
                  className={`img-thumbnail cursor-pointer ${selectedImage?.id === img.id ? 'border-primary' : ''}`}
                  style={{ 
                    width: '80px', 
                    height: '80px', 
                    padding: '0.25rem',
                    border: selectedImage?.id === img.id ? '2px solid #0d6efd' : '1px solid #dee2e6',
                    borderRadius: '0.375rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#f8f9fa',
                    cursor: 'pointer'
                  }}
                  onClick={() => setSelectedImage(img)}
                >
                  <img
                    src={img.image}
                    alt={img.alt_text}
                    style={{ 
                      maxWidth: '100%',
                      maxHeight: '100%',
                      objectFit: 'contain'
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </Col>

        {/* Product Info */}
        <Col md={6}>
          <div className="mb-2">
            <Badge bg="secondary">{product.category?.name}</Badge>
            {product.is_featured && (
              <Badge bg="warning" text="dark" className="ms-2">Featured</Badge>
            )}
          </div>

          <h1 className="mb-3" style={{ fontFamily: 'var(--font-display)' }}>
            {product.title}
          </h1>

          <div className="mb-3">
            {renderStars(Math.round(product.average_rating))}
            <span className="ms-2 text-muted">
              ({product.review_count} {t('product.reviews')})
            </span>
          </div>

          <div className="mb-3">
            <small className="text-muted">
              <i className="bi bi-shop me-1"></i>
              {t('product.seller')}: {product.seller?.username}
            </small>
          </div>

          <div className="mb-4">
            {product.discount_price ? (
              <>
                <h2 className="text-primary mb-0">${product.final_price}</h2>
                <div>
                  <span className="text-muted text-decoration-line-through me-2">
                    ${product.price}
                  </span>
                  <Badge bg="danger">-{product.discount_percentage}%</Badge>
                </div>
              </>
            ) : (
              <h2 className="text-primary">${product.price}</h2>
            )}
          </div>

          <div className="mb-3">
            {product.stock > 0 ? (
              <Badge bg="success" className="fs-6">
                <i className="bi bi-check-circle me-1"></i>
                {t('products.inStock')} ({product.stock} available)
              </Badge>
            ) : (
              <Badge bg="danger" className="fs-6">
                {t('products.outOfStock')}
              </Badge>
            )}
          </div>

          {isBuyer && product.stock > 0 && (
            <>
              <div className="mb-3">
                <Form.Label>{t('product.quantity')}</Form.Label>
                <div className="d-flex align-items-center gap-2">
                  <Button
                    variant="outline-secondary"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <i className="bi bi-dash"></i>
                  </Button>
                  <Form.Control
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    style={{ width: '80px', textAlign: 'center' }}
                    min="1"
                    max={product.stock}
                  />
                  <Button
                    variant="outline-secondary"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  >
                    <i className="bi bi-plus"></i>
                  </Button>
                </div>
              </div>

              <div className="d-flex gap-2 mb-3">
                <Button
                  variant="primary"
                  size="lg"
                  className="flex-grow-1"
                  onClick={handleAddToCart}
                >
                  <i className="bi bi-cart-plus me-2"></i>
                  {t('products.addToCart')}
                </Button>
                <Button
                  variant="outline-primary"
                  size="lg"
                  onClick={handleAddToWishlist}
                >
                  <i className="bi bi-heart"></i>
                </Button>
              </div>
            </>
          )}
        </Col>
      </Row>

      {/* Product Details Tabs */}
      <Row className="mt-5">
        <Col>
          <Tabs defaultActiveKey="description" className="mb-3">
            <Tab eventKey="description" title={t('product.description')}>
              <Card className="border-0 bg-light">
                <Card.Body>
                  <p style={{ whiteSpace: 'pre-wrap' }}>{product.description}</p>
                </Card.Body>
              </Card>
            </Tab>

            <Tab eventKey="specifications" title={t('product.specifications')}>
              <Card className="border-0 bg-light">
                <Card.Body>
                  {product.specifications && Object.keys(product.specifications).length > 0 ? (
                    <table className="table">
                      <tbody>
                        {Object.entries(product.specifications).map(([key, value]) => (
                          <tr key={key}>
                            <td className="fw-bold">{key}</td>
                            <td>{value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="text-muted">No specifications available</p>
                  )}
                </Card.Body>
              </Card>
            </Tab>

            <Tab eventKey="reviews" title={`${t('product.reviews')} (${reviews.length})`}>
              <Card className="border-0 bg-light">
                <Card.Body>
                  {isBuyer && (
                    <Form onSubmit={handleReviewSubmit} className="mb-4 p-3 bg-white rounded">
                      <h5 className="mb-3">{t('review.writeReview')}</h5>
                      <Form.Group className="mb-3">
                        <Form.Label>{t('review.rating')}</Form.Label>
                        <div>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <i
                              key={star}
                              className={`bi bi-star${star <= reviewForm.rating ? '-fill' : ''} text-warning me-1`}
                              style={{ fontSize: '1.5rem', cursor: 'pointer' }}
                              onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                            ></i>
                          ))}
                        </div>
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>{t('review.comment')}</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          value={reviewForm.comment}
                          onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                          required
                        />
                      </Form.Group>
                      <Button type="submit" variant="primary">
                        {t('review.submit')}
                      </Button>
                    </Form>
                  )}

                  {reviews.length > 0 ? (
                    reviews.map((review) => (
                      <div key={review.id} className="mb-3 p-3 bg-white rounded">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <div>
                            <strong>{review.buyer_name}</strong>
                            {review.is_verified_purchase && (
                              <Badge bg="success" className="ms-2">
                                {t('review.verifiedPurchase')}
                              </Badge>
                            )}
                          </div>
                          <small className="text-muted">
                            {new Date(review.created_at).toLocaleDateString()}
                          </small>
                        </div>
                        <div className="mb-2">{renderStars(review.rating)}</div>
                        <p className="mb-0">{review.comment}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted">{t('product.noReviews')}</p>
                  )}
                </Card.Body>
              </Card>
            </Tab>
          </Tabs>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductDetail;
