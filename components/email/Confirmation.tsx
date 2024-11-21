import React from 'react';
import Note from './components/Note';
import Template from './Template';

export default function ConfirmationTemplate(code: string) {
  return {
    subject: 'Welcome!',
    template: (
      <Template
        title='Welcome!'
        body={
          <div style={{ color: '#4A5568' }}>
            <p>Dear subscriber,</p>
            <p style={{ marginTop: '16px' }}>
              Thank you for subscribing to our newsletter! Please click the link
              below to confirm your subscription.
            </p>
            <div
              style={{
                margin: '32px 0',
                textAlign: 'center'
              }}
            >
              <a
                href={`${process.env.HOME_URL}/confirmation?code=${code}`}
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
                Confirm subscription
              </a>
            </div>
            <Note>
              If you didn&apos;t subscribe to our newsletter, please ignore this
              email.
            </Note>
          </div>
        }
      />
    )
  };
}
