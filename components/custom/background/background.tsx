import { Tiles } from './tile/tiles';

type BackgroundProps = {
  children: React.ReactNode;
};

export function Background({ children }: BackgroundProps) {
  return <Tiles>{children}</Tiles>;
}
