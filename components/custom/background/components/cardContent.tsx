import { useState } from 'react';
import { z } from 'zod';
import { NewsSchema } from '../../../../utils/types';

type CardContentProps = {
  story: z.infer<typeof NewsSchema>;
  side: boolean;
  width: number;
  height: number;
};

export function CardContent({ story, width, height, side }: CardContentProps) {
  const backgroundColors = [
    'bg-red-300',
    'bg-blue-300',
    'bg-green-300',
    'bg-yellow-300',
    'bg-indigo-300',
    'bg-purple-300',
    'bg-pink-300',
    'bg-gray-300',
    'bg-teal-300',
    'bg-orange-300'
  ];

  const fadingColors = [
    'to-red-300',
    'to-blue-300',
    'to-green-300',
    'to-yellow-300',
    'to-indigo-300',
    'to-purple-300',
    'to-pink-300',
    'to-gray-300',
    'to-teal-300',
    'to-orange-300'
  ];

  const firstRandom = Math.floor(Math.random() * backgroundColors?.length);
  const secondRandom = Math.floor(Math.random() * backgroundColors?.length);

  const [firstColor, setFirstColor] = useState(firstRandom);
  const [secondColor, setSecondColor] = useState(secondRandom);
  const [switched, setSwitched] = useState(true);

  if (switched !== side) {
    setFirstColor(firstRandom);
    setSecondColor(secondRandom);

    setSwitched(side);
  }

  const colorIndex = side ? firstColor : secondColor;

  return (
    <div
      className={`h-${height} w-${width} overflow-hidden p-6 shadow-sm ${backgroundColors[colorIndex]}`}
    >
      <h1 className='font-semibold'>{story.title}</h1>
      <p className='italic'>{story.by}</p>
      <div
        className={`absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-b from-transparent ${fadingColors[colorIndex]}`}
      ></div>
    </div>
  );
}
