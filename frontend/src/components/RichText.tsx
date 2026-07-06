'use client';

/**
 * Renders Strapi rich text content: Markdown, Blocks (ProseMirror), or plain.
 * Handles images, headings, paragraphs, lists, blockquotes, code.
 * Supports [form:slug] shortcode for embedding form builder forms.
 * WCAG 2.2: Proper heading hierarchy, semantic HTML, image alt text.
 */

import React, { type ReactElement } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkBreaks from 'remark-breaks';
import { FormEmbed } from './FormEmbed';
import type { StrapiBlock } from '../types/strapi';
import './RichText.css';

/** Base URL for Strapi assets. In dev without NEXT_PUBLIC_STRAPI_URL, empty so proxy works. */
const STRAPI_BASE =
  process.env.NEXT_PUBLIC_STRAPI_URL ??
  (process.env.NODE_ENV === 'development' ? '' : 'http://localhost:1337');

function resolveImageUrl(url: string | undefined | null): string {
  if (!url?.trim()) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  const base = STRAPI_BASE.replace(/\/$/, '');
  return `${base}${url.startsWith('/') ? '' : '/'}${url}`;
}

function hasListItemContent(children: BlockChild[]): boolean {
  return children.some(
    (c) => c.type === 'list' || c.type === 'link' || (c.text !== undefined && c.text.trim() !== '')
  );
}

// Strapi block children can have nested structure
interface BlockChild {
  type: string;
  text?: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  code?: boolean;
  url?: string;
  format?: string;
  children?: BlockChild[];
}

const URL_RE = /https?:\/\/[^\s<>"'()[\]{}]+[^\s<>"'()[\]{}.,:;!?]/g;

function linkifyText(text: string, key: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let last = 0;
  URL_RE.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = URL_RE.exec(text)) !== null) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    parts.push(
      <a key={`${key}-u${match.index}`} href={match[0]} target="_blank" rel="noopener noreferrer">
        {match[0]}
      </a>
    );
    last = match.index + match[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts.length === 1 ? parts[0] : <>{parts}</>;
}

function renderInlineChildren(children: BlockChild[], keyPrefix: string, linkify = false): React.ReactNode[] {
  return children.map((child, i) => {
    const key = `${keyPrefix}-${i}`;
    if (child.type === 'link') {
      return (
        <a key={key} href={child.url ?? '#'}>
          {child.children ? renderInlineChildren(child.children, key, linkify) : child.text}
        </a>
      );
    }
    if (child.type === 'line-break') {
      return <br key={key} />;
    }
    const raw = child.text ?? '';
    let node: React.ReactNode = raw.includes('\n')
      ? raw.split('\n').map((part, j) => (
          <React.Fragment key={`${key}-lb-${j}`}>{j > 0 && <br />}{linkify ? linkifyText(part, `${key}-lb-${j}`) : part}</React.Fragment>
        ))
      : (linkify ? linkifyText(raw, key) : raw);
    if (child.code) node = <code key={key}>{node}</code>;
    if (child.bold) node = <strong key={key}>{node}</strong>;
    if (child.italic) node = <em key={key}>{node}</em>;
    if (child.underline) node = <u key={key}>{node}</u>;
    if (child.strikethrough) node = <s key={key}>{node}</s>;
    return <React.Fragment key={key}>{node}</React.Fragment>;
  });
}

function renderListItemChildren(children: BlockChild[], keyPrefix: string, linkify = false): React.ReactNode {
  const inlineChildren = children.filter((c) => c.type !== 'list');
  const nestedLists = children.filter((c) => c.type === 'list');
  return (
    <>
      {inlineChildren.length > 0 && renderInlineChildren(inlineChildren, keyPrefix, linkify)}
      {nestedLists.map((list, i) => {
        const NestedTag = list.format === 'ordered' ? 'ol' : 'ul';
        return (
          <NestedTag key={`${keyPrefix}-nested-${i}`}>
            {(list.children ?? []).filter((item) => item.children && hasListItemContent(item.children)).map((item, j) => (
              <li key={j}>
                {item.children ? renderListItemChildren(item.children, `${keyPrefix}-nested-${i}-li-${j}`, linkify) : null}
              </li>
            ))}
          </NestedTag>
        );
      })}
    </>
  );
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
  linkify?: boolean;
}

function renderBlocks(blocks: StrapiBlock[], linkify = false): (React.ReactElement | null)[] {
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
      const captionChildren = (block.children ?? []) as BlockChild[];
      const hasCaption = captionChildren.some(
        (c) => c.type === 'link' || (c.text && c.text.trim())
      );
      return (
        <figure key={key}>
          <img
            src={src}
            alt={img?.alternativeText ?? ''}
            width={img?.width ?? 800}
            height={img?.height ?? 600}
            loading="lazy"
          />
          {hasCaption && (
            <figcaption className="rich-text__image-caption">
              <svg className="rich-text__image-caption-icon" aria-hidden="true" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.333 10a3.333 3.333 0 0 0 5.034.385l2.5-2.5a3.334 3.334 0 0 0-4.714-4.714L9.742 4.58" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M11.667 10a3.333 3.333 0 0 0-5.034-.385l-2.5 2.5a3.333 3.333 0 0 0 4.714 4.714l1.408-1.408" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>{renderInlineChildren(captionChildren, `${key}-caption`, linkify)}</span>
            </figcaption>
          )}
        </figure>
      );
    }
    if (block.type === 'paragraph') {
      const children = (block.children ?? []) as BlockChild[];
      const plainText = children.map((c) => c.text ?? '').join('');
      const parts = plainText.split(/(\[form:([a-zA-Z0-9_-]+)\])/g);
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
      return <p key={key}>{renderInlineChildren(children, key, linkify)}</p>;
    }
    if (block.type === 'heading') {
      const level = (block.level as number) ?? 2;
      const children = (block.children ?? []) as BlockChild[];
      const HeadingTag = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'][
        Math.min(Math.max(level - 1, 0), 5)
      ] as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
      return <HeadingTag key={key}>{renderInlineChildren(children, key, linkify)}</HeadingTag>;
    }
    if (block.type === 'list') {
      const items = (block.children ?? []) as Array<StrapiBlock & { children?: BlockChild[]; format?: string }>;
      const ListTag = block.format === 'ordered' ? 'ol' : 'ul';
      return (
        <ListTag key={key}>
          {items.map((item, j) => {
            if (item.type === 'list') {
              const NestedTag = item.format === 'ordered' ? 'ol' : 'ul';
              const subItems = (item.children ?? []) as Array<StrapiBlock & { children?: BlockChild[] }>;
              return (
                <li key={j} style={{ listStyle: 'none', padding: 0 }}>
                  <NestedTag>
                    {subItems
                      .filter((sub) => sub.children && hasListItemContent(sub.children as BlockChild[]))
                      .map((sub, k) => (
                        <li key={k}>{sub.children ? renderListItemChildren(sub.children as BlockChild[], `${key}-nested-${j}-li-${k}`, linkify) : null}</li>
                      ))}
                  </NestedTag>
                </li>
              );
            }
            if (!item.children || !hasListItemContent(item.children as BlockChild[])) return null;
            return (
              <li key={j}>{item.children ? renderListItemChildren(item.children as BlockChild[], `${key}-li-${j}`, linkify) : null}</li>
            );
          }).filter(Boolean)}
        </ListTag>
      );
    }
    if (block.type === 'quote') {
      const children = (block.children ?? []) as BlockChild[];
      return (
        <blockquote key={key} cite="">
          {renderInlineChildren(children, key, linkify)}
        </blockquote>
      );
    }
    if (block.type === 'code') {
      const text = (block.children ?? []).map((c) => (c as BlockChild).text ?? '').join('');
      return (
        <pre key={key}>
          <code>{text}</code>
        </pre>
      );
    }
    return null;
  });
}

function preprocessMarkdown(md: string): string {
  return md
    .replace(/\^([^^]+)\^/g, '<sup>$1</sup>')
    .replace(/~([^~]+)~/g, '<sub>$1</sub>');
}

function getBlocksToRender(content: StrapiBlock[] | Record<string, unknown>): StrapiBlock[] {
  if (Array.isArray(content)) return content;
  const obj = content as { type?: string; children?: StrapiBlock[] };
  if (obj.type === 'doc' && Array.isArray(obj.children)) return obj.children;
  return [];
}


export function RichText({ content, className = '', linkify = false }: RichTextProps) {
  if (!content) return null;

  if (typeof content === 'string') {
    try {
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) {
        const blocks = getBlocksToRender(parsed);
        if (blocks.length > 0) {
          return (
            <div className={`rich-text ${className}`.trim()}>
              {renderBlocks(blocks, linkify).filter(Boolean)}
            </div>
          );
        }
      }
    } catch {
      // not JSON — fall through to markdown
    }
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
              remarkPlugins={[remarkBreaks]}
              rehypePlugins={[rehypeRaw]}
              components={{
                img: ({ src, alt, ...props }) => (
                  <img
                    src={resolveImageUrl(typeof src === 'string' ? src : undefined)}
                    alt={alt ?? ''}
                    width={800}
                    height={600}
                    loading="lazy"
                    {...props}
                  />
                ),
              }}
            >
              {preprocessMarkdown(parts[i])}
            </ReactMarkdown>
          );
        }
      }
      return (
        <div className={`rich-text ${className}`.trim()}>
          {elements}
        </div>
      );
    }

    return (
      <div className={`rich-text ${className}`.trim()}>
        <ReactMarkdown
          remarkPlugins={[remarkBreaks]}
          rehypePlugins={[rehypeRaw]}
          components={{
            img: ({ src, alt, ...props }) => (
              <img
                src={resolveImageUrl(typeof src === 'string' ? src : undefined)}
                alt={alt ?? ''}
                width={800}
                height={600}
                loading="lazy"
                className="max-w-full h-auto rounded-lg my-4"
                {...props}
              />
            ),
          }}
        >
          {preprocessMarkdown(content)}
        </ReactMarkdown>
      </div>
    );
  }

  const blocks = getBlocksToRender(content as StrapiBlock[] | Record<string, unknown>);
  if (blocks.length > 0) {
    return (
      <div className={`rich-text ${className}`.trim()}>
        {renderBlocks(blocks, linkify).filter(Boolean)}
      </div>
    );
  }

  return null;
}
