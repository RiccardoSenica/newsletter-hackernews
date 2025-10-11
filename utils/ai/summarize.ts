import { getMessage } from './client';
import { NewsType } from '../validationSchemas';
import { NewsletterTool, newsletterTool } from './tool';

export async function summirize(news: NewsType[]) {
  const newsInput = news
    .map(n => `TITLE: ${n.title}, CONTENT: ${n.text}, LINK: ${n.url}`)
    .join('\n\n');

  const promptSetup =
    "You are a tech journalist with a technology degree and background. Create a tech newsletter from the following list of posts from an online forum. Use the NewsletterTool to structure your response with the following requirements:\n\n1. TITLE:\n- Create a title that is 40-50 characters long\n- Capture the most significant themes or developments\n- Use engaging but professional language\n\n2. CONTENT:\nSummarize the following list of posts from an online forum as a TL;DR (Too Long; Didn't Read) summary. Your summary should:\n1. Be 300-400 words long (not counting the urls)\n2. Structure the content in 2-3 short paragraphs, with each paragraph focusing on a specific theme or technology area\n3. Start with the 2-3 most significant or impactful news items in the first paragraph\n4. Use HTML paragraph tags (<p>) to separate paragraphs for better readability\n5. Use a tone that is informative and slightly enthusiastic, aimed at tech-savvy general readers\n6. Incorporate links as follows, including at most 3-4 words: <a href='[LINK]' target='_blank' rel='noopener noreferrer'>[linked text]</a>\n7. Each mentioned news item must include its own url link\n\n3. FOCUS:\nEnd with a forward-looking assessment of the key developments and trends emerging from these news items. Consider their potential impact on the tech landscape and any implications for future developments. Keep this section concise while maintaining an analytical perspective that helps readers understand what to watch for in the coming weeks and months.\n\nUse the NewsletterTool to provide your response with these three components.\n\nThe news items are structured as follows:\n\nTITLE: <title>\nCONTENT: <content>\nLINK: <link>\n\nPlease analyze and summarize the following news:";

  try {
    const { title, content, focus } = await getMessage<NewsletterTool>(
      promptSetup + newsInput,
      newsletterTool
    );

    return {
      title,
      content,
      focus
    };
  } catch (error) {
    console.error('Error in summarize:', error);
    throw Error(JSON.stringify(error));
  }
}
