/**
 * Renders Strapi rich text content: Markdown, Blocks (ProseMirror), or plain.
 * Handles images, headings, paragraphs, lists, blockquotes, code.
 * Supports [form:slug] shortcode for embedding form builder forms.
 * WCAG 2.2: Proper heading hierarchy, semantic HTML, image alt text.
 */

import React, { type ReactElement } from 'react';
import ReactMarkdown from 'react-markdown';
import { FormEmbed } from './FormEmbed';
import type { StrapiBlock } from '../types/strapi';

/** Base URL for Strapi assets. In dev without VITE_STRAPI_URL, empty so proxy works. */
const STRAPI_BASE =
  import.meta.env.VITE_STRAPI_URL ??
  (import.meta.env.DEV ? '' : 'http://localhost:1337');

function resolveImageUrl(url: string | undefined | null): string {
  if (!url?.trim()) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  const base = STRAPI_BASE.replace(/\/$/, '');
  return `${base}${url.startsWith('/') ? '' : '/'}${url}`;
}

// Strapi block children can have nested structure
interface BlockChild {
  type: string;
  text?: string;
  children?: BlockChild[];
}

// Strapi image block image object
interface BlockImage {
  url?: string | null;
  alternativeText?: string | null;
  width?: number;
  height?: number;
}

interface RichTextProps {
  content: string | StrapiBlock[] | null | undefined;
  className?: string;
}

function renderBlocks(blocks: StrapiBlock[]): (React.ReactElement | null)[] {
  return blocks.map((block, i) => {
    const key = `block-${i}`;
    if (block.type === 'form') {
      const formSlug = (block as { attrs?: { formSlug?: string } }).attrs?.formSlug;
      if (formSlug) {
        return (
          <div key={key} className="my-6">
            <FormEmbed slug={formSlug} />
          </div>
        );
      }
      return null;
    }
    if (block.type === 'image') {
      const img = block.image as BlockImage | undefined;
      const src = resolveImageUrl(img?.url);
      if (!src) return null;
      return (
        <figure key={key} className="my-4">
          <img
            src={src}
            alt={img?.alternativeText ?? ''}
            width={img?.width}
            height={img?.height}
            className="max-w-full h-auto rounded-lg"
            loading="lazy"
          />
        </figure>
      );
    }
    if (block.type === 'paragraph') {
      const text = block.children?.map((c) => c.text ?? '').join('') ?? '';
      const parts = text.split(/(\[form:([a-zA-Z0-9_-]+)\])/g);
      if (parts.length > 1) {
        const els: React.ReactNode[] = [];
        let buf = '';
        for (let i = 0; i < parts.length; i++) {
          if (i % 3 === 1 && parts[i + 1]) {
            if (buf) els.push(<p key={`${key}-p-${i}`}>{buf}</p>);
            buf = '';
            els.push(
              <div key={`${key}-form-${i}`} className="my-6">
                <FormEmbed slug={parts[i + 1]} />
              </div>
            );
            i++;
          } else if (parts[i]) {
            buf += parts[i];
          }
        }
        if (buf) els.push(<p key={`${key}-p-end`}>{buf}</p>);
        return <React.Fragment key={key}>{els}</React.Fragment>;
      }
      return <p key={key}>{text}</p>;
    }
    if (block.type === 'heading') {
      const level = (block.level as number) ?? 2;
      const text = block.children?.map((c) => c.text ?? '').join('') ?? '';
      const HeadingTag = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'][
        Math.min(Math.max(level - 1, 0), 5)
      ] as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
      return <HeadingTag key={key}>{text}</HeadingTag>;
    }
    if (block.type === 'list') {
      const items = (block.children ?? []) as Array<StrapiBlock & { children?: BlockChild[] }>;
      const ListTag = block.format === 'ordered' ? 'ol' : 'ul';
      return (
        <ListTag key={key}>
          {items.map((item, j) => (
            <li key={j}>{item.children?.map((c) => c.text ?? '').join('')}</li>
          ))}
        </ListTag>
      );
    }
    if (block.type === 'quote') {
      const text = block.children?.map((c) => c.text ?? '').join('') ?? '';
      return (
        <blockquote key={key} cite="">
          {text}
        </blockquote>
      );
    }
    if (block.type === 'code') {
      const text = block.children?.map((c) => c.text ?? '').join('') ?? '';
      return (
        <pre key={key}>
          <code>{text}</code>
        </pre>
      );
    }
    return null;
  });
}

function getBlocksToRender(content: StrapiBlock[] | Record<string, unknown>): StrapiBlock[] {
  if (Array.isArray(content)) return content;
  const obj = content as { type?: string; children?: StrapiBlock[] };
  if (obj.type === 'doc' && Array.isArray(obj.children)) return obj.children;
  return [];
}

/** Prose styles for Markdown: paragraphs, headings, blockquotes, code, images. */
const PROSE_CLASSES = [
  'prose prose-neutral dark:prose-invert max-w-none',
  '[&_p]:mb-4 [&_p:last-child]:mb-0',
  '[&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-lg [&_img]:my-4',
  '[&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mt-6',
  '[&_blockquote]:border-l-4 [&_blockquote]:border-neutral-300 [&_blockquote]:pl-4 [&_blockquote]:italic dark:[&_blockquote]:border-neutral-600',
  '[&_pre]:p-4 [&_pre]:bg-neutral-100 [&_pre]:dark:bg-neutral-800 [&_pre]:rounded overflow-x-auto',
].join(' ');

/** Prose styles for Blocks (same visual result as Markdown). */
const BLOCKS_CLASSES = [
  'space-y-5',
  '[&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mt-6',
  '[&_blockquote]:border-l-4 [&_blockquote]:pl-4 [&_blockquote]:italic',
  '[&_pre]:p-4 [&_pre]:bg-neutral-100 [&_pre]:dark:bg-neutral-800 [&_pre]:rounded overflow-x-auto',
  '[&_figure]:my-4',
].join(' ');

export function RichText({ content, className = '' }: RichTextProps) {
  if (!content) return null;

  if (typeof content === 'string') {
    // Parse [form:slug] shortcodes for inline form embedding
    const parts = content.split(/(\[form:([a-zA-Z0-9_-]+)\])/g);
    const hasFormShortcode = parts.length > 1;
    if (hasFormShortcode) {
      const elements: ReactElement[] = [];
      for (let i = 0; i < parts.length; i++) {
        if (i % 3 === 1 && parts[i + 1]) {
          elements.push(
            <div key={`form-${i}`} className="my-6">
              <FormEmbed slug={parts[i + 1]} />
            </div>
          );
          i++; // skip slug part
        } else if (parts[i]) {
          elements.push(
            <ReactMarkdown
              key={i}
              components={{
                img: ({ src, alt, ...props }) => (
                  <img
                    src={resolveImageUrl(src ?? undefined)}
                    alt={alt ?? ''}
                    loading="lazy"
                    className="max-w-full h-auto rounded-lg my-4"
                    {...props}
                  />
                ),
              }}
            >
              {parts[i]}
            </ReactMarkdown>
          );
        }
      }
      return (
        <div className={`${PROSE_CLASSES} ${className}`.trim()}>
          {elements}
        </div>
      );
    }

    return (
      <div className={`${PROSE_CLASSES} ${className}`.trim()}>
        <ReactMarkdown
          components={{
            img: ({ src, alt, ...props }) => (
              <img
                src={resolveImageUrl(src ?? undefined)}
                alt={alt ?? ''}
                loading="lazy"
                className="max-w-full h-auto rounded-lg my-4"
                {...props}
              />
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    );
  }

  const blocks = getBlocksToRender(content as StrapiBlock[] | Record<string, unknown>);
  if (blocks.length > 0) {
    return (
      <div className={`${BLOCKS_CLASSES} ${className}`.trim()}>
        {renderBlocks(blocks).filter(Boolean)}
      </div>
    );
  }

  return null;
}
