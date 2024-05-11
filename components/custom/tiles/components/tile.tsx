import { useEffect, useState } from 'react';
import { getRandomGrey } from '../../../../utils/getRandomGrey';
import { NewsTileType } from '../../../../utils/validationSchemas';
import TileContent from './tileContent';

interface CardProps {
  newsA?: NewsTileType;
  newsB?: NewsTileType;
}

const TEN_SECONDS = 10000;
const HALF_SECOND = 500;

export default function Tile({ newsA, newsB }: CardProps) {
  const [switched, setSwitched] = useState(false);
  const [active, setActive] = useState(false);
  const [delayed, setDelayed] = useState(true);
  const [colorA, setColorA] = useState(getRandomGrey());
  const [colorB, setColorB] = useState(getRandomGrey());

  useEffect(() => {
    setColorA(getRandomGrey());
    setColorB(getRandomGrey());
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
            ? TileContent({
                story: newsA,
                side: true,
                firstColor: colorA,
                secondColor: colorB
              })
            : TileContent({
                story: newsB,
                side: false,
                firstColor: colorB,
                secondColor: colorA
              })}
        </div>
      </div>
    </div>
  );
}
