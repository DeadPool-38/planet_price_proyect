import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Tabs, Tab, Badge, Image, Spinner, Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { adminAPI } from '../../services/api';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import es from 'date-fns/locale/es';

const AdminDashboard = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [pendingSellers, setPendingSellers] = useState([]);
  const [pendingProducts, setPendingProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [allUsers, pending, pendingProducts] = await Promise.all([
        adminAPI.getUsers(),
        adminAPI.getUsers({ pending: true }),
        adminAPI.getPendingProducts()
      ]);
      
      setUsers(allUsers.data);
      setPendingSellers(pending.data);
      // Sort products by creation date (newest first)
      const sortedProducts = [...pendingProducts.data].sort((a, b) => 
        new Date(b.created_at) - new Date(a.created_at)
      );
      setPendingProducts(sortedProducts);
    } catch (error) {
      console.error('Error fetching data:', error);
      const errorMessage = error.response?.data?.message || 'Failed to fetch data. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApproveSeller = async (userId) => {
    try {
      await adminAPI.approveSeller(userId);
      toast.success('Seller approved successfully!');
      fetchData(); // Refresh the data
    } catch (error) {
      toast.error('Failed to approve seller.');
    }
  };

  const handleApproveProduct = async (productId) => {
    try {
      setProcessing(true);
      
      // Show loading state on the specific button
      const response = await adminAPI.approveProduct(productId);
      
      if (response && response.data) {
        toast.success('✅ Producto aprobado exitosamente!');
        // Update the UI optimistically
        setPendingProducts(prevProducts => 
          prevProducts.filter(product => product.id !== productId)
        );
      } else {
        throw new Error('Respuesta inesperada del servidor');
      }
    } catch (error) {
      console.error('Error al aprobar el producto:', error);
      let errorMessage = 'Error al aprobar el producto. Por favor, intente de nuevo.';
      
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        if (error.response.data && error.response.data.detail) {
          errorMessage = error.response.data.detail;
        } else if (error.response.status === 401) {
          errorMessage = 'Sesión expirada. Por favor, inicie sesión nuevamente.';
        } else if (error.response.status === 403) {
          errorMessage = 'No tiene permisos para realizar esta acción.';
        } else if (error.response.status === 404) {
          errorMessage = 'El producto no fue encontrado.';
        } else if (error.response.status >= 500) {
          errorMessage = 'Error del servidor. Por favor, intente más tarde.';
        }
      } else if (error.request) {
        // The request was made but no response was received
        errorMessage = 'No se pudo conectar con el servidor. Verifique su conexión a internet.';
      }
      
      toast.error(`❌ ${errorMessage}`);
      
      // Refresh the data to ensure consistency
      await fetchData();
    } finally {
      setProcessing(false);
    }
  };

  const confirmRejectProduct = (product) => {
    setSelectedProduct(product);
    setShowRejectModal(true);
  };

  const handleRejectProduct = async () => {
    if (!selectedProduct) return;
    
    try {
      setProcessing(true);
      const response = await adminAPI.rejectProduct(selectedProduct.id);
      
      if (response && response.data) {
        toast.success('🗑️ Producto rechazado exitosamente!');
        // Update the UI optimistically
        setPendingProducts(prevProducts => 
          prevProducts.filter(product => product.id !== selectedProduct.id)
        );
        setShowRejectModal(false);
      } else {
        throw new Error('Respuesta inesperada del servidor');
      }
    } catch (error) {
      console.error('Error al rechazar el producto:', error);
      let errorMessage = 'Error al rechazar el producto. Por favor, intente de nuevo.';
      
      if (error.response) {
        if (error.response.data && error.response.data.detail) {
          errorMessage = error.response.data.detail;
        } else if (error.response.status === 401) {
          errorMessage = 'Sesión expirada. Por favor, inicie sesión nuevamente.';
        } else if (error.response.status === 403) {
          errorMessage = 'No tiene permisos para realizar esta acción.';
        } else if (error.response.status === 404) {
          errorMessage = 'El producto no fue encontrado.';
        } else if (error.response.status >= 500) {
          errorMessage = 'Error del servidor. Por favor, intente más tarde.';
        }
      } else if (error.request) {
        errorMessage = 'No se pudo conectar con el servidor. Verifique su conexión a internet.';
      }
      
      toast.error(`❌ ${errorMessage}`);
      
      // Refresh the data to ensure consistency
      await fetchData();
    } finally {
      setProcessing(false);
      setSelectedProduct(null);
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-2">Loading dashboard data...</p>
      </Container>
    );
  }

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'PPpp', { locale: es });
    } catch (e) {
      return dateString || 'N/A';
    }
  };

  return (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 style={{ fontFamily: 'var(--font-display)', margin: 0 }}>
          {t('admin.dashboard')}
        </h1>
        <Button 
          variant="outline-primary" 
          onClick={fetchData}
          disabled={processing}
        >
          {processing ? (
            <>
              <Spinner as="span" size="sm" animation="border" role="status" />
              <span className="ms-2">Actualizando...</span>
            </>
          ) : (
            'Actualizar Datos'
          )}
        </Button>
      </div>

      <Tabs defaultActiveKey="pendingProducts" id="admin-tabs" className="mb-3">
        <Tab eventKey="pendingProducts" title={
          <>
            Productos Pendientes 
            {pendingProducts.length > 0 && (
              <Badge bg="danger" className="ms-2">
                {pendingProducts.length}
              </Badge>
            )}
          </>
        }>
          <div className="table-responsive">
            <Table striped bordered hover className="mt-3">
              <thead className="table-dark">
                <tr>
                  <th>Imagen</th>
                  <th>Producto</th>
                  <th>Vendedor</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {pendingProducts.length > 0 ? (
                  pendingProducts.map(product => ({
                    ...product,
                    created_at: product.created_at || new Date().toISOString()
                  })).map(product => (
                    <tr key={product.id} className="align-middle">
                      <td style={{ width: '80px' }}>
                        <Image 
                          src={product.primary_image || 'https://via.placeholder.com/100?text=Sin+imagen'} 
                          alt={product.title}
                          style={{ 
                            width: '60px', 
                            height: '60px', 
                            objectFit: 'cover',
                            borderRadius: '4px'
                          }}
                          className="img-thumbnail"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/100?text=Sin+imagen';
                          }}
                        />
                      </td>
                      <td>
                        <div className="fw-bold">
                          <Link 
                            to={`/product/${product.slug || product.id}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-decoration-none"
                          >
                            {product.title}
                          </Link>
                        </div>
                        <div className="text-muted small">
                          ID: {product.id}
                        </div>
                      </td>
                      <td>
                        <div>{product.seller_name || 'N/A'}</div>
                        <small className="text-muted">{product.seller_email || ''}</small>
                      </td>
                      <td className="text-nowrap">${Number(product.price).toFixed(2)}</td>
                      <td className="text-center">
                        <Badge bg={product.stock > 0 ? 'success' : 'secondary'}>
                          {product.stock} en stock
                        </Badge>
                      </td>
                      <td className="text-nowrap small">
                        {formatDate(product.created_at)}
                      </td>
                      <td>
                        <Badge bg="warning" className="text-dark">
                          <i className="bi bi-clock me-1"></i>
                          Pendiente
                        </Badge>
                      </td>
                      <td style={{ minWidth: '180px' }}>
                        <div className="d-flex flex-wrap gap-2">
                          <Button 
                            variant="success" 
                            size="sm"
                            onClick={() => handleApproveProduct(product.id)}
                            disabled={processing}
                            className="flex-grow-1"
                          >
                            {processing ? (
                              <Spinner as="span" size="sm" animation="border" role="status" />
                            ) : (
                              <>
                                <i className="bi bi-check-lg me-1"></i>
                                Aprobar
                              </>
                            )}
                          </Button>
                          <Button 
                            variant="outline-danger" 
                            size="sm"
                            onClick={() => confirmRejectProduct(product)}
                            disabled={processing}
                            className="flex-grow-1"
                          >
                            <i className="bi bi-x-lg me-1"></i>
                            Rechazar
                          </Button>
                        </div>
                      </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center py-5">
                    <div className="py-4">
                      <i className="bi bi-check2-circle display-4 text-muted mb-3"></i>
                      <h5>¡No hay productos pendientes por revisar!</h5>
                      <p className="text-muted">Todos los productos han sido revisados.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
        </Tab>
        
        <Tab eventKey="pendingSellers" title={`Pending Sellers (${pendingSellers.length})`}>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Date Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingSellers.map(user => (
                <tr key={user.id}>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{new Date(user.created_at).toLocaleDateString()}</td>
                  <td>
                    <Button 
                      variant="success" 
                      size="sm"
                      onClick={() => handleApproveSeller(user.id)}
                    >
                      Approve
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Tab>
        
        <Tab eventKey="allUsers" title={`All Users (${users.length})`}>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Seller Approved</th>
                <th>Date Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{user.seller_approved ? 'Yes' : 'No'}</td>
                  <td>{new Date(user.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Tab>
      </Tabs>

      {/* Reject Confirmation Modal */}
      <Modal show={showRejectModal} onHide={() => setShowRejectModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Rechazo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>¿Estás seguro que deseas rechazar este producto?</p>
          {selectedProduct && (
            <div className="alert alert-warning">
              <strong>{selectedProduct.title}</strong>
              <div className="small">Vendedor: {selectedProduct.seller_name || 'N/A'}</div>
              <div className="small">ID: {selectedProduct.id}</div>
            </div>
          )}
          <p className="text-danger">Esta acción no se puede deshacer.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={() => setShowRejectModal(false)}
            disabled={processing}
          >
            Cancelar
          </Button>
          <Button 
            variant="danger" 
            onClick={handleRejectProduct}
            disabled={processing}
          >
            {processing ? (
              <Spinner as="span" size="sm" animation="border" role="status" />
            ) : (
              'Sí, Rechazar Producto'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminDashboard;
