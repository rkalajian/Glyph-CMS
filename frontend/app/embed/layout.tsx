/* eslint-disable react-refresh/only-export-components */
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Form',
};

export default function EmbedLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
