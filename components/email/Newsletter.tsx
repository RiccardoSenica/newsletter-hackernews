import { getSayings } from '@utils/getSayings';
import { summirize } from '@utils/summarize';
import { NewsType } from '@utils/validationSchemas';
import createDOMPurify from 'isomorphic-dompurify';
import Template from './Template';

export default async function NewsletterTemplate(stories: NewsType[]) {
  const summary = await summirize(stories);
  const sanitizedSummary = createDOMPurify.sanitize(summary, {
    USE_PROFILES: { html: true }
  });

  if (!sanitizedSummary) {
    console.error('Failed to sanitize summary');
    throw new Error('Failed to sanitize summary');
  }

  return {
    subject: `What's new from the Hackernews forum?`,
    template: (
      <Template
        title={`Here is something 
              ${getSayings[Math.floor(Math.random() * getSayings.length)]}!`}
        body={
          <div
            style={{ fontSize: '1rem', color: '#4a5568' }}
            dangerouslySetInnerHTML={{ __html: sanitizedSummary }}
          />
        }
      />
    )
  };
}
