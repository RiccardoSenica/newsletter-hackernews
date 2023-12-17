'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { z } from 'zod';
import { NewsSchema } from '../../../../utils/types';
import { Card } from './card';

type TilesProps = {
  children: React.ReactNode;
};

export const Tiles = ({ children }: TilesProps) => {
  const pathname = usePathname();
  const [windowSize, setWindowSize] = useState<{
    width: number;
    height: number;
  }>({
    width: 0,
    height: 0
  });
  const [news, setNews] = useState<z.infer<typeof NewsSchema>[]>();

  const baseWidth = 40;
  const baseHeight = 40;

  useEffect(() => {
    async function getNews() {
      const news = await fetch('/api/news').then(res => res.json());

      if (news) {
        setNews(news);
      }
    }

    if (!news) {
      getNews();
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    }

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [setWindowSize, news]);

  if (pathname === '/maintenance') return <div>{children}</div>;

  function renderTile(key: number) {
    if (!news) return <div key={key}></div>;

    const randomA = Math.floor(Math.random() * news?.length);
    const randomB = Math.floor(
      Math.random() * news?.filter((_, index) => index !== randomA)?.length
    );

    return (
      <div key={key} className={`m-1 h-${baseHeight} w-${baseWidth}`}>
        <Card
          newsA={news[randomA]}
          newsB={news[randomB]}
          width={baseHeight}
          height={baseHeight}
        />
      </div>
    );
  }

  function renderRow(columns: number, key: number) {
    return (
      <div key={key} className='flex justify-between'>
        {Array.from({ length: columns }).map((_, index) => renderTile(index))}
      </div>
    );
  }

  function renderGrid() {
    const columns = Math.ceil(windowSize.width / (baseWidth * 4));
    const rows = Math.ceil(windowSize.height / (baseHeight * 4));

    return (
      <div>
        <div className='flex flex-col justify-between'>
          {Array.from({ length: rows }).map((_, index) =>
            renderRow(columns, index)
          )}
        </div>
        <div className='absolute inset-0 flex items-center justify-center'>
          {children}
        </div>
      </div>
    );
  }

  return <div className='flex flex-col justify-between'>{renderGrid()}</div>;
};
