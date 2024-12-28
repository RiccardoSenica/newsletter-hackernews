import React from 'react';
import { summirize } from '@utils/anthropic/summarize';
import { NewsType } from '@utils/types';
import createDOMPurify from 'isomorphic-dompurify';
import { Template } from './Template';

export const NewsletterTemplate = async (stories: NewsType[]) => {
  const { title, content, focus } = await summirize(stories);

  const sanitizedContent = createDOMPurify.sanitize(content);

  const sanitizedFocus = createDOMPurify.sanitize(focus);

  if (!sanitizedContent || !sanitizedFocus) {
    throw new Error('Failed to sanitize newsletter.');
  }

  return {
    subject: title,
    body: (
      <Template
        variant='newsletter'
        title='Your Daily Tech Updates'
        body={
          <div
            style={{
              color: '#374151',
              fontSize: '16px',
              lineHeight: 1.6
            }}
          >
            <style>
              {`
                .what-to-watch {
                  margin-top: 32px;
                  padding: 24px;
                  background: linear-gradient(135deg, rgba(186,27,88,0.03) 0%, rgba(245,161,98,0.03) 100%);
                  border-left: 3px solid #BA1B58;
                  border-radius: 4px;
                }
                .what-to-watch h3 {
                  margin: 0 0 16px 0;
                  color: #BA1B58;
                  font-size: 18px;
                  font-weight: 600;
                  letter-spacing: -0.02em;
                }
                .what-to-watch p {
                  margin: 0;
                  color: #4A5568;
                }
                .what-to-watch a {
                  color: #9333EA !important;
                  text-decoration: none;
                  font-weight: 500;
                }
              `}
            </style>
            <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
            <div
              style={{
                marginTop: '24px',
                color: '#374151',
                padding: '20px',
                background: '#F8FAFC',
                borderLeft: '3px solid #386FA4',
                borderRadius: '4px'
              }}
            >
              <h3
                style={{
                  margin: '0 0 12px 0',
                  color: '#386FA4',
                  fontSize: '18px',
                  fontWeight: '600'
                }}
              >
                What to Watch
              </h3>
              <div dangerouslySetInnerHTML={{ __html: sanitizedFocus }} />
            </div>
          </div>
        }
      />
    )
  };
};
