import React, { useState, useEffect } from 'react';
import { Container, Card, Badge, Spinner, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ordersAPI } from '../services/api';

const Orders = () => {
  const { t } = useTranslation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await ordersAPI.getAll();
      setOrders(response.data.results || response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      pending: 'warning',
      confirmed: 'info',
      processing: 'primary',
      shipped: 'info',
      in_transit: 'info',
      delivered: 'success',
      cancelled: 'danger',
      refunded: 'secondary',
    };
    return <Badge bg={variants[status] || 'secondary'}>{t(`status.${status}`)}</Badge>;
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
        {t('orders.title')}
      </h1>

      {orders.length > 0 ? (
        <Card>
          <Card.Body>
            <Table responsive hover>
              <thead>
                <tr>
                  <th>{t('orders.orderNumber')}</th>
                  <th>{t('orders.date')}</th>
                  <th>{t('orders.status')}</th>
                  <th>{t('orders.items')}</th>
                  <th>{t('orders.total')}</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td><strong>{order.order_number}</strong></td>
                    <td>{new Date(order.created_at).toLocaleDateString()}</td>
                    <td>{getStatusBadge(order.status)}</td>
                    <td>{order.items?.length || 0}</td>
                    <td><strong>${order.total_amount}</strong></td>
                    <td>
                      <Link to={`/orders/${order.id}`} className="btn btn-sm btn-outline-primary">
                        {t('orders.viewDetails')}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      ) : (
        <div className="text-center py-5">
          <i className="bi bi-bag-x" style={{ fontSize: '5rem', color: 'var(--gray)' }}></i>
          <h3 className="mt-3">{t('orders.noOrders')}</h3>
        </div>
      )}
    </Container>
  );
};

export default Orders;
