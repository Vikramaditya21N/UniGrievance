import React from 'react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="college-footer">
      <div className="footer-content">
        <div className="footer-section">
          <h5>📱 UniGrievance</h5>
          <p>A modern grievance redressal platform for universities and colleges to efficiently address student and faculty concerns</p>
        </div>
        
        <div className="footer-section">
          <h5>Quick Links</h5>
          <ul>
            <li><a href="#about">About</a></li>
            <li><a href="#contact">Contact</a></li>
            <li><a href="#privacy">Privacy Policy</a></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h5>Contact Info</h5>
          <p>📧 support@unigrievance.edu</p>
          <p>📞 +91-1800-GRIEVANCE</p>
          <p>📍 University Campus</p>
        </div>
      </div>
      
      <div className="footer-divider"></div>
      
      <div className="footer-bottom">
        <p>&copy; {currentYear} UniGrievance. All Rights Reserved.</p>
        <p>Developed with ❤️ for Educational Excellence</p>
      </div>
    </footer>
  );
};

export default Footer;
