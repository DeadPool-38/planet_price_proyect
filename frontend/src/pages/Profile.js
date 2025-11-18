import React from 'react';
import { Container, Card, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { t } = useTranslation();
  const { user, applySeller } = useAuth();

  const handleApplySeller = async () => {
    await applySeller();
  };

  return (
    <Container className="py-5">
      <h1 className="mb-4" style={{ fontFamily: 'var(--font-display)' }}>
        {t('nav.profile')}
      </h1>

      <Card>
        <Card.Body>
          <h5 className="mb-3">Account Information</h5>
          <p><strong>Username:</strong> {user?.username}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Name:</strong> {user?.first_name} {user?.last_name}</p>
          <p><strong>Role:</strong> {user?.role}</p>
          
          {user?.role === 'buyer' && (
            <div className="mt-4">
              <h6>Want to sell on Planet Price?</h6>
              <Button variant="primary" onClick={handleApplySeller}>
                {t('nav.becomeSeller')}
              </Button>
            </div>
          )}
          
          {user?.role === 'seller' && !user?.seller_approved && (
            <div className="alert alert-warning mt-3">
              Your seller application is pending approval.
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Profile;
