import { getRandomGrey } from '@utils/getRandomGrey';
import { NewsTileType } from '@utils/validationSchemas';
import { useEffect, useState } from 'react';
import { TileContent } from './TileContent';

interface CardProps {
  newsA?: NewsTileType;
  newsB?: NewsTileType;
}

const TEN_SECONDS = 10000;
const HALF_SECOND = 500;

export const Tile = ({ newsA, newsB }: CardProps) => {
  const [switched, setSwitched] = useState(false);
  const [active, setActive] = useState(false);
  const [delayed, setDelayed] = useState(true);
  const [colorA, setColorA] = useState(getRandomGrey());
  const [colorB, setColorB] = useState(getRandomGrey());

  useEffect(() => {
    const randomDelay = Math.floor(Math.random() * TEN_SECONDS);

    const interval = setInterval(
      () => {
        setSwitched(true);

        window.setTimeout(function () {
          setActive(!active);
          setColorA(getRandomGrey());
          setColorB(getRandomGrey());
        }, HALF_SECOND / 2);

        window.setTimeout(function () {
          setSwitched(false);
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
};
