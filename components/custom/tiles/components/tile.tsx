import { useEffect, useState } from 'react';
import { z } from 'zod';
import { NewsTileSchema } from '../../../../utils/schemas';
import TileContent from './tileContent';

type CardProps = {
  newsA?: z.infer<typeof NewsTileSchema>;
  newsB?: z.infer<typeof NewsTileSchema>;
};

const TEN_SECONDS = 10000;
const HALF_SECOND = 500;

export default function Tile({ newsA, newsB }: CardProps) {
  const [switched, setSwitched] = useState(false);
  const [active, setActive] = useState(false);
  const [delayed, setDelayed] = useState(true);

  useEffect(() => {
    const randomDelay = Math.floor(Math.random() * TEN_SECONDS);

    const interval = setInterval(
      () => {
        setSwitched(true);

        window.setTimeout(function () {
          setSwitched(false);
          setActive(!active);
          setDelayed(false);
        }, HALF_SECOND);
      },
      delayed ? randomDelay : randomDelay + TEN_SECONDS
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
