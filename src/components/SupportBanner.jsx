import React from 'react';
import { useNavigate } from 'react-router-dom';

const SupportBanner = () => {
  const navigate = useNavigate();

  return (
    <>
      <style>
        {`
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .promo-banner {
            background: linear-gradient(90deg, #5b4ef5 0%, #8b5cf6 100%);
            color: white;
            padding: 8px 24px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-radius: 12px;
            margin-bottom: 24px;
            box-shadow: 0 4px 12px rgba(91, 78, 245, 0.2);
            animation: fadeInUp 0.5s ease-out;
          }
          .promo-banner p {
            margin: 0;
            font-size: 14px;
            font-weight: 500;
            letter-spacing: 0.01em;
          }
          .promo-cta {
            background: rgba(255, 255, 255, 0.2);
            border: 1px solid rgba(255, 255, 255, 0.4);
            color: white;
            padding: 4px 16px;
            border-radius: 8px;
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
            text-decoration: none;
            backdrop-filter: blur(4px);
          }
          .promo-cta:hover {
            background: white;
            color: #5b4ef5;
            transform: translateY(-1px);
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          @media (max-width: 640px) {
            .promo-banner {
              flex-direction: column;
              gap: 12px;
              text-align: center;
              padding: 16px;
            }
          }
        `}
      </style>

      <div className="promo-banner">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span role="img" aria-label="info">✨</span>
          <p>
            Further bank statement support is coming soon! If you want any other types of features, feel free to reach us.
          </p>
        </div>
        <button className="promo-cta" onClick={() => navigate('/support')}>
          Contact Support
        </button>
      </div>
    </>
  );
};

export default SupportBanner;
