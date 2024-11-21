import React from 'react';
import Note from './components/Note';
import Template from './Template';

export default function UnsubscribeTemplate() {
  return {
    subject: 'Unsubscribe confirmation',
    template: (
      <Template
        title="We're sad to see you go"
        body={
          <div style={{ color: '#4A5568' }}>
            <p style={{ marginTop: '16px' }}>
              You have been successfully unsubscribed from our newsletter. You
              won&apos;t receive any further communications from us unless you
              explicitly opt-in again.
            </p>
            <div
              style={{
                margin: '32px 0',
                textAlign: 'center'
              }}
            >
              <a
                href={`${process.env.HOME_URL}/`}
                style={{
                  display: 'inline-block',
                  padding: '12px 24px',
                  backgroundColor: '#9333EA',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '6px',
                  fontWeight: '500',
                  border: 'none'
                }}
              >
                Re-subscribe
              </a>
            </div>
            <Note>
              If you have any questions or concerns, please feel free to{' '}
              <a
                style={{
                  color: '#386FA4',
                  textDecoration: 'none'
                }}
                href={`mailto:${process.env.NEXT_PUBLIC_BRAND_EMAIL}`}
              >
                contact us
              </a>
              .
            </Note>
          </div>
        }
      />
    )
  };
}
