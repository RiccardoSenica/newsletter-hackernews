export const topNews = 'https://hacker-news.firebaseio.com/v0/topstories.json';
export function singleNews(id: number) {
  return `https://hacker-news.firebaseio.com/v0/item/${id}.json`;
}
