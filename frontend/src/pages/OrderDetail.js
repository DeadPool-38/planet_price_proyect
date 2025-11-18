import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Card, Row, Col, Badge, Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { ordersAPI } from '../services/api';

const OrderDetail = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchOrder = async () => {
    try {
      const response = await ordersAPI.getById(id);
      setOrder(response.data);
    } catch (error) {
      console.error('Error fetching order:', error);
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

  if (!order) return null;

  return (
    <Container className="py-5">
      <h1 className="mb-4">Order Details</h1>
      
      <Row>
        <Col lg={8}>
          <Card className="mb-4">
            <Card.Header>
              <h5>Order #{order.order_number}</h5>
            </Card.Header>
            <Card.Body>
              {order.items?.map((item) => (
                <div key={item.id} className="d-flex align-items-center mb-3 pb-3 border-bottom">
                  <img
                    src={item.product_image || 'https://via.placeholder.com/80'}
                    alt={item.product_title}
                    style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                    className="rounded me-3"
                  />
                  <div className="flex-grow-1">
                    <h6>{item.product_title}</h6>
                    <p className="text-muted mb-0">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-end">
                    <strong>${item.subtotal}</strong>
                  </div>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="mb-3">
            <Card.Body>
              <h6>Order Summary</h6>
              <hr />
              <div className="d-flex justify-content-between mb-2">
                <span>Status:</span>
                <Badge bg="primary">{t(`status.${order.status}`)}</Badge>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Date:</span>
                <span>{new Date(order.created_at).toLocaleDateString()}</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between">
                <strong>Total:</strong>
                <strong className="text-primary">${order.total_amount}</strong>
              </div>
            </Card.Body>
          </Card>

          <Card>
            <Card.Body>
              <h6>Shipping Address</h6>
              <p className="mb-2">{order.shipping_address}</p>
              <p className="mb-0"><strong>Phone:</strong> {order.shipping_phone}</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default OrderDetail;
