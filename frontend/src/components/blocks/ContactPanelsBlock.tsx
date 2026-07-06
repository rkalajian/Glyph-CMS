import './ContactPanelsBlock.css';
import type { StrapiBlockContactPanels } from '../../types/strapi';

interface ContactPanelsBlockProps extends StrapiBlockContactPanels {
  __component: 'blocks.contact-panels';
}

export function ContactPanelsBlock({ heading, panels }: ContactPanelsBlockProps) {
  const items = panels ?? [];

  return (
    <section className="contact-panels">
      <div className="contact-panels__card">
        {heading && <h2 className="contact-panels__heading">{heading}</h2>}
        <div className="contact-panels__grid" role="list">
          {items.map((panel, i) => (
            <div key={panel.id ?? i} className="contact-panels__panel" role="listitem">
              <h3 className="contact-panels__panel-title">{panel.title}</h3>
              <div className="contact-panels__panel-body">
                {panel.contactName && <span>{panel.contactName}</span>}
                {panel.email && (
                  <a href={`mailto:${panel.email}`} className="contact-panels__panel-email">
                    {panel.email}
                  </a>
                )}
                {panel.phone && <a href={`tel:${panel.phone}`} className="contact-panels__panel-phone">{panel.phone}</a>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
