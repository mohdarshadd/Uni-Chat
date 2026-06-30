const BAD_WORDS = [
  'fuck', 'shit', 'ass', 'bitch', 'damn', 'bastard', 'crap', 'dick',
  'piss', 'slut', 'whore', 'cock', 'cunt', 'douche', 'fag', 'nigger',
];

const BAD_WORDS_PATTERN = new RegExp(
  `\\b(${BAD_WORDS.join('|')})\\b`,
  'gi',
);

export function sanitize(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim();
}

export function filterProfanity(input: string): string {
  return input.replace(BAD_WORDS_PATTERN, (match) => {
    return match[0] + '*'.repeat(match.length - 1);
  });
}

export function cleanMessage(input: string): string {
  const sanitized = sanitize(input);
  return filterProfanity(sanitized);
}
