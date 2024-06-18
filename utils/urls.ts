export const getTopNews =
  'https://hacker-news.firebaseio.com/v0/topstories.json';

export function getSingleNews(id: number) {
  return `https://hacker-news.firebaseio.com/v0/item/${id}.json`;
}
