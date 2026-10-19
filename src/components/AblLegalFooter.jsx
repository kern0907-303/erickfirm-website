import React from 'react';
import { Link } from 'react-router-dom';
import { LEGAL_EMAIL, LEGAL_SELLER_LINE, LEGAL_TAX_ID } from '../content/ablLegal';
import './AblLegalFooter.css';

const AblLegalFooter = () => (
  <div className="abl-legal-footer">
    <p>{LEGAL_SELLER_LINE}　統一編號 {LEGAL_TAX_ID}　{LEGAL_EMAIL}</p>
    <nav aria-label="法務資訊">
      <Link to="/abl/terms">服務條款</Link>
      <Link to="/abl/privacy">隱私權政策</Link>
    </nav>
  </div>
);

export default AblLegalFooter;
