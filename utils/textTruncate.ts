export function textTruncate(text: string, length: number) {
  let truncatedText = text.substring(0, length);
  const lastSpaceIndex = truncatedText.lastIndexOf(' ');

  const urlPattern = /(https?:\/\/[^\s]+)/g;
  const lastWord = truncatedText.substring(lastSpaceIndex).trim();
  if (urlPattern.test(lastWord)) {
    truncatedText = truncatedText.substring(0, lastSpaceIndex);
  }

  truncatedText += '...';

  return truncatedText;
}
