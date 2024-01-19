export function getRandomGrey() {
  const letters = 'ABCDEF';
  let color = '#';
  const greyShade = Math.floor(Math.random() * 6);
  for (let i = 0; i < 6; i++) {
    color += letters[greyShade];
  }
  return color;
}
