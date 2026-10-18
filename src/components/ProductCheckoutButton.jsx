import React, { useEffect, useState } from 'react';

const PUBLIC_CONFIG_URL = 'https://pay.erickfirm.com/api/public-config';

const ProductCheckoutButton = ({ code, label }) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    const timeoutId = window.setTimeout(() => controller.abort(), 4000);

    fetch(PUBLIC_CONFIG_URL, { method: 'GET', signal: controller.signal, cache: 'no-store' })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        const product = Array.isArray(data?.products)
          ? data.products.find((item) => item?.code === code)
          : null;
        if (active) setIsOpen(product?.status === 'open');
      })
      .catch(() => {})
      .finally(() => window.clearTimeout(timeoutId));

    return () => {
      active = false;
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [code]);

  if (!isOpen) return null;

  return (
    <a
      href={'https://pay.erickfirm.com/?product=' + encodeURIComponent(code)}
      className="abl-cta abl-sales-checkout"
    >
      {label}
    </a>
  );
};

export default ProductCheckoutButton;
