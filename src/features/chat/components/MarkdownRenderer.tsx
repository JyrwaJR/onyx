import Markdown from 'react-native-markdown-display';

const markdownStyles = {
  body: { fontSize: 15, lineHeight: 22, color: '#1F2937' },
  code_block: {
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 8,
    fontSize: 13,
    fontFamily: 'monospace',
  },
  fence: {
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 8,
    fontSize: 13,
    fontFamily: 'monospace',
  },
  code_inline: {
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 4,
    borderRadius: 4,
    fontSize: 13,
    fontFamily: 'monospace',
  },
  link: { color: '#4F46E5' },
  heading1: { fontSize: 22, fontWeight: 'bold' as const, marginTop: 12, marginBottom: 8 },
  heading2: { fontSize: 18, fontWeight: 'bold' as const, marginTop: 10, marginBottom: 6 },
  heading3: { fontSize: 16, fontWeight: 'bold' as const, marginTop: 8, marginBottom: 4 },
  paragraph: { marginTop: 0, marginBottom: 8 },
  bullet_list: { marginTop: 4, marginBottom: 4 },
  ordered_list: { marginTop: 4, marginBottom: 4 },
  blockquote: {
    borderLeftWidth: 3,
    borderLeftColor: '#D1D5DB',
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
 * Renders markdown content with styled code blocks and paragraphs.
 *
 * @param content - The markdown string to render.
 */
export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return <Markdown style={markdownStyles}>{content}</Markdown>;
}
