/* eslint-disable react-refresh/only-export-components */
import Link from 'next/link';
import { buildPageMetadata } from '@/lib/metadata';

export async function generateMetadata() {
  return buildPageMetadata('Page not found');
}

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-xl text-muted mb-8">Sorry, this page doesn't exist.</p>
      <Link href="/" className="inline-block px-6 py-2 bg-accent text-white rounded hover:opacity-90">
        Go Home
      </Link>
    </div>
  );
}
