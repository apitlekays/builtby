// A paragraph's text with its [label](href) links split out, so content can carry links as plain strings.
export interface InlineSegment {
  text: string;
  href?: string;
}

export function inlineSegments(text: string): InlineSegment[] {
  const segments: InlineSegment[] = [];
  const link = /\[([^\]]+)\]\(([^)\s]+)\)/g;
  let last = 0;
  for (const match of text.matchAll(link)) {
    if (match.index > last) segments.push({ text: text.slice(last, match.index) });
    segments.push({ text: match[1], href: match[2] });
    last = match.index + match[0].length;
  }
  if (last < text.length) segments.push({ text: text.slice(last) });
  return segments;
}
