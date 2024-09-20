import { getSayings } from '@utils/getSayings';
import { summirize } from '@utils/summarize';
import { textTruncate } from '@utils/textTruncate';
import { NewsType } from '@utils/validationSchemas';
import Template from './Template';

export default async function NewsletterTemplate(stories: NewsType[]) {
  const summary = await summirize(stories);

  return {
    subject: `What's new from the Hackernews forum?`,
    template: (
      <Template
        title={`Here is something 
              ${getSayings[Math.floor(Math.random() * getSayings.length)]}!`}
        body={
          <>
            {summary && (
              <div
                style={{
                  marginTop: '2rem',
                  marginBottom: '2rem',
                  borderRadius: '0.5rem',
                  border: '2px solid #8230CC',
                  backgroundColor: `white`,
                  color: '#111827',
                  boxShadow: '0 16px 32px 0 rgba(0, 0, 0, 0.05)'
                }}
                data-v0-t='card'
              >
                <p>{summary}</p>
              </div>
            )}
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
                      <h3>{story.title}</h3>
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
                                ? textTruncate(story.text, 500) + '...'
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
          </>
        }
      />
    )
  };
}
