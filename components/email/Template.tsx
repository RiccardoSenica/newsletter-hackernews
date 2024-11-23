import React from 'react';
import { Footer } from './components/Footer';

interface TemplateProps {
  title: string;
  body: JSX.Element;
  variant?: string;
}

export const Template = ({
  title,
  body,
  variant = 'default'
}: TemplateProps) => {
  const isNewsletter = variant === 'newsletter';

  return (
    <div
      style={{
        maxWidth: '720px',
        margin: '0 auto',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        backgroundColor: '#ffffff'
      }}
    >
      <div
        style={{
          background: 'linear-gradient(135deg, #9333EA 0%, #F5A162 100%)',
          padding: '28px 24px',
          borderTopLeftRadius: '8px',
          borderTopRightRadius: '8px'
        }}
      >
        <p
          style={{
            margin: '0 0 8px 0',
            fontSize: '12px',
            textTransform: 'uppercase',
            color: 'rgba(255, 255, 255, 0.9)',
            textAlign: 'center'
          }}
        >
          Hacker News + newsletter
        </p>
        <h2
          style={{
            fontSize: '24px',
            textAlign: 'center',
            color: 'white',
            fontWeight: '600',
            margin: '0',
            letterSpacing: '-0.02em'
          }}
        >
          {title}
        </h2>
      </div>
      <div
        style={{
          backgroundColor: '#ffffff',
          padding: '32px 24px'
        }}
      >
        <div
          style={{
            color: '#374151',
            fontSize: isNewsletter ? '16px' : '14px',
            lineHeight: '1.6'
          }}
        >
          {body}
        </div>
      </div>
      <Footer />
    </div>
  );
};
