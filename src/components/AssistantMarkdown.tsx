import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function AssistantMarkdown({ children }: { children: string }) {
  return (
    <div className="assistant-markdown">
      <Markdown remarkPlugins={[remarkGfm]} skipHtml components={{
        a: ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>,
        img: ({ alt }) => <span>{alt}</span>,
        table: ({ children }) => <div className="assistant-table" role="region" aria-label="Tabela da resposta" tabIndex={0}><table>{children}</table></div>,
        pre: ({ children }) => <pre tabIndex={0} aria-label="Bloco de código">{children}</pre>,
      }}>{children}</Markdown>
    </div>
  );
}
