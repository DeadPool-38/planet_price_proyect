import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Badge, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { productsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const Products = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await productsAPI.getAll({ seller: user.id });
      setProducts(response.data.results || response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productsAPI.delete(id);
        toast.success(t('message.deleteSuccess'));
        fetchProducts();
      } catch (error) {
        toast.error('Failed to delete product');
      }
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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 style={{ fontFamily: 'var(--font-display)' }}>
          {t('seller.products')}
        </h1>
        <div>
          <Button
            variant="outline-secondary"
            className="me-2"
            onClick={fetchProducts}
            disabled={loading}
          >
            <i className="bi bi-arrow-clockwise me-2"></i>
            Refresh
          </Button>
          <Link to="/seller/products/new" className="btn btn-primary">
            <i className="bi bi-plus-circle me-2"></i>
            {t('seller.addProduct')}
          </Link>
        </div>
      </div>

      {products.length > 0 ? (
        <Table responsive hover>
          <thead>
            <tr>
              <th>Image</th>
              <th>{t('seller.productTitle')}</th>
              <th>{t('seller.category')}</th>
              <th>{t('seller.price')}</th>
              <th>{t('seller.stock')}</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>
                  <img
                    src={product.primary_image || 'https://via.placeholder.com/50'}
                    alt={product.title}
                    style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                    className="rounded"
                  />
                </td>
                <td>{product.title}</td>
                <td>{product.category_name}</td>
                <td>${product.price}</td>
                <td>{product.stock}</td>
                <td>
                  {!product.is_approved ? (
                    <Badge bg="warning" text="dark">
                      <i className="bi bi-clock me-1"></i>
                      Pending Approval
                    </Badge>
                  ) : product.is_active ? (
                    <Badge bg="success">
                      <i className="bi bi-check-circle me-1"></i>
                      Active
                    </Badge>
                  ) : (
                    <Badge bg="secondary">
                      <i className="bi bi-dash-circle me-1"></i>
                      Inactive
                    </Badge>
                  )}
                </td>
                <td>
                  <Link
                    to={`/seller/products/edit/${product.id}`}
                    className="btn btn-sm btn-outline-primary me-2"
                  >
                    <i className="bi bi-pencil"></i>
                  </Link>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleDelete(product.id)}
                  >
                    <i className="bi bi-trash"></i>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <div className="text-center py-5">
          <i className="bi bi-box-seam" style={{ fontSize: '5rem', color: 'var(--gray)' }}></i>
          <h3 className="mt-3">No products yet</h3>
          <p className="text-muted mb-4">Start by adding your first product</p>
          <Link to="/seller/products/new" className="btn btn-primary">
            <i className="bi bi-plus-circle me-2"></i>
            {t('seller.addProduct')}
          </Link>
        </div>
      )}
    </Container>
  );
};

export default Products;
