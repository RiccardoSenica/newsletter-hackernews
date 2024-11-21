import React from 'react';
import { summirize } from '@utils/summarize';
import { NewsType } from '@utils/validationSchemas';
import createDOMPurify from 'isomorphic-dompurify';
import Template from './Template';
import extractMainTopic from '@utils/extractMainTopic';

export default async function NewsletterTemplate(stories: NewsType[]) {
  const summary = await summirize(stories);
  const sanitizedSummary = createDOMPurify.sanitize(summary, {
    USE_PROFILES: { html: true },
    ADD_ATTR: ['target', 'rel', 'style']
  });

  if (!sanitizedSummary) {
    console.error('Failed to sanitize summary');
    throw new Error('Failed to sanitize summary');
  }

  const topic = extractMainTopic(sanitizedSummary);

  return {
    subject: topic,
    template: (
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
            <div dangerouslySetInnerHTML={{ __html: sanitizedSummary }} />
          </div>
        }
      />
    )
  };
}
