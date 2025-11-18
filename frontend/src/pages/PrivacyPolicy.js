import React from 'react';
import { Container } from 'react-bootstrap';

const PrivacyPolicy = () => {
  return (
    <Container className="py-5">
      <div className="fade-in">
        <h1 className="mb-4" style={{ fontFamily: 'var(--font-display)' }}>
          Privacy Policy
        </h1>

        <div className="text-muted mb-5">
          <p><strong>Last Updated: November 2025</strong></p>
        </div>

        <section className="mb-5">
          <h2 className="mb-3">1. Introduction</h2>
          <p>
            Welcome to Planet Price ("we," "us," "our," or "Company"). We are committed to protecting your privacy and ensuring you have a positive experience on our website and services. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
          </p>
        </section>

        <section className="mb-5">
          <h2 className="mb-3">2. Information We Collect</h2>
          <p>We collect information in various ways, including:</p>
          <ul>
            <li><strong>Personal Information:</strong> Name, email address, phone number, shipping address, billing address, and payment information.</li>
            <li><strong>Account Information:</strong> Username, password, profile picture, and account preferences.</li>
            <li><strong>Transaction Information:</strong> Order history, purchase details, and payment records.</li>
            <li><strong>Device Information:</strong> IP address, browser type, operating system, and device identifiers.</li>
            <li><strong>Usage Information:</strong> Pages visited, time spent on pages, links clicked, and search queries.</li>
            <li><strong>Location Information:</strong> General location data based on IP address.</li>
          </ul>
        </section>

        <section className="mb-5">
          <h2 className="mb-3">3. How We Use Your Information</h2>
          <p>We use the information we collect for the following purposes:</p>
          <ul>
            <li>Processing and fulfilling your orders and transactions</li>
            <li>Creating and maintaining your account</li>
            <li>Sending transactional emails and order confirmations</li>
            <li>Providing customer support and responding to inquiries</li>
            <li>Personalizing your shopping experience</li>
            <li>Improving our website, products, and services</li>
            <li>Conducting marketing and promotional activities</li>
            <li>Detecting and preventing fraudulent transactions</li>
            <li>Complying with legal obligations</li>
          </ul>
        </section>

        <section className="mb-5">
          <h2 className="mb-3">4. Sharing Your Information</h2>
          <p>
            We may share your information with third parties in the following circumstances:
          </p>
          <ul>
            <li><strong>Service Providers:</strong> Payment processors, shipping companies, and customer service platforms.</li>
            <li><strong>Sellers:</strong> If you purchase from a seller, we share necessary information to fulfill your order.</li>
            <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and safety.</li>
            <li><strong>Business Transfers:</strong> In case of merger, acquisition, or sale of assets.</li>
            <li><strong>With Your Consent:</strong> When you explicitly agree to share your information.</li>
          </ul>
        </section>

        <section className="mb-5">
          <h2 className="mb-3">5. Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
          </p>
        </section>

        <section className="mb-5">
          <h2 className="mb-3">6. Cookies and Tracking Technologies</h2>
          <p>
            We use cookies and similar tracking technologies to enhance your experience on our website. These technologies help us understand user behavior, remember preferences, and deliver personalized content. You can control cookie settings through your browser preferences.
          </p>
        </section>

        <section className="mb-5">
          <h2 className="mb-3">7. Your Rights and Choices</h2>
          <p>
            Depending on your location, you may have the following rights:
          </p>
          <ul>
            <li>Access to your personal information</li>
            <li>Correction of inaccurate information</li>
            <li>Deletion of your information</li>
            <li>Opt-out of marketing communications</li>
            <li>Data portability</li>
            <li>Withdrawal of consent</li>
          </ul>
          <p>
            To exercise any of these rights, please contact us at privacy@planetprice.com.
          </p>
        </section>

        <section className="mb-5">
          <h2 className="mb-3">8. Children's Privacy</h2>
          <p>
            Our website and services are not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected information from a child under 13, we will take steps to delete such information and terminate the child's account.
          </p>
        </section>

        <section className="mb-5">
          <h2 className="mb-3">9. Third-Party Links</h2>
          <p>
            Our website may contain links to third-party websites. We are not responsible for the privacy practices of these external sites. We encourage you to review their privacy policies before providing any personal information.
          </p>
        </section>

        <section className="mb-5">
          <h2 className="mb-3">10. Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the updated policy on our website and updating the "Last Updated" date.
          </p>
        </section>

        <section className="mb-5">
          <h2 className="mb-3">11. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy or our privacy practices, please contact us at:
          </p>
          <ul>
            <li><strong>Email:</strong> privacy@planetprice.com</li>
            <li><strong>Phone:</strong> +1 (555) 123-4567</li>
            <li><strong>Address:</strong> 123 Commerce St, City, Country</li>
          </ul>
        </section>
      </div>
    </Container>
  );
};

export default PrivacyPolicy;
