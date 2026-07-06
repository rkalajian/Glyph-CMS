import { RichText } from '../RichText';
import './NameListBlock.css';
import type { StrapiBlockNameList } from '../../types/strapi';

export function NameListBlock({
  heading,
  description,
  sections,
}: StrapiBlockNameList) {
  return (
    <section className="name-list">
      <div className="name-list__inner">
        <div className="name-list__header">
          {heading && <h2 className="name-list__heading">{heading}</h2>}
          {description && (
            <RichText content={description} className="name-list__description" />
          )}
        </div>
        <hr className="name-list__divider" aria-hidden="true" />
        {sections && sections.length > 0 && (
          <div className="name-list__sections">
            {sections.map((section, si) => (
              <div key={si}>
                <h3 className="name-list__section-title">{section.title}</h3>
                {section.members && section.members.length > 0 && (
                  <ul className="name-list__grid" role="list">
                    {section.members.map((member, mi) => (
                      <li key={mi} className="name-list__member">
                        <span className="name-list__name">{member.name}</span>
                        {member.organization && (
                          <span className="name-list__organization">{member.organization}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
