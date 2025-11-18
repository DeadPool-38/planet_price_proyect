import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import Logo from './Logo';

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark text-white mt-5 py-4">
      <Container>
        <Row>
          <Col md={4} className="mb-3 mb-md-0">
            <div className="mb-3">
              <Logo size="small" showText={true} inverted={true} />
            </div>
            <p className="text-white-50">
              Discover the best prices on the planet. Your global marketplace for quality products from trusted sellers.
            </p>
            <div className="d-flex gap-3">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-white-50 hover-primary" aria-label="Facebook">
                <i className="bi bi-facebook fs-5"></i>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-white-50 hover-primary" aria-label="Twitter">
                <i className="bi bi-twitter fs-5"></i>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-white-50 hover-primary" aria-label="Instagram">
                <i className="bi bi-instagram fs-5"></i>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-white-50 hover-primary" aria-label="LinkedIn">
                <i className="bi bi-linkedin fs-5"></i>
              </a>
            </div>
          </Col>

          <Col md={2} className="mb-3 mb-md-0">
            <h6 className="mb-3">Quick Links</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/" className="text-white-50 text-decoration-none hover-primary">
                  {t('nav.home')}
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/products" className="text-white-50 text-decoration-none hover-primary">
                  {t('nav.products')}
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/register" className="text-white-50 text-decoration-none hover-primary">
                  {t('nav.becomeSeller')}
                </Link>
              </li>
            </ul>
          </Col>

          <Col md={3} className="mb-3 mb-md-0">
            <h6 className="mb-3">Customer Service</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/help" className="text-white-50 text-decoration-none hover-primary">
                  Help Center
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/orders" className="text-white-50 text-decoration-none hover-primary">
                  Track Order
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/returns" className="text-white-50 text-decoration-none hover-primary">
                  Returns & Refunds
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/shipping" className="text-white-50 text-decoration-none hover-primary">
                  Shipping Info
                </Link>
              </li>
            </ul>
          </Col>

          <Col md={3}>
            <h6 className="mb-3">Contact Us</h6>
            <ul className="list-unstyled text-white-50">
              <li className="mb-2">
                <i className="bi bi-envelope me-2"></i>
                support@planetprice.com
              </li>
              <li className="mb-2">
                <i className="bi bi-telephone me-2"></i>
                +1 (555) 123-4567
              </li>
              <li className="mb-2">
                <i className="bi bi-geo-alt me-2"></i>
                123 Commerce St, City, Country
              </li>
            </ul>
          </Col>
        </Row>

        <hr className="my-4 bg-white-50" />

        <Row>
          <Col className="text-center text-white-50">
            <p className="mb-0">
              &copy; {currentYear} Planet Price. All rights reserved. | 
              <Link to="/privacy-policy" className="text-white-50 text-decoration-none hover-primary ms-2">Privacy Policy</Link> | 
              <Link to="/terms-of-service" className="text-white-50 text-decoration-none hover-primary ms-2">Terms of Service</Link>
            </p>
          </Col>
        </Row>
      </Container>

      <style jsx>{`
        .hover-primary:hover {
          color: var(--primary-light) !important;
        }
      `}</style>
    </footer>
  );
};

export default Footer;
