import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { sellerAPI } from '../../services/api';

const Dashboard = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await sellerAPI.getDashboard();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
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
        {t('seller.dashboard')}
      </h1>

      <Row className="g-4 mb-4">
        <Col md={3}>
          <Card className="text-center h-100">
            <Card.Body>
              <i className="bi bi-box-seam" style={{ fontSize: '3rem', color: 'var(--primary-color)' }}></i>
              <h3 className="mt-3">{stats?.total_products || 0}</h3>
              <p className="text-muted mb-0">{t('seller.totalProducts')}</p>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="text-center h-100">
            <Card.Body>
              <i className="bi bi-check-circle" style={{ fontSize: '3rem', color: 'var(--secondary-color)' }}></i>
              <h3 className="mt-3">{stats?.active_products || 0}</h3>
              <p className="text-muted mb-0">{t('seller.activeProducts')}</p>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="text-center h-100">
            <Card.Body>
              <i className="bi bi-cart-check" style={{ fontSize: '3rem', color: 'var(--accent-color)' }}></i>
              <h3 className="mt-3">{stats?.total_orders || 0}</h3>
              <p className="text-muted mb-0">{t('seller.totalOrders')}</p>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="text-center h-100">
            <Card.Body>
              <i className="bi bi-currency-dollar" style={{ fontSize: '3rem', color: 'var(--success)' }}></i>
              <h3 className="mt-3">${stats?.total_revenue || 0}</h3>
              <p className="text-muted mb-0">{t('seller.revenue')}</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-4">
        <Col md={6}>
          <Card>
            <Card.Body>
              <h5 className="mb-3">Quick Actions</h5>
              <div className="d-grid gap-2">
                <Link to="/seller/products/new" className="btn btn-primary">
                  <i className="bi bi-plus-circle me-2"></i>
                  {t('seller.addProduct')}
                </Link>
                <Link to="/seller/products" className="btn btn-outline-primary">
                  <i className="bi bi-box-seam me-2"></i>
                  {t('seller.products')}
                </Link>
                <Link to="/seller/orders" className="btn btn-outline-primary">
                  <i className="bi bi-bag me-2"></i>
                  {t('seller.orders')}
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card>
            <Card.Body>
              <h5 className="mb-3">Pending Orders</h5>
              {stats?.pending_orders > 0 ? (
                <div className="alert alert-warning">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  You have <strong>{stats.pending_orders}</strong> pending orders to process.
                  <Link to="/seller/orders" className="alert-link ms-2">View Orders</Link>
                </div>
              ) : (
                <p className="text-muted">No pending orders</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-4 mt-1">
        <Col md={12}>
          <Card className="border-primary">
            <Card.Body className="d-md-flex align-items-center justify-content-between">
              <div>
                <h5 className="mb-1">{t('seller.uploadYourItems')}</h5>
                <p className="text-muted mb-0">{t('seller.uploadDesc')}</p>
              </div>
              <div className="mt-3 mt-md-0">
                <Link to="/seller/products/new" className="btn btn-primary">
                  <i className="bi bi-cloud-upload me-2"></i>
                  {t('seller.addProduct')}
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
