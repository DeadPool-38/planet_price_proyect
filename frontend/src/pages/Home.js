import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Carousel, Button, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { productsAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import Logo from '../components/Logo';

const Home = () => {
  const { t } = useTranslation();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const response = await productsAPI.getFeatured();
      setFeaturedProducts(response.data || []);
    } catch (error) {
      console.error('Error fetching featured products:', error);
      // Set empty array on error to show empty state instead of crashing
      setFeaturedProducts([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Hero Carousel */}
      <Carousel className="mb-5">
        <Carousel.Item>
          <div 
            className="d-flex align-items-center justify-content-center banner"
            style={{
              height: '500px',
              background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
            }}
          >
            <Container>
              <Row className="align-items-center">
                <Col lg={6} className="text-white slide-in-left">
                  <h1 className="display-3 fw-bold mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                    {t('home.title')}
                  </h1>
                  <p className="lead mb-4">
                    {t('home.subtitle')}
                  </p>
                  <Link to="/products">
                    <Button variant="light" size="lg">
                      {t('home.shopNow')}
                      <i className="bi bi-arrow-right ms-2"></i>
                    </Button>
                  </Link>
                </Col>
                <Col lg={6} className="d-none d-lg-block text-center slide-in-right">
                  <Logo size="large" showText={false} inverted={true} />
                </Col>
              </Row>
            </Container>
          </div>
        </Carousel.Item>

        <Carousel.Item>
          <div 
            className="d-flex align-items-center justify-content-center banner"
            style={{
              height: '500px',
              background: 'linear-gradient(135deg, #F5BE27 0%, #d4a520 100%)',
            }}
          >
            <Container>
              <Row className="align-items-center">
                <Col lg={6} className="text-white slide-in-left">
                  <h1 className="display-3 fw-bold mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                    {t('home.exclusiveDeals')}
                  </h1>
                  <p className="lead mb-4">
                    {t('home.exclusiveDealsDesc')}
                  </p>
                  <Link to="/products">
                    <Button variant="light" size="lg">
                      {t('home.browseDeals')}
                      <i className="bi bi-arrow-right ms-2"></i>
                    </Button>
                  </Link>
                </Col>
                <Col lg={6} className="d-none d-lg-block text-center slide-in-right">
                  <i className="bi bi-gift float" style={{ fontSize: '15rem', color: 'rgba(255,255,255,0.2)' }}></i>
                </Col>
              </Row>
            </Container>
          </div>
        </Carousel.Item>

        <Carousel.Item>
          <div 
            className="d-flex align-items-center justify-content-center banner"
            style={{
              height: '500px',
              background: 'linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%)',
            }}
          >
            <Container>
              <Row className="align-items-center">
                <Col lg={6} className="text-white slide-in-left">
                  <h1 className="display-3 fw-bold mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                    {t('home.becomeSeller')}
                  </h1>
                  <p className="lead mb-4">
                    {t('home.becomeSellerDesc')}
                  </p>
                  <Link to="/register">
                    <Button variant="light" size="lg">
                      {t('home.getStarted')}
                      <i className="bi bi-arrow-right ms-2"></i>
                    </Button>
                  </Link>
                </Col>
                <Col lg={6} className="d-none d-lg-block text-center slide-in-right">
                  <i className="bi bi-shop float" style={{ fontSize: '15rem', color: 'rgba(255,255,255,0.2)' }}></i>
                </Col>
              </Row>
            </Container>
          </div>
        </Carousel.Item>
      </Carousel>

      {/* Featured Products Section */}
      <Container className="mb-5">
        <div className="text-center mb-5">
          <h2 className="display-5 fw-bold mb-3" style={{ fontFamily: 'var(--font-display)' }}>
            {t('home.featured')}
          </h2>
          <p className="text-muted">
            {t('home.featuredDesc')}
          </p>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3 text-muted">{t('common.loading')}</p>
          </div>
        ) : featuredProducts.length > 0 ? (
          <>
            <Row xs={1} sm={2} md={3} lg={4} className="g-4">
              {featuredProducts.map((product) => (
                <Col key={product.id}>
                  <ProductCard product={product} />
                </Col>
              ))}
            </Row>

            <div className="text-center mt-5">
              <Link to="/products">
                <Button variant="outline-primary" size="lg">
                  {t('home.viewAll')}
                  <i className="bi bi-arrow-right ms-2"></i>
                </Button>
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-5">
            <i className="bi bi-inbox" style={{ fontSize: '4rem', color: 'var(--gray)' }}></i>
            <p className="text-muted mt-3">No featured products available</p>
          </div>
        )}
      </Container>

      {/* Features Section */}
      <div className="bg-light py-5">
        <Container>
          <Row className="g-4">
            <Col md={3} className="text-center scale-in">
              <div className="mb-3">
                <i className="bi bi-truck float" style={{ fontSize: '3rem', color: 'var(--primary-color)' }}></i>
              </div>
              <h5>Free Shipping</h5>
              <p className="text-muted">On orders over $50</p>
            </Col>
            <Col md={3} className="text-center scale-in">
              <div className="mb-3">
                <i className="bi bi-shield-check float" style={{ fontSize: '3rem', color: 'var(--secondary-color)' }}></i>
              </div>
              <h5>Secure Payment</h5>
              <p className="text-muted">100% secure transactions</p>
            </Col>
            <Col md={3} className="text-center scale-in">
              <div className="mb-3">
                <i className="bi bi-arrow-repeat rotate" style={{ fontSize: '3rem', color: 'var(--accent-color)' }}></i>
              </div>
              <h5>Easy Returns</h5>
              <p className="text-muted">30-day return policy</p>
            </Col>
            <Col md={3} className="text-center scale-in">
              <div className="mb-3">
                <i className="bi bi-headset float" style={{ fontSize: '3rem', color: 'var(--info)' }}></i>
              </div>
              <h5>24/7 Support</h5>
              <p className="text-muted">Dedicated customer service</p>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default Home;
