import { useEffect, useState } from 'react';
import { z } from 'zod';
import { NewsTileSchema } from '../../../../utils/schemas';
import TileContent from './tileContent';

type CardProps = {
  newsA?: z.infer<typeof NewsTileSchema>;
  newsB?: z.infer<typeof NewsTileSchema>;
};

const randomDelay = Math.floor(Math.random() * 10000);

export default function Tile({ newsA, newsB }: CardProps) {
  const [switched, setSwitched] = useState(false);
  const [active, setActive] = useState(Math.random() < 0.5);
  const [delayed, setDelayed] = useState(true);

  useEffect(() => {
    const interval = setInterval(
      () => {
        setSwitched(true);

        window.setTimeout(function () {
          setSwitched(false);
          setActive(!active);
          setDelayed(false);
        }, 500 / 2);
      },
      delayed ? randomDelay : randomDelay + 10000
    );

    return () => clearInterval(interval);
  }, [active, delayed]);

  if (!newsA || !newsB) return <div></div>;

  return (
    <div className={`transform ${switched ? 'animate-rotate' : ''}`}>
      <div className='transform-gpu'>
        <div className={`absolute left-0 top-0 w-full ${''}`}>
          {active
            ? TileContent({ story: newsA, side: true })
            : TileContent({ story: newsB, side: false })}
        </div>
      </div>
    </div>
  );
}
