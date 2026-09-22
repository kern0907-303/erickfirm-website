import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const DEFAULT_TITLE = 'Erick Firm｜艾瑞克 - 事情卡住，通常不是因為不夠努力';
const DEFAULT_DESC = '艾瑞克（Erick），二十年來陪個人與企業看見真正影響結果的關鍵因素，從自我理解、個人狀態到企業決策，找到更清楚的下一步。';
const DEFAULT_IMAGE = 'https://erickfirm.com/og-default.png';
const DOMAIN = 'https://erickfirm.com';

export const updateMetaTags = ({
  title,
  description,
  image,
  url,
  type = 'website'
}) => {
  const hasBrandSuffix = title?.includes('Erick Firm') || title?.includes('Erick Frim');
  const metaTitle = !title ? DEFAULT_TITLE : hasBrandSuffix ? title : `${title} | Erick Firm`;
  const metaDesc = description || DEFAULT_DESC;
  const metaImage = image?.startsWith('http') ? image : image ? `${DOMAIN}${image.startsWith('/') ? image : `/${image}`}` : DEFAULT_IMAGE;
  const metaUrl = url || (typeof window !== 'undefined' ? window.location.href : DOMAIN);

  // 1. Title
  document.title = metaTitle;

  // Helper function to update or create tag
  const setMeta = (attr, key, content) => {
    let element = document.querySelector(`meta[${attr}="${key}"]`);
    if (!element) {
      element = document.createElement('meta');
      element.setAttribute(attr, key);
      document.head.appendChild(element);
    }
    element.setAttribute('content', content);
  };

  const setLink = (rel, href) => {
    let element = document.querySelector(`link[rel="${rel}"]`);
    if (!element) {
      element = document.createElement('link');
      element.setAttribute('rel', rel);
      document.head.appendChild(element);
    }
    element.setAttribute('href', href);
  };

  // 2. Standard Meta
  setMeta('name', 'description', metaDesc);

  // 3. Canonical
  setLink('canonical', metaUrl);

  // 4. Open Graph
  setMeta('property', 'og:title', metaTitle);
  setMeta('property', 'og:description', metaDesc);
  setMeta('property', 'og:url', metaUrl);
  setMeta('property', 'og:image', metaImage);
  setMeta('property', 'og:type', type);
  setMeta('property', 'og:site_name', 'Erick Firm');
  setMeta('property', 'og:locale', 'zh_TW');

  // 5. Twitter Card
  setMeta('name', 'twitter:card', 'summary_large_image');
  setMeta('name', 'twitter:title', metaTitle);
  setMeta('name', 'twitter:description', metaDesc);
  setMeta('name', 'twitter:image', metaImage);
};

const SEOHead = ({ title, description, image, type = 'website' }) => {
  const location = useLocation();

  useEffect(() => {
    const currentUrl = `${DOMAIN}${location.pathname}`;
    updateMetaTags({
      title,
      description,
      image,
      url: currentUrl,
      type
    });
  }, [title, description, image, location.pathname, type]);

  return null;
};

export default SEOHead;
