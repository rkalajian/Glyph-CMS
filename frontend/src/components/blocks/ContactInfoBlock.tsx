import './ContactInfoBlock.css';
import type { StrapiBlockContactInfo } from '../../types/strapi';
import { RichText } from '../RichText';

interface ContactInfoBlockProps extends StrapiBlockContactInfo {
  __component: 'blocks.contact-info';
}

export function ContactInfoBlock({ heading, items }: ContactInfoBlockProps) {
  const cards = items ?? [];

  return (
    <section className="contact-info" aria-label={heading ?? 'Contact Information'}>
      <div className="contact-info__inner">
        {heading && <h2 className="contact-info__heading">{heading}</h2>}
        <div className="contact-info__grid" role="list">
          {cards.map((item, i) => (
            <div key={item.id ?? i} role="listitem">
              <h3 className="contact-info__card-title">{item.title}</h3>
              {item.body && (
                <RichText content={item.body} className="contact-info__card-body" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
