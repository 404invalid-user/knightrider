export default function parseEmoji(input: string | null): string | null {

  if (input === null || input == ' ' || input === ' ') return null;
  const customEmojiMatch = input.match(/^<:.*:(\d+)>$/);
  if (customEmojiMatch) return customEmojiMatch[1];

  const unicodeEmojiRegex = /^[\p{Emoji_Presentation}\p{Emoji}\uFE0F]+$/u;
  if (unicodeEmojiRegex.test(input)) return input;

  return null;
}