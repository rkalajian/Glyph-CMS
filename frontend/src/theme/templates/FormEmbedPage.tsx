import { FormEmbed } from '../../components/FormEmbed';

interface FormEmbedPageProps {
  slug: string;
}

export function FormEmbedPage({ slug }: FormEmbedPageProps) {
  return (
    <div className="min-h-[200px] p-6">
      <FormEmbed slug={slug} />
    </div>
  );
}
