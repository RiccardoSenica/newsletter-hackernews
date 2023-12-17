import { useState } from 'react';
import { z } from 'zod';
import { NewsSchema } from '../../../../utils/schemas';

type CardContentProps = {
  story: z.infer<typeof NewsSchema>;
  side: boolean;
  width: number;
  height: number;
};

function getRandomColor() {
  const letters = '456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 12)];
  }
  return color;
}

export function TileContent({ story, width, height, side }: CardContentProps) {
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
      className={`overflow-hidden p-6 shadow-sm`}
      style={{
        backgroundColor: `${color}`,
        height: `${height * 4}px`,
        width: `${width * 4}px`
      }}
    >
      <h1 className='overflow-auto font-semibold'>{story.title}</h1>
      <p className='overflow-auto italic'>{story.by}</p>
      <div
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
