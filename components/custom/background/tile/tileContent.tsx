import { useState } from 'react';
import { z } from 'zod';
import { getRandomColor } from '../../../../utils/getRandomColor';
import { NewsSchema } from '../../../../utils/schemas';

type CardContentProps = {
  story: z.infer<typeof NewsSchema>;
  side: boolean;
};

export function TileContent({ story, side }: CardContentProps) {
  const [firstColor, setFirstColor] = useState(getRandomColor());
  const [secondColor, setSecondColor] = useState(getRandomColor());
  const [switched, setSwitched] = useState(true);

  if (switched !== side) {
    setFirstColor(getRandomColor());
    setSecondColor(getRandomColor());

    setSwitched(side);
  }

  const color = side ? firstColor : secondColor;

  return (
    <div
      className={`h-40 w-40 overflow-hidden rounded-lg p-6 shadow-sm`}
      style={{
        backgroundColor: `${color}`
      }}
    >
      <h1 className='overflow-auto font-semibold'>{story.title}</h1>
      <p className='overflow-auto italic'>by {story.by}</p>
      <div
        className='rounded-lg'
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: '33.33%',
          background: `linear-gradient(to bottom, transparent, ${color})`
        }}
      ></div>
    </div>
  );
}
