import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { wishlistAPI } from '../services/api';
import ProductCard from '../components/ProductCard';

const Wishlist = () => {
  const { t } = useTranslation();
  const [wishlist, setWishlist] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const response = await wishlistAPI.get();
      setWishlist(response.data);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <h1 className="mb-4" style={{ fontFamily: 'var(--font-display)' }}>
        {t('wishlist.title')}
      </h1>

      {wishlist?.products?.length > 0 ? (
        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
          {wishlist.products.map((product) => (
            <Col key={product.id}>
              <ProductCard product={product} />
            </Col>
          ))}
        </Row>
      ) : (
        <div className="text-center py-5">
          <i className="bi bi-heart" style={{ fontSize: '5rem', color: 'var(--gray)' }}></i>
          <h3 className="mt-3">{t('wishlist.empty')}</h3>
        </div>
      )}
    </Container>
  );
};

export default Wishlist;
