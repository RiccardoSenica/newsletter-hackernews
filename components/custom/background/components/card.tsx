import { useEffect, useState } from 'react';
import { z } from 'zod';
import { NewsSchema } from '../../../../utils/types';
import { Story } from './story';

type CardProps = {
  newsA?: z.infer<typeof NewsSchema>;
  newsB?: z.infer<typeof NewsSchema>;
};

export function Card({ newsA, newsB }: CardProps) {
  const [switched, setSwitched] = useState(false);
  const [active, setActive] = useState(Math.random() < 0.5);
  const [delayed, setDelayed] = useState(true);

  useEffect(() => {
    const randomDelay = Math.floor(Math.random() * 5000);

    const interval = setInterval(
      () => {
        setSwitched(true);

        window.setTimeout(function () {
          setSwitched(false);
          setActive(!active);
          setDelayed(false);
        }, 500 / 2);
      },
      delayed ? randomDelay : randomDelay + 3000
    );

    return () => clearInterval(interval);
  }, [active, delayed]);

  if (!newsA || !newsB) return <div></div>;

  return (
    <div className={`transform ${switched ? 'animate-rotate' : ''}`}>
      <div className='transform-gpu'>
        <div className={`absolute left-0 top-0 w-full ${''}`}>
          {active ? Story(newsA, true) : Story(newsB, false)}
        </div>
      </div>
    </div>
  );
}
