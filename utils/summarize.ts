import { getMessage } from './anthropicClient';
import { NewsType } from './validationSchemas';

export async function summirize(news: NewsType[]) {
  const newsInput = news
    .map(n => `TITLE: ${n.title}, CONTENT: ${n.text}, LINK: ${n.url}`)
    .join('\n\n');

  const promptSetup =
    'You are a tech journalist with a technology degree and background. Summarize the following list of posts from an online forum as a TL;DR (Too Long; Didn&apos;t Read) summary. Your summary should:\n\n1. Be 300-400 words long (not counting the urls).\n\n2. Structure the content in 2-3 short paragraphs, with each paragraph focusing on a specific theme or technology area.\n\n3. Start with the 2-3 most significant or impactful news items in the first paragraph.\n\n4. Use HTML paragraph tags (<p>) to separate paragraphs for better readability.\n\n5. Use a tone that is informative and slightly enthusiastic, aimed at tech-savvy general readers.\n\n6. Incorporate links as follows, including at most 3-4 words: <a href=&apos;[LINK]&apos; target=&apos;_blank&apos; rel=&apos;noopener noreferrer&apos;>[linked text]</a>.\n\n7. Each mentioned news item must include its own url link.\n\n8. End with a section wrapped in a div with inline styles: <div style=&apos;margin-top: 24px; padding: 20px; background: #F8FAFC; border-left: 3px solid #386FA4; border-radius: 4px;&apos;>. Inside this div, start with an <h3 style=&apos;margin: 0 0 12px 0; color: #386FA4; font-size: 18px; font-weight: 600;&apos;>What to Watch</h3> followed by a paragraph highlighting emerging trends or developments to follow.</div>\n\nFocus on conveying the key points and their potential impact on the tech landscape. Your response should consist of the summary only.\n\nThe news items are structured as follows:\n\nTITLE: <title>\nCONTENT: <content>\nLINK: <link>\n\nPlease summarize the following news:';
  try {
    const response = await getMessage(promptSetup + newsInput);

    const summary = response.content[0] as { text: string };

    return summary.text;
  } catch (error) {
    console.error(error);
    return '';
  }
}
