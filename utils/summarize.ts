import { message } from './anthropic';
import { NewsType } from './validationSchemas';

export async function summirize(news: NewsType[]) {
  const newsInput = news
    .map(n => `TITLE: ${n.title}, CONTENT: ${n.text}, LINK: ${n.url}`)
    .join('\n\n');

  const promptSetup =
    "You are a tech journalist with a technology degree and background. Summarize the following list of posts from an online forum as a TL;DR (Too Long; Didn't Read) summary. Your summary should:\n\n1. Be 300-400 words long (not counting the urls).\n\n2. Consist multiple phrases in one single paragraph, combining related news items where possible.\n\n3. Highlight the 2-3 most significant or impactful news items.\n\n4. Provide context within broader tech trends or developments.\n\n5. Use a tone that is informative and slightly enthusiastic, aimed at tech-savvy general readers, careful at not repeating the same phrasing and do not sound too proseic.\n\n6. Group news items by themes or technology areas if applicable.\n\n7. Be formatted for HTML use, with links incorporated as follows and including at most 3-4 words: <a href='[LINK]'>[linked text]</a>.\n\n8. Each news that is mentioned needs to incorporare its own url link, if it exists.\n\nFocus on conveying the key points and their potential impact on the tech landscape. Your response should consist of the summary only.\n\nThe news items are structured as follows:\n\nTITLE: <title>\n\nCONTENT: <content>\n\nLINK: <link>\n\nPlease summarize the following news:";
  try {
    const response = await message(promptSetup + newsInput);

    const summary = response.content[0] as { text: string };

    return summary.text;
  } catch (error) {
    console.error(error);
    return '';
  }
}
