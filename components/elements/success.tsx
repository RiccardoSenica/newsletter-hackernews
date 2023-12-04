import { HomeLink } from './homeLink';

export function SuccessComponent(message: string) {
  return (
    <div>
      <h1>Success!</h1>
      <h3>{message}</h3>
      <HomeLink />
    </div>
  );
}
