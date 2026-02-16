/**
 * 404 Not Found page
 */

import { Link } from 'react-router-dom';
import { DocumentTitle } from '../components/DocumentTitle';

export function NotFound() {
  return (
    <article>
      <DocumentTitle title="Page not found" />
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold mb-2">404</h1>
        <p className="text-xl text-muted mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-block px-6 py-3 bg-accent text-white font-medium rounded hover:bg-accent-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
        >
          Go to home
        </Link>
      </div>
    </article>
  );
}
