import { z } from 'zod';
import { NewsSchema } from '../../utils/schemas';
import { sayings } from './helpers/sayings';
import Template from './template';

export default function NewsletterTemplate(
  stories: z.infer<typeof NewsSchema>[]
) {
  return {
    subject: `What's new from the Hackernews forum?`,
    template: (
      <Template
        title={`Here is something 
              ${sayings[Math.floor(Math.random() * sayings.length)]}!`}
        body={
          <div>
            {stories.map(story => {
              return (
                <div
                  key={story.id}
                  style={{
                    marginTop: '2rem',
                    marginBottom: '2rem',
                    borderRadius: '0.5rem',
                    border: '1px solid #e5e7eb',
                    backgroundColor: `white`,
                    color: '#111827',
                    boxShadow: '0 16px 32px 0 rgba(0, 0, 0, 0.05)'
                  }}
                  data-v0-t='card'
                >
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.375rem',
                      paddingTop: '1.5rem',
                      paddingLeft: '1.5rem',
                      paddingRight: '1.5rem'
                    }}
                  >
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '600' }}>
                      {story.title}
                    </h2>
                    <p style={{ fontSize: '1rem', fontStyle: 'italic' }}>
                      by {story.by}
                    </p>
                  </div>
                  {story.text && (
                    <div
                      style={{
                        paddingLeft: '1.5rem',
                        fontSize: '1rem',
                        paddingRight: '1.5rem'
                      }}
                    >
                      <p
                        dangerouslySetInnerHTML={{
                          __html:
                            story.text.length > 500
                              ? story.text.substring(0, 500) + '...'
                              : story.text
                        }}
                      />
                    </div>
                  )}
                  {story.url && (
                    <div
                      style={{
                        paddingBottom: '1.5rem',
                        paddingLeft: '1.5rem',
                        paddingRight: '1.5rem',
                        textAlign: 'right',
                        fontWeight: 'bold'
                      }}
                    >
                      <a href={story.url}>Read more</a>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        }
      />
    )
  };
}
