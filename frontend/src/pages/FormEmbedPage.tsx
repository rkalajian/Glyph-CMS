/**
 * Standalone form embed page – minimal layout for iframe embedding.
 * Use the embed code from the form in Strapi to add this form to any page or post.
 */

import { useParams } from 'react-router-dom';
import { FormEmbed } from '../components/FormEmbed';

export function FormEmbedPage() {
  const { slug } = useParams<{ slug: string }>();

  if (!slug) {
    return (
      <div className="min-h-[200px] flex items-center justify-center p-6">
        <p className="text-muted">Form not specified.</p>
      </div>
    );
  }

  return (
    <div className="min-h-[200px] p-6">
      <FormEmbed slug={slug} />
    </div>
  );
}
