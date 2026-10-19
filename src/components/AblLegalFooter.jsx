import React from 'react';
import { Link } from 'react-router-dom';
import './AblLegalFooter.css';

const AblLegalFooter = () => (
  <div className="abl-legal-footer">
    <p>艾伯林量子調頻　統一編號 88134911　abliene358@gmail.com</p>
    <nav aria-label="法務資訊">
      <Link to="/abl/terms">服務條款</Link>
      <Link to="/abl/privacy">隱私權政策</Link>
    </nav>
  </div>
);

export default AblLegalFooter;
