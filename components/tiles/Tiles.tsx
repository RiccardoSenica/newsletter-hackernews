'use client';

import { NewsTileType } from '@utils/validationSchemas';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { Tile } from './components/Tile';
import axios from 'axios';

interface TilesProps {
  children: React.ReactNode;
}

export const Tiles = ({ children }: TilesProps) => {
  const pathname = usePathname();
  const [windowSize, setWindowSize] = useState<{
    width: number;
    height: number;
  }>({
    width: 0,
    height: 0
  });
  const [news, setNews] = useState<NewsTileType[]>();

  useEffect(() => {
    async function getNews() {
      try {
        const { data: news } = await axios.get<NewsTileType[]>('/api/news');
        setNews(news);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error(
            'Failed to fetch news:',
            error.response?.data || error.message
          );
        } else {
          console.error('Failed to fetch news:', error);
        }
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
  }, [news]);

  const renderTile = useCallback(
    (key: number) => {
      if (!news) return <div key={key}></div>;

      const randomA = Math.floor(Math.random() * news?.length);
      const randomB = Math.floor(
        Math.random() * news?.filter((_, index) => index !== randomA)?.length
      );

      return (
        <div key={key} className={`m-1 h-40 w-40`}>
          <Tile newsA={news[randomA]} newsB={news[randomB]} />
        </div>
      );
    },
    [news]
  );

  const renderRow = useCallback(
    (columns: number, key: number) => {
      return (
        <div key={key} className='flex justify-between'>
          {Array.from({ length: columns }).map((_, index) => renderTile(index))}
        </div>
      );
    },
    [renderTile]
  );

  const renderGrid = useCallback(() => {
    const columns = Math.ceil(windowSize.width / (40 * 4));
    const rows = Math.ceil(windowSize.height / (40 * 4));

    return (
      <div>
        <div className='-ml-12 -mt-10 flex flex-col justify-between'>
          {Array.from({ length: rows }).map((_, index) =>
            renderRow(columns, index)
          )}
        </div>
        <div className='absolute inset-0 flex items-center justify-center'>
          {children}
        </div>
      </div>
    );
  }, [children, renderRow, windowSize]);

  if (pathname === '/maintenance') return <div>{children}</div>;

  return <div className='flex h-[100vh] overflow-hidden'>{renderGrid()}</div>;
};
