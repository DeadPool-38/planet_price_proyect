import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Row, Col } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { productsAPI, categoriesAPI } from '../../services/api';
import { toast } from 'react-toastify';

const ProductForm = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    price: '',
    discount_price: '',
    stock: 1,
    is_active: true,
    is_featured: false,
    specifications: '{}',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState([]);

  useEffect(() => {
    fetchCategories();
    if (isEdit) {
      fetchProduct();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

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

  const fetchProduct = async () => {
    try {
      const response = await productsAPI.getById(id);
      const product = response.data;
      setFormData({
        title: product.title,
        category: product.category?.id || '',
        description: product.description,
        price: product.price,
        discount_price: product.discount_price || '',
        stock: product.stock,
        is_active: product.is_active,
        is_featured: product.is_featured,
      });
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Product not found');
      navigate('/seller/products');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Handle number inputs
    if (type === 'number') {
      setFormData({
        ...formData,
        [name]: value === '' ? '' : (name === 'stock' ? parseInt(value, 10) : parseFloat(value)),
      });
    } 
    // Handle checkboxes
    else if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: checked,
      });
    }
    // Handle other inputs
    else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    // Validate file types
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const invalidFiles = files.filter(file => !validTypes.includes(file.type));
    
    if (invalidFiles.length > 0) {
      toast.error('Solo se permiten archivos de imagen (JPEG, PNG, GIF, WebP)');
      return;
    }
    
    // Validate file sizes (max 5MB per file)
    const maxSize = 5 * 1024 * 1024; // 5MB
    const oversizedFiles = files.filter(file => file.size > maxSize);
    
    if (oversizedFiles.length > 0) {
      toast.error('Las imágenes no deben superar los 5MB cada una');
      return;
    }
    
    setImageFiles(files);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title?.trim()) {
      newErrors.title = t('validation.required', { field: t('seller.productTitle') });
    }
    
    if (!formData.category) {
      newErrors.category = t('validation.required', { field: t('seller.category') });
    }
    
    if (!formData.description?.trim()) {
      newErrors.description = t('validation.required', { field: t('seller.description') });
    }
    
    if (!formData.price || isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
      newErrors.price = t('validation.invalidPrice');
    }
    
    if (formData.discount_price && (isNaN(parseFloat(formData.discount_price)) || parseFloat(formData.discount_price) < 0)) {
      newErrors.discount_price = t('validation.invalidDiscountPrice');
    }
    
    if (isNaN(parseInt(formData.stock, 10)) || parseInt(formData.stock, 10) < 0) {
      newErrors.stock = t('validation.invalidStock');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Validate at least one image is uploaded for new products
    if (!isEdit && (!imageFiles || imageFiles.length === 0)) {
      toast.error('Por favor, selecciona al menos una imagen para el producto');
      return;
    }
    
    setLoading(true);

    try {
      const productData = new FormData();
      
      // Add all product data to FormData
      productData.append('title', formData.title.trim());
      productData.append('category', formData.category);
      productData.append('description', formData.description.trim());
      productData.append('price', formData.price);
      
      if (formData.discount_price) {
        productData.append('discount_price', formData.discount_price);
      }
      
      productData.append('stock', formData.stock);
      productData.append('is_active', formData.is_active);
      productData.append('is_featured', formData.is_featured);
      productData.append('specifications', formData.specifications || '{}');

      // Handle image uploads - append each file with the same key 'images'
      if (imageFiles.length > 0) {
        imageFiles.forEach((file, index) => {
          productData.append('images', file);
        });
        productData.append('primary_image_index', '0'); // Set first image as primary
      }

      if (isEdit) {
        // For updates, use PUT for full updates
        await productsAPI.update(id, productData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        toast.success(t('message.updateSuccess'));
      } else {
        // For new products
        await productsAPI.create(productData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        toast.success(t('message.createSuccess'));
      }

      // Redirect to products list after a short delay
      setTimeout(() => {
        navigate('/seller/products');
      }, 1500);
    } catch (error) {
      console.error('Error saving product:', error);
      let errorMessage = t('message.saveFailed');
      
      if (error.response) {
        // Handle validation errors from the server
        if (error.response.data) {
          const serverErrors = error.response.data;
          if (typeof serverErrors === 'object') {
            // Handle field-specific errors
            const fieldErrors = {};
            Object.keys(serverErrors).forEach(key => {
              fieldErrors[key] = Array.isArray(serverErrors[key]) 
                ? serverErrors[key].join(' ') 
                : serverErrors[key];
            });
            setErrors(fieldErrors);
            errorMessage = t('validation.correctErrors');
          } else if (typeof serverErrors === 'string') {
            errorMessage = serverErrors;
          }
        }
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <h1 className="mb-4" style={{ fontFamily: 'var(--font-display)' }}>
        {isEdit ? t('seller.editProduct') : t('seller.addProduct')}
      </h1>

      <Card>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>{t('seller.productTitle')}</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    isInvalid={!!errors.title}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.title}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>{t('seller.category')}</Form.Label>
                  <Form.Select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    isInvalid={!!errors.category}
                    required
                  >
                    <option value="">{t('seller.selectCategory')}</option>
                    {Array.isArray(categories) && categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.category}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>{t('seller.description')}</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="description"
                value={formData.description}
                onChange={handleChange}
                isInvalid={!!errors.description}
                required
              />
              <Form.Control.Feedback type="invalid">
                {errors.description}
              </Form.Control.Feedback>
            </Form.Group>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>{t('seller.price')}</Form.Label>
                  <Form.Control
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    min="0.01"
                    step="0.01"
                    isInvalid={!!errors.price}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.price}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>{t('seller.discountPrice')}</Form.Label>
                  <Form.Control
                    type="number"
                    name="discount_price"
                    value={formData.discount_price}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    isInvalid={!!errors.discount_price}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.discount_price}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>{t('seller.stock')}</Form.Label>
                  <Form.Control
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    min="0"
                    isInvalid={!!errors.stock}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.stock}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>{t('seller.images')}</Form.Label>
              <Form.Control
                type="file"
                multiple
                accept="image/jpeg, image/png, image/gif, image/webp"
                onChange={handleImageChange}
                disabled={loading}
                className="mb-2"
              />
              <Form.Text className="text-muted d-block mb-2">
                Sube las imágenes del producto (la primera imagen será la principal)
              </Form.Text>
              {imageFiles.length > 0 && (
                <div className="mt-2">
                  <p className="small mb-1">
                    <strong>Imágenes seleccionadas:</strong> {imageFiles.length}
                  </p>
                  <div className="d-flex flex-wrap gap-2">
                    {imageFiles.map((file, index) => (
                      <div key={index} className="position-relative">
                        <img 
                          src={URL.createObjectURL(file)}
                          alt={`Vista previa ${index + 1}`}
                          className="img-thumbnail"
                          style={{
                            width: '60px',
                            height: '60px',
                            objectFit: 'cover',
                            opacity: loading ? 0.5 : 1
                          }}
                        />
                        {index === 0 && (
                          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-success">
                            Principal
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="switch"
                id="is_active"
                name="is_active"
                label={formData.is_active ? t('seller.active') : t('seller.inactive')}
                checked={formData.is_active}
                onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                className="mb-3"
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Check
                type="switch"
                id="is_featured"
                name="is_featured"
                label={formData.is_featured ? t('seller.featured') : t('seller.notFeatured')}
                checked={formData.is_featured}
                onChange={(e) => setFormData({...formData, is_featured: e.target.checked})}
                className="mb-3"
              />
            </Form.Group>

            <div className="d-flex gap-2">
              <Button
                type="submit"
                variant="primary"
                disabled={loading}
              >
                {loading ? 'Saving...' : t('seller.save')}
              </Button>
              <Button
                type="button"
                variant="outline-secondary"
                onClick={() => navigate('/seller/products')}
              >
                {t('seller.cancel')}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ProductForm;
