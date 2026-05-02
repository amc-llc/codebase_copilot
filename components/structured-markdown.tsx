'use client';

import { Fragment, ReactNode } from 'react';

interface StructuredMarkdownProps {
  content: string;
  className?: string;
}

interface ParagraphBlock {
  type: 'paragraph';
  text: string;
}

interface HeadingBlock {
  type: 'heading';
  level: 1 | 2 | 3;
  text: string;
}

interface ListBlock {
  type: 'list';
  ordered: boolean;
  items: string[];
}

interface CodeBlock {
  type: 'code';
  language?: string;
  code: string;
}

interface QuoteBlock {
  type: 'quote';
  text: string;
}

type MarkdownBlock = ParagraphBlock | HeadingBlock | ListBlock | CodeBlock | QuoteBlock;

function renderInline(text: string): ReactNode[] {
  const matches = text.match(/(`[^`]+`|\*\*[^*]+\*\*)/g);
  if (!matches) {
    return [text];
  }

  const nodes: ReactNode[] = [];
  let cursor = 0;

  for (const match of matches) {
    const start = text.indexOf(match, cursor);
    if (start > cursor) {
      nodes.push(text.slice(cursor, start));
    }

    if (match.startsWith('`')) {
      nodes.push(
        <code
          key={`${start}-${match}`}
          className="rounded bg-gray-100 px-1.5 py-0.5 text-[0.9em] text-gray-900 dark:bg-gray-800 dark:text-gray-100"
        >
          {match.slice(1, -1)}
        </code>
      );
    } else {
      nodes.push(
        <strong key={`${start}-${match}`} className="font-semibold text-gray-900 dark:text-white">
          {match.slice(2, -2)}
        </strong>
      );
    }

    cursor = start + match.length;
  }

  if (cursor < text.length) {
    nodes.push(text.slice(cursor));
  }

  return nodes;
}

function parseMarkdown(content: string): MarkdownBlock[] {
  const lines = content.replace(/\r\n/g, '\n').split('\n');
  const blocks: MarkdownBlock[] = [];
  let paragraphLines: string[] = [];
  let listItems: string[] = [];
  let listOrdered = false;
  let quoteLines: string[] = [];
  let inCodeBlock = false;
  let codeLanguage = '';
  let codeLines: string[] = [];

  const flushParagraph = () => {
    if (paragraphLines.length === 0) {
      return;
    }

    blocks.push({
      type: 'paragraph',
      text: paragraphLines.join(' ').trim(),
    });
    paragraphLines = [];
  };

  const flushList = () => {
    if (listItems.length === 0) {
      return;
    }

    blocks.push({
      type: 'list',
      ordered: listOrdered,
      items: [...listItems],
    });
    listItems = [];
  };

  const flushQuote = () => {
    if (quoteLines.length === 0) {
      return;
    }

    blocks.push({
      type: 'quote',
      text: quoteLines.join(' ').trim(),
    });
    quoteLines = [];
  };

  const flushCode = () => {
    if (codeLines.length === 0) {
      return;
    }

    blocks.push({
      type: 'code',
      language: codeLanguage || undefined,
      code: codeLines.join('\n').trimEnd(),
    });
    codeLines = [];
    codeLanguage = '';
  };

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();
    const trimmed = line.trim();

    if (trimmed.startsWith('```')) {
      flushParagraph();
      flushList();
      flushQuote();

      if (inCodeBlock) {
        flushCode();
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
        codeLanguage = trimmed.slice(3).trim();
      }
      continue;
    }

    if (inCodeBlock) {
      codeLines.push(rawLine);
      continue;
    }

    if (trimmed === '') {
      flushParagraph();
      flushList();
      flushQuote();
      continue;
    }

    const headingMatch = trimmed.match(/^(#{1,3})\s+(.*)$/);
    if (headingMatch) {
      flushParagraph();
      flushList();
      flushQuote();
      blocks.push({
        type: 'heading',
        level: headingMatch[1].length as 1 | 2 | 3,
        text: headingMatch[2].trim(),
      });
      continue;
    }

    const quoteMatch = trimmed.match(/^>\s?(.*)$/);
    if (quoteMatch) {
      flushParagraph();
      flushList();
      quoteLines.push(quoteMatch[1]);
      continue;
    }

    const orderedMatch = trimmed.match(/^\d+\.\s+(.*)$/);
    if (orderedMatch) {
      flushParagraph();
      flushQuote();
      if (listItems.length > 0 && !listOrdered) {
        flushList();
      }
      listOrdered = true;
      listItems.push(orderedMatch[1].trim());
      continue;
    }

    const unorderedMatch = trimmed.match(/^[-*+]\s+(.*)$/);
    if (unorderedMatch) {
      flushParagraph();
      flushQuote();
      if (listItems.length > 0 && listOrdered) {
        flushList();
      }
      listOrdered = false;
      listItems.push(unorderedMatch[1].trim());
      continue;
    }

    flushList();
    flushQuote();
    paragraphLines.push(trimmed);
  }

  flushParagraph();
  flushList();
  flushQuote();
  if (inCodeBlock) {
    flushCode();
  }

  return blocks;
}

export function StructuredMarkdown({ content, className }: StructuredMarkdownProps) {
  const blocks = parseMarkdown(content);

  return (
    <div className={className}>
      {blocks.map((block, index) => {
        if (block.type === 'heading') {
          const HeadingTag = block.level === 1 ? 'h2' : block.level === 2 ? 'h3' : 'h4';
          const headingClassName =
            block.level === 1
              ? 'text-2xl font-semibold text-gray-900 dark:text-white'
              : block.level === 2
                ? 'text-xl font-semibold text-gray-900 dark:text-white'
                : 'text-base font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-200';

          return (
            <HeadingTag key={`${block.type}-${index}`} className={headingClassName}>
              {block.text}
            </HeadingTag>
          );
        }

        if (block.type === 'paragraph') {
          return (
            <p
              key={`${block.type}-${index}`}
              className="leading-7 text-gray-700 dark:text-gray-300"
            >
              {renderInline(block.text).map((node, nodeIndex) => (
                <Fragment key={`${index}-${nodeIndex}`}>{node}</Fragment>
              ))}
            </p>
          );
        }

        if (block.type === 'list') {
          const ListTag = block.ordered ? 'ol' : 'ul';
          return (
            <ListTag
              key={`${block.type}-${index}`}
              className={
                block.ordered
                  ? 'ml-5 list-decimal space-y-2 text-gray-700 dark:text-gray-300'
                  : 'ml-5 list-disc space-y-2 text-gray-700 dark:text-gray-300'
              }
            >
              {block.items.map((item, itemIndex) => (
                <li key={`${index}-${itemIndex}`}>
                  {renderInline(item).map((node, nodeIndex) => (
                    <Fragment key={`${itemIndex}-${nodeIndex}`}>{node}</Fragment>
                  ))}
                </li>
              ))}
            </ListTag>
          );
        }

        if (block.type === 'quote') {
          return (
            <blockquote
              key={`${block.type}-${index}`}
              className="border-l-4 border-blue-300 bg-blue-50/70 px-4 py-3 italic text-gray-700 dark:border-blue-700 dark:bg-blue-900/20 dark:text-gray-300"
            >
              {renderInline(block.text).map((node, nodeIndex) => (
                <Fragment key={`${index}-${nodeIndex}`}>{node}</Fragment>
              ))}
            </blockquote>
          );
        }

        return (
          <pre
            key={`${block.type}-${index}`}
            className="overflow-x-auto rounded-xl bg-gray-950 p-4 text-sm text-gray-100"
          >
            {block.language && (
              <div className="mb-3 text-xs uppercase tracking-wide text-gray-400">
                {block.language}
              </div>
            )}
            <code>{block.code}</code>
          </pre>
        );
      })}
    </div>
  );
}
