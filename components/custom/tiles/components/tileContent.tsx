import { useState } from 'react';
import { z } from 'zod';
import { getRandomGrey } from '../../../../utils/getRandomGrey';
import { NewsTileSchema } from '../../../../utils/schemas';

type CardContentProps = {
  story: z.infer<typeof NewsTileSchema>;
  side: boolean;
};

export function TileContent({ story, side }: CardContentProps) {
  const [firstColor, setFirstColor] = useState(getRandomGrey());
  const [secondColor, setSecondColor] = useState(getRandomGrey());
  const [switched, setSwitched] = useState(true);

  if (switched !== side) {
    setFirstColor(getRandomGrey());
    setSecondColor(getRandomGrey());

    setSwitched(side);
  }

  const color = side ? firstColor : secondColor;

  return (
    <div
      className={`h-40 w-40 overflow-hidden rounded-lg p-6 shadow-sm`}
      style={{
        backgroundColor: `${color}`,
        color: '#808080'
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
