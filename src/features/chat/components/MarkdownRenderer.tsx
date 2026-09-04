import Markdown from 'react-native-markdown-display';

/**
 * Markdown styles following Claude design system.
 *
 * Uses warm cream tones for backgrounds, ink/dark colors for text,
 * and coral for links.
 */
const markdownStyles = {
  body: { fontSize: 15, lineHeight: 22, color: '#141413' },
  code_block: {
    backgroundColor: '#f5f0e8',
    padding: 12,
    borderRadius: 8,
    fontSize: 13,
    fontFamily: 'JetBrains Mono',
  },
  fence: {
    backgroundColor: '#f5f0e8',
    padding: 12,
    borderRadius: 8,
    fontSize: 13,
    fontFamily: 'JetBrains Mono',
  },
  code_inline: {
    backgroundColor: '#e6dfd8',
    paddingHorizontal: 4,
    borderRadius: 4,
    fontSize: 13,
    fontFamily: 'JetBrains Mono',
  },
  link: { color: '#cc785c' },
  heading1: { fontSize: 22, fontWeight: 'bold' as const, marginTop: 12, marginBottom: 8 },
  heading2: { fontSize: 18, fontWeight: 'bold' as const, marginTop: 10, marginBottom: 6 },
  heading3: { fontSize: 16, fontWeight: 'bold' as const, marginTop: 8, marginBottom: 4 },
  paragraph: { marginTop: 0, marginBottom: 8 },
  bullet_list: { marginTop: 4, marginBottom: 4 },
  ordered_list: { marginTop: 4, marginBottom: 4 },
  blockquote: {
    borderLeftWidth: 3,
    borderLeftColor: '#e6dfd8',
    paddingLeft: 12,
    marginLeft: 0,
    marginTop: 4,
    marginBottom: 4,
  },
};

interface MarkdownRendererProps {
  content: string;
}

/**
 * Renders markdown content with Claude design system styling.
 *
 * Uses warm cream backgrounds for code blocks and coral for links.
 *
 * @param content - The markdown string to render.
 */
export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return <Markdown style={markdownStyles}>{content}</Markdown>;
}
