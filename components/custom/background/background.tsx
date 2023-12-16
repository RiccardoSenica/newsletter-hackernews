import { Tiles } from './components/tiles';

type BackgroundProps = {
  children: React.ReactNode;
};

export function Background({ children }: BackgroundProps) {
  return <Tiles>{children}</Tiles>;
}
