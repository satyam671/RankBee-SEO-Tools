import { useEffect } from 'react';

interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string;
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
  structuredData?: object;
}

export default function SEOHead({
  title,
  description,
  keywords = "SEO tools, keyword research, domain authority checker, backlink analyzer, rank tracker, competition checker, SEO optimization, search engine optimization, website analysis, SERP tracker, SEO audit, meta tags checker, free SEO tools, digital marketing tools",
  canonicalUrl,
  ogTitle,
  ogDescription,
  ogImage = "/og-image.jpg",
  ogType = "website",
  twitterCard = "summary_large_image",
  structuredData
}: SEOHeadProps) {
  
  useEffect(() => {
    // Set page title
    document.title = title;
    
    // Update meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    updateMetaTag('robots', 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1');
    updateMetaTag('author', 'RankBee - Professional SEO Tools');
    updateMetaTag('language', 'English');
    updateMetaTag('revisit-after', '3 days');
    
    // Open Graph tags
    updateMetaProperty('og:title', ogTitle || title);
    updateMetaProperty('og:description', ogDescription || description);
    updateMetaProperty('og:image', ogImage);
    updateMetaProperty('og:type', ogType);
    updateMetaProperty('og:site_name', 'RankBee - Professional SEO Tools');
    updateMetaProperty('og:locale', 'en_US');
    
    // Twitter Card tags
    updateMetaName('twitter:card', twitterCard);
    updateMetaName('twitter:title', ogTitle || title);
    updateMetaName('twitter:description', ogDescription || description);
    updateMetaName('twitter:image', ogImage);
    updateMetaName('twitter:site', '@RankBeeTools');
    updateMetaName('twitter:creator', '@RankBeeTools');
    
    // Additional SEO meta tags
    updateMetaName('theme-color', '#16a34a');
    updateMetaName('msapplication-TileColor', '#16a34a');
    updateMetaName('apple-mobile-web-app-capable', 'yes');
    updateMetaName('apple-mobile-web-app-status-bar-style', 'default');
    updateMetaName('format-detection', 'telephone=no');
    
    // Canonical URL
    if (canonicalUrl) {
      updateLinkTag('canonical', canonicalUrl);
    }
    
    // Structured data
    if (structuredData) {
      updateStructuredData(structuredData);
    }
    
    // Default structured data for organization
    const organizationSchema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "RankBee",
      "description": "Professional SEO Tools for Website Analysis, Keyword Research, and Search Engine Optimization",
      "url": typeof window !== 'undefined' ? window.location.origin : 'https://rankbee.app',
      "logo": typeof window !== 'undefined' ? `${window.location.origin}/logo.png` : 'https://rankbee.app/logo.png',
      "sameAs": [
        "https://twitter.com/RankBeeTools",
        "https://linkedin.com/company/rankbee"
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "email": "support@rankbee.app",
        "contactType": "customer support"
      }
    };
    
    updateStructuredData(organizationSchema, 'organization-schema');
    
  }, [title, description, keywords, canonicalUrl, ogTitle, ogDescription, ogImage, ogType, twitterCard, structuredData]);

  return null;
}

function updateMetaTag(name: string, content: string) {
  let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
  if (!meta) {
    meta = document.createElement('meta');
    meta.name = name;
    document.head.appendChild(meta);
  }
  meta.content = content;
}

function updateMetaProperty(property: string, content: string) {
  let meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('property', property);
    document.head.appendChild(meta);
  }
  meta.content = content;
}

function updateMetaName(name: string, content: string) {
  let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
  if (!meta) {
    meta = document.createElement('meta');
    meta.name = name;
    document.head.appendChild(meta);
  }
  meta.content = content;
}

function updateLinkTag(rel: string, href: string) {
  let link = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
  if (!link) {
    link = document.createElement('link');
    link.rel = rel;
    document.head.appendChild(link);
  }
  link.href = href;
}

function updateStructuredData(data: object, id: string = 'structured-data') {
  let script = document.querySelector(`script[id="${id}"]`) as HTMLScriptElement;
  if (!script) {
    script = document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data);
}