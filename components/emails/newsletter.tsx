import { Container } from '@react-email/container';
import { Html } from '@react-email/html';
import { Section } from '@react-email/section';
import { Text } from '@react-email/text';
import { z } from 'zod';
import { NewsSchema } from '../../utils/schemas';

export default function NewsletterTemplate(
  stories: z.infer<typeof NewsSchema>[]
) {
  return {
    subject: `What's new from Hackernews?`,
    template: (
      <Html>
        <Section style={main}>
          <Container style={container}>
            <Text style={paragraph}>
              {stories.map(story => {
                return (
                  <div
                    key={story.id}
                    style={{
                      padding: '10px',
                      border: '1px solid #ccc',
                      boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    <h1>{story.title}</h1>
                    <p>{story.by}</p>
                    {story.text && (
                      <p
                        dangerouslySetInnerHTML={{
                          __html:
                            story.text.length > 500
                              ? story.text.substring(0, 500) + '...'
                              : story.text
                        }}
                      />
                    )}
                    {story.url && (
                      <p>
                        <a href={story.url} style={{ textAlign: 'right' }}>
                          Read more
                        </a>
                      </p>
                    )}
                  </div>
                );
              })}
            </Text>
          </Container>
        </Section>
      </Html>
    )
  };
}

const main = {
  backgroundColor: '#ffffff'
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  width: '580px'
};

const paragraph = {
  fontSize: '18px',
  lineHeight: '1.4',
  color: '#484848'
};
