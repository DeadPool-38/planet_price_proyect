import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar as BSNavbar, Nav, Container, NavDropdown, Badge, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import Logo from './Logo';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const { user, isAuthenticated, isSeller, isBuyer, isSuperAdmin, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${searchQuery}`);
    }
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <BSNavbar bg="white" expand="lg" className="shadow-sm sticky-top">
      <Container>
        <BSNavbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <Logo size="small" showText={true} />
        </BSNavbar.Brand>
        
        <BSNavbar.Toggle aria-controls="basic-navbar-nav" />
        
        <BSNavbar.Collapse id="basic-navbar-nav">
          {/* Search Bar */}
          <Form className="d-flex mx-auto my-2 my-lg-0" style={{ maxWidth: '400px', width: '100%' }} onSubmit={handleSearch}>
            <Form.Control
              type="search"
              placeholder={t('products.search')}
              className="me-2"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="btn btn-primary" type="submit">
              <i className="bi bi-search"></i>
            </button>
          </Form>

          <Nav className="ms-auto align-items-lg-center">
            <Nav.Link as={Link} to="/">
              <i className="bi bi-house me-1"></i>
              {t('nav.home')}
            </Nav.Link>
            
            <Nav.Link as={Link} to="/products">
              <i className="bi bi-grid me-1"></i>
              {t('nav.products')}
            </Nav.Link>

            {isAuthenticated ? (
              <>
                {isBuyer && (
                  <>
                    <Nav.Link as={Link} to="/cart" className="position-relative d-inline-flex align-items-center">
                      <span className="position-relative">
                        <i className="bi bi-cart3 me-1"></i>
                        {itemCount > 0 && (
                          <Badge 
                            bg="danger" 
                            pill 
                            className="position-absolute" 
                            style={{ 
                              top: '-8px', 
                              right: '-8px', 
                              fontSize: '0.65rem',
                              minWidth: '18px',
                              height: '18px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              padding: '0 4px'
                            }}
                          >
                            {itemCount}
                          </Badge>
                        )}
                      </span>
                      {t('nav.cart')}
                    </Nav.Link>
                    
                    <Nav.Link as={Link} to="/wishlist">
                      <i className="bi bi-heart me-1"></i>
                      {t('nav.wishlist')}
                    </Nav.Link>
                    
                    <Nav.Link as={Link} to="/orders">
                      <i className="bi bi-bag me-1"></i>
                      {t('nav.orders')}
                    </Nav.Link>
                  </>
                )}

                {isSuperAdmin && (
                  <NavDropdown
                    title={
                      <>
                        <i className="bi bi-shield-lock me-1"></i>
                        {t('admin.title')}
                      </>
                    }
                    id="admin-dropdown"
                    align="end"
                  >
                    <NavDropdown.Item as={Link} to="/admin/dashboard">
                      <i className="bi bi-people me-2"></i>
                      {t('admin.userManagement')}
                    </NavDropdown.Item>
                  </NavDropdown>
                )}

                {isSeller && (
                  <NavDropdown
                    title={
                      <>
                        <i className="bi bi-speedometer2 me-1"></i>
                        {t('seller.dashboard')}
                      </>
                    }
                    id="seller-dropdown"
                    align="end"
                  >
                    <NavDropdown.Item as={Link} to="/seller/dashboard">
                      <i className="bi bi-speedometer2 me-2"></i>
                      {t('seller.dashboard')}
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/seller/products">
                      <i className="bi bi-box-seam me-2"></i>
                      {t('seller.products')}
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/seller/products/new">
                      <i className="bi bi-plus-circle me-2"></i>
                      {t('seller.addProduct')}
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/seller/orders">
                      <i className="bi bi-receipt me-2"></i>
                      {t('seller.orders')}
                    </NavDropdown.Item>
                  </NavDropdown>
                )}

                <NavDropdown 
                  title={
                    <>
                      <i className="bi bi-person-circle me-1"></i>
                      {user?.username}
                    </>
                  } 
                  id="user-dropdown"
                  align="end"
                >
                  <NavDropdown.Item as={Link} to="/profile">
                    <i className="bi bi-person me-2"></i>
                    {t('nav.profile')}
                  </NavDropdown.Item>
                  
                  {isBuyer && (
                    <NavDropdown.Item as={Link} to="/profile">
                      <i className="bi bi-shop me-2"></i>
                      {t('nav.becomeSeller')}
                    </NavDropdown.Item>
                  )}
                  
                  <NavDropdown.Divider />
                  
                  <NavDropdown.Item onClick={handleLogout}>
                    <i className="bi bi-box-arrow-right me-2"></i>
                    {t('nav.logout')}
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">
                  <i className="bi bi-box-arrow-in-right me-1"></i>
                  {t('nav.login')}
                </Nav.Link>
                
                <Link to="/register" className="btn btn-primary ms-2">
                  {t('nav.register')}
                </Link>
              </>
            )}

            {/* Language Switcher */}
            <NavDropdown 
              title={<i className="bi bi-translate"></i>} 
              id="language-dropdown"
              align="end"
            >
              <NavDropdown.Item onClick={() => changeLanguage('en')}>
                English
              </NavDropdown.Item>
              <NavDropdown.Item onClick={() => changeLanguage('es')}>
                Español
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </BSNavbar.Collapse>
      </Container>
    </BSNavbar>
  );
};

export default Navbar;
