import React from 'react';
import { Container, Row, Col, Card, Button, Table, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { cart, updateCartItem, removeFromCart, clearCart } = useCart();

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    await updateCartItem(itemId, newQuantity);
  };

  const handleRemove = async (itemId) => {
    await removeFromCart(itemId);
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (!cart || cart.items?.length === 0) {
    return (
      <Container className="py-5 text-center">
        <i className="bi bi-cart-x" style={{ fontSize: '5rem', color: 'var(--gray)' }}></i>
        <h3 className="mt-3">{t('cart.empty')}</h3>
        <p className="text-muted mb-4">Start shopping to add items to your cart</p>
        <Link to="/products">
          <Button variant="primary">{t('cart.continueShopping')}</Button>
        </Link>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <h1 className="mb-4" style={{ fontFamily: 'var(--font-display)' }}>
        {t('cart.title')}
      </h1>

      <Row>
        <Col lg={8}>
          <Card className="mb-4">
            <Card.Body>
              <Table responsive>
                <thead>
                  <tr>
                    <th>{t('cart.item')}</th>
                    <th>{t('cart.price')}</th>
                    <th>{t('cart.quantity')}</th>
                    <th>{t('cart.subtotal')}</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {cart.items.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <img
                            src={item.product_image || 'https://via.placeholder.com/80'}
                            alt={item.product_title}
                            style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                            className="rounded me-3"
                          />
                          <div>
                            <Link to={`/products/${item.product}`} className="text-decoration-none">
                              <strong>{item.product_title}</strong>
                            </Link>
                            <div className="text-muted small">
                              Stock: {item.product_stock}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="align-middle">${item.product_price}</td>
                      <td className="align-middle">
                        <div className="d-flex align-items-center">
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          >
                            <i className="bi bi-dash"></i>
                          </Button>
                          <Form.Control
                            type="number"
                            value={item.quantity}
                            onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                            className="mx-2"
                            style={{ width: '60px', textAlign: 'center' }}
                            min="1"
                            max={item.product_stock}
                          />
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            disabled={item.quantity >= item.product_stock}
                          >
                            <i className="bi bi-plus"></i>
                          </Button>
                        </div>
                      </td>
                      <td className="align-middle">
                        <strong>${item.subtotal}</strong>
                      </td>
                      <td className="align-middle">
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleRemove(item.id)}
                        >
                          <i className="bi bi-trash"></i>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              <div className="d-flex justify-content-between">
                <Link to="/products">
                  <Button variant="outline-primary">
                    <i className="bi bi-arrow-left me-2"></i>
                    {t('cart.continueShopping')}
                  </Button>
                </Link>
                <Button variant="outline-danger" onClick={clearCart}>
                  <i className="bi bi-trash me-2"></i>
                  {t('cart.clear')}
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="sticky-top" style={{ top: '100px' }}>
            <Card.Body>
              <h5 className="mb-4">Order Summary</h5>
              
              <div className="d-flex justify-content-between mb-2">
                <span>Items ({cart.total_items}):</span>
                <span>${cart.total_amount}</span>
              </div>
              
              <div className="d-flex justify-content-between mb-2">
                <span>Shipping:</span>
                <span className="text-success">Free</span>
              </div>
              
              <hr />
              
              <div className="d-flex justify-content-between mb-4">
                <strong>{t('cart.total')}:</strong>
                <strong className="text-primary fs-4">${cart.total_amount}</strong>
              </div>

              <Button
                variant="primary"
                size="lg"
                className="w-100"
                onClick={handleCheckout}
              >
                {t('cart.checkout')}
                <i className="bi bi-arrow-right ms-2"></i>
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Cart;
