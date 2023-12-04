export const topNews = 'https://hacker-news.firebaseio.com/v0/topstories.json';
export const singleNews = (id: number) =>
  `https://hacker-news.firebaseio.com/v0/item/${id}.json`;
