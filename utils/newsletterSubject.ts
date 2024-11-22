function extractMainTopic(summary: string): string {
  const firstParaMatch = summary.match(/<p>(.*?)<\/p>/);
  if (!firstParaMatch) return 'tech updates';

  const firstPara = firstParaMatch[1];

  const cleanText = firstPara
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .replace(/[,.]+/g, ' ')
    .trim();

  const techAreas = [
    {
      name: 'AI',
      pattern: /\b(AI|artificial intelligence|machine learning|ML|GPT|LLM)\b/i,
      preserveCase: true
    },
    {
      name: 'security',
      pattern: /\b(security|cyber|hack|privacy|breach)\b/i
    },
    {
      name: 'Web3',
      pattern: /\b(blockchain|crypto|web3|NFT|token|ethereum|bitcoin)\b/i,
      preserveCase: true
    },
    {
      name: 'cloud',
      pattern: /\b(cloud|AWS|Azure|serverless|containerization|kubernetes)\b/i
    },
    {
      name: 'mobile',
      pattern: /\b(mobile|iOS|Android|app|smartphone)\b/i
    },
    {
      name: 'development',
      pattern: /\b(developer|programming|code|software|development)\b/i
    }
  ];

  for (const area of techAreas) {
    if (area.pattern.test(cleanText)) {
      return area.preserveCase ? area.name : area.name.toLowerCase();
    }
  }

  const words = cleanText
    .split(' ')
    .filter(
      word =>
        word.length > 2 &&
        !/^(and|the|in|of|at|by|for)$/i.test(word) &&
        !/[,.]/.test(word)
    )
    .slice(0, 2)
    .join(' ');

  return words.toLowerCase() || 'tech updates';
}

export default function newsletterSubject(summary: string) {
  const topic = extractMainTopic(summary);
  const title =
    topic === 'tech updates'
      ? 'Today in tech updates'
      : `Today in tech: ${topic}`;

  return title;
}
