import { FormEmbed } from '../FormEmbed';
import './ContactFormBlock.css';
import type { StrapiBlockContactForm } from '../../types/strapi';
import { getThemeOptions } from '../../lib/strapi';

export async function ContactFormBlock({ heading, description, form, mapEmbedUrl }: StrapiBlockContactForm) {
  const themeOptions = await getThemeOptions();
  const recaptchaSiteKey = themeOptions?.recaptchaSiteKey ?? null;
  const decoded = mapEmbedUrl?.replace(/&#(\d+);/g, (_, code: string) => String.fromCharCode(Number(code)));
  const safeMapUrl = decoded && /^https:\/\/(www\.)?google\.com\/maps\/embed/.test(decoded)
    ? decoded
    : null;

  return (
    <section className="contact-form-block">
      <div className="contact-form-block__inner">
        <div className="contact-form-block__form-col">
          {heading && <h2 className="contact-form-block__heading">{heading}</h2>}
          {description && <p className="contact-form-block__description">{description}</p>}
          {form?.slug && <FormEmbed slug={form.slug} initialForm={form} recaptchaSiteKey={recaptchaSiteKey} />}
        </div>
        {safeMapUrl && (
          <div className="contact-form-block__map-col">
            <iframe
              src={safeMapUrl}
              title="Map"
              className="contact-form-block__map"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        )}
      </div>
    </section>
  );
}
