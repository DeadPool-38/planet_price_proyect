import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCart } from '../context/CartContext';
import { ordersAPI } from '../services/api';
import { toast } from 'react-toastify';

const Checkout = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { cart, fetchCart } = useCart();
  const [formData, setFormData] = useState({
    shipping_address: '',
    shipping_phone: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await ordersAPI.create(formData);
      toast.success(t('message.orderPlaced'));
      await fetchCart();
      navigate(`/orders/${response.data.id}`);
    } catch (error) {
      toast.error('Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (!cart || cart.items?.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <Container className="py-5">
      <h1 className="mb-4" style={{ fontFamily: 'var(--font-display)' }}>
        {t('checkout.title')}
      </h1>

      <Row>
        <Col lg={8}>
          <Card className="mb-4">
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>{t('checkout.shippingAddress')}</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="shipping_address"
                    value={formData.shipping_address}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>{t('checkout.phone')}</Form.Label>
                  <Form.Control
                    type="tel"
                    name="shipping_phone"
                    value={formData.shipping_phone}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>{t('checkout.notes')}</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-100"
                  disabled={loading}
                >
                  {loading ? 'Processing...' : t('checkout.placeOrder')}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card>
            <Card.Body>
              <h5 className="mb-3">{t('checkout.orderSummary')}</h5>
              {cart.items.map((item) => (
                <div key={item.id} className="d-flex justify-content-between mb-2">
                  <span>{item.product_title} x{item.quantity}</span>
                  <span>${item.subtotal}</span>
                </div>
              ))}
              <hr />
              <div className="d-flex justify-content-between">
                <strong>{t('cart.total')}:</strong>
                <strong className="text-primary">${cart.total_amount}</strong>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Checkout;
