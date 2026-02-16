/**
 * Pagination controls for blog and press listing pages.
 * Renders prev/next and numbered page links.
 */

import { Link } from 'react-router-dom';

export interface PaginationMeta {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

interface PaginationProps {
  meta: PaginationMeta;
  basePath: string;
  searchParams?: Record<string, string>;
  /** URL param name for page (default: page) */
  pageParam?: string;
}

export function Pagination({
  meta,
  basePath,
  searchParams = {},
  pageParam = 'page',
}: PaginationProps) {
  const { page, pageCount } = meta;
  if (pageCount <= 1) return null;

  const query = new URLSearchParams(searchParams);

  const href = (p: number) => {
    const q = new URLSearchParams(query);
    if (p === 1) q.delete(pageParam);
    else q.set(pageParam, String(p));
    const qs = q.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  };

  return (
    <nav aria-label="Pagination" className="mt-8 flex flex-wrap items-center justify-center gap-2">
      {page > 1 ? (
        <Link
          to={href(page - 1)}
          className="inline-flex items-center px-3 py-2 rounded text-sm bg-border text-fg hover:bg-accent/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
        >
          Previous
        </Link>
      ) : (
        <span className="inline-flex items-center px-3 py-2 rounded text-sm bg-border text-muted" aria-disabled>
          Previous
        </span>
      )}

      <ol className="flex flex-wrap gap-1 list-none m-0 p-0">
        {Array.from({ length: pageCount }, (_, i) => i + 1).map((p) => (
          <li key={p}>
            {p === page ? (
              <span
                className="inline-flex items-center justify-center min-w-9 px-3 py-2 rounded text-sm bg-accent text-white font-medium"
                aria-current="page"
              >
                {p}
              </span>
            ) : (
              <Link
                to={href(p)}
                className="inline-flex items-center justify-center min-w-9 px-3 py-2 rounded text-sm bg-border text-fg hover:bg-accent/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
              >
                {p}
              </Link>
            )}
          </li>
        ))}
      </ol>

      {page < pageCount ? (
        <Link
          to={href(page + 1)}
          className="inline-flex items-center px-3 py-2 rounded text-sm bg-border text-fg hover:bg-accent/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
        >
          Next
        </Link>
      ) : (
        <span className="inline-flex items-center px-3 py-2 rounded text-sm bg-border text-muted" aria-disabled>
          Next
        </span>
      )}
    </nav>
  );
}
