import React, { useState, useEffect } from 'react';
import { Container, Table, Badge, Button, Modal, Form, Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { ordersAPI } from '../../services/api';
import { toast } from 'react-toastify';

const Orders = () => {
  const { t } = useTranslation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');

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

  const handleUpdateStatus = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setShowModal(true);
  };

  const handleSubmitStatus = async () => {
    try {
      await ordersAPI.updateStatus(selectedOrder.id, newStatus);
      toast.success(t('message.updateSuccess'));
      setShowModal(false);
      fetchOrders();
    } catch (error) {
      toast.error('Failed to update status');
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
        {t('seller.orders')}
      </h1>

      {orders.length > 0 ? (
        <Table responsive hover>
          <thead>
            <tr>
              <th>{t('orders.orderNumber')}</th>
              <th>Buyer</th>
              <th>{t('orders.date')}</th>
              <th>{t('orders.status')}</th>
              <th>{t('orders.total')}</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td><strong>{order.order_number}</strong></td>
                <td>{order.buyer_name}</td>
                <td>{new Date(order.created_at).toLocaleDateString()}</td>
                <td>{getStatusBadge(order.status)}</td>
                <td><strong>${order.total_amount}</strong></td>
                <td>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => handleUpdateStatus(order)}
                  >
                    {t('seller.updateStatus')}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <div className="text-center py-5">
          <i className="bi bi-bag-x" style={{ fontSize: '5rem', color: 'var(--gray)' }}></i>
          <h3 className="mt-3">No orders yet</h3>
        </div>
      )}

      {/* Update Status Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{t('seller.updateStatus')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>{t('orders.status')}</Form.Label>
            <Form.Select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
            >
              <option value="pending">{t('status.pending')}</option>
              <option value="confirmed">{t('status.confirmed')}</option>
              <option value="processing">{t('status.processing')}</option>
              <option value="shipped">{t('status.shipped')}</option>
              <option value="in_transit">{t('status.in_transit')}</option>
              <option value="delivered">{t('status.delivered')}</option>
              <option value="cancelled">{t('status.cancelled')}</option>
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            {t('common.cancel')}
          </Button>
          <Button variant="primary" onClick={handleSubmitStatus}>
            {t('common.update')}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Orders;
