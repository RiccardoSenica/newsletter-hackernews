import { z } from 'zod';
import { getRandomColor } from '../../utils/getRandomColor';
import { NewsSchema } from '../../utils/schemas';
import Email from './template';

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
      <Email
        title='Good day!'
        body={
          <div className='text-base text-gray-700 dark:text-gray-400'>
            <p className='flex justify-center'>
              Here is something{' '}
              {sayings[Math.floor(Math.random() * sayings.length)]}:
            </p>
            {stories.map(story => {
              const background = getRandomColor();

              return (
                <div
                  key={story.id}
                  className='mt-8 rounded-lg border bg-card text-card-foreground shadow-sm'
                  data-v0-t='card'
                  style={{ backgroundColor: `${background}` }}
                >
                  <div className='flex flex-col space-y-1.5 px-6 pb-2 pt-6'>
                    <h2 className='text-2xl font-semibold'>{story.title}</h2>
                    <p className='italic'>by {story.by}</p>
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
                    <div className='p-6 text-right font-bold'>
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
