import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Spinner } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { productsAPI, categoriesAPI } from '../services/api';
import ProductCard from '../components/ProductCard';

const Products = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    min_price: searchParams.get('min_price') || '',
    max_price: searchParams.get('max_price') || '',
    ordering: searchParams.get('ordering') || '-created_at',
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getAll();
      // Ensure categories is always an array
      const categoriesData = response.data.results || response.data;
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]); // Set empty array on error
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.category) params.category = filters.category;
      if (filters.min_price) params.min_price = filters.min_price;
      if (filters.max_price) params.max_price = filters.max_price;
      if (filters.ordering) params.ordering = filters.ordering;

      const response = await productsAPI.getAll(params);
      setProducts(response.data.results || response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    // Update URL params
    const params = new URLSearchParams();
    Object.keys(newFilters).forEach(k => {
      if (newFilters[k]) params.set(k, newFilters[k]);
    });
    setSearchParams(params);
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      min_price: '',
      max_price: '',
      ordering: '-created_at',
    });
    setSearchParams({});
  };

  return (
    <Container className="py-5">
      <h1 className="mb-4" style={{ fontFamily: 'var(--font-display)' }}>
        {t('products.title')}
      </h1>

      <Row>
        {/* Filters Sidebar */}
        <Col lg={3} className="mb-4">
          <div className="bg-white p-4 rounded shadow-sm sticky-top" style={{ top: '100px' }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">{t('products.filter')}</h5>
              <Button variant="link" size="sm" onClick={clearFilters}>
                {t('common.clear')}
              </Button>
            </div>

            {/* Search */}
            <Form.Group className="mb-3">
              <Form.Label>{t('common.search')}</Form.Label>
              <Form.Control
                type="text"
                placeholder={t('products.search')}
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </Form.Group>

            {/* Category */}
            <Form.Group className="mb-3">
              <Form.Label>{t('seller.category')}</Form.Label>
              <Form.Select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                <option value="">All Categories</option>
                {Array.isArray(categories) && categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            {/* Price Range */}
            <Form.Group className="mb-3">
              <Form.Label>Price Range</Form.Label>
              <Row>
                <Col>
                  <Form.Control
                    type="number"
                    placeholder="Min"
                    value={filters.min_price}
                    onChange={(e) => handleFilterChange('min_price', e.target.value)}
                  />
                </Col>
                <Col>
                  <Form.Control
                    type="number"
                    placeholder="Max"
                    value={filters.max_price}
                    onChange={(e) => handleFilterChange('max_price', e.target.value)}
                  />
                </Col>
              </Row>
            </Form.Group>

            {/* Sort */}
            <Form.Group className="mb-3">
              <Form.Label>{t('products.sort')}</Form.Label>
              <Form.Select
                value={filters.ordering}
                onChange={(e) => handleFilterChange('ordering', e.target.value)}
              >
                <option value="-created_at">{t('products.sortNewest')}</option>
                <option value="price">{t('products.sortPrice')} (Low to High)</option>
                <option value="-price">{t('products.sortPrice')} (High to Low)</option>
                <option value="title">Name (A-Z)</option>
                <option value="-title">Name (Z-A)</option>
              </Form.Select>
            </Form.Group>
          </div>
        </Col>

        {/* Products Grid */}
        <Col lg={9}>
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-3 text-muted">{t('common.loading')}</p>
            </div>
          ) : products.length > 0 ? (
            <>
              <div className="mb-3 text-muted">
                Showing {products.length} products
              </div>
              <Row xs={1} sm={2} lg={3} className="g-4">
                {products.map((product) => (
                  <Col key={product.id}>
                    <ProductCard product={product} />
                  </Col>
                ))}
              </Row>
            </>
          ) : (
            <div className="text-center py-5">
              <i className="bi bi-inbox" style={{ fontSize: '4rem', color: 'var(--gray)' }}></i>
              <h4 className="mt-3">{t('products.noResults')}</h4>
              <p className="text-muted">Try adjusting your filters</p>
              <Button variant="primary" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Products;
