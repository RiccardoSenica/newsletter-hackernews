import { NewsTileType } from '@utils/validationSchemas';

interface CardContentProps {
  story: NewsTileType;
  side: boolean;
  firstColor: string;
  secondColor: string;
}

export default function TileContent({
  story,
  side,
  firstColor,
  secondColor
}: CardContentProps) {
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
