import { Container } from '@react-email/container';
import { Html } from '@react-email/html';
import { Section } from '@react-email/section';
import { Text } from '@react-email/text';
import { z } from 'zod';
import { NewsSchema } from '../../utils/schemas';
import { Footer } from './components/footer';

export default function NewsletterTemplate(
  stories: z.infer<typeof NewsSchema>[]
) {
  const sayings = [
    'hot off the press',
    'straight from the oven',
    "straight from the horse's mouth",
    'brand spanking new',
    'fresh as a daisy',
    'straight out of the box',
    'straight off the assembly line',
    'hot out of the kitchen',
    'just minted',
    'freshly brewed',
    'just off the production line'
  ];

  return {
    subject: `What's new from Hackernews?`,
    template: (
      <Html>
        <Section style={main}>
          <div className='mx-auto w-full max-w-2xl overflow-hidden rounded-lg bg-white shadow-lg'>
            <div className='text-center '>
              <h1 className='my-4 text-3xl font-bold'>Good day!</h1>
              <p>
                Here is something{' '}
                {sayings[Math.floor(Math.random() * sayings.length)]}:
              </p>
            </div>
            <Container style={container}>
              <Text>
                {stories.map(story => {
                  return (
                    <div
                      key={story.id}
                      className='mt-8 rounded-lg border bg-card text-card-foreground shadow-sm'
                      data-v0-t='card'
                    >
                      <div className='flex flex-col space-y-1.5 p-6'>
                        <h2 className='text-2xl font-semibold'>
                          {story.title}
                        </h2>
                        <p>{story.by}</p>
                      </div>
                      {story.text && (
                        <div className='px-6'>
                          <p
                            className='mb-4'
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
                        <div className='p-4 text-right'>
                          <p>
                            <a
                              href={story.url}
                              className='inline-flex h-10 items-center justify-center rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-blue-700/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'
                            >
                              Read more
                            </a>
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </Text>
            </Container>
            <Footer />
          </div>
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
