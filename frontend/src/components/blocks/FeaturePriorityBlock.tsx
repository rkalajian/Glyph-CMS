import Image from 'next/image';
import { getStrapiImageUrl, getFocalPointStyle } from '../../lib/strapi';
import { RichText } from '../RichText';
import { BubbleBackground } from '../BubbleBackground';
import './FeaturePriorityBlock.css';
import type { StrapiBlockFeaturePriority } from '../../types/strapi';

export function FeaturePriorityBlock({
  image,
  missionHeading,
  missionBody,
  sectionHeading,
  priorities,
}: StrapiBlockFeaturePriority) {
  const imgUrl = getStrapiImageUrl(image);
  const cards = priorities ?? [];

  return (
    <section className="feature-priority" aria-label="Mission and priorities">
      <BubbleBackground />
      <div className="feature-priority__inner">

        {/* Service grid card — image left, content right */}
        <div className="feature-priority__service-grid">
          {imgUrl && (
            <div className="feature-priority__service-image">
              <Image
                src={imgUrl}
                alt=""
                fill
                className="feature-priority__service-img"
                sizes="(min-width: 1024px) 50vw, 100vw"
                style={getFocalPointStyle(image)}
              />
            </div>
          )}
          <div className={`feature-priority__service-content${!imgUrl ? ' feature-priority__service-content--full' : ''}`}>
            {missionHeading && (
              <h2 className="feature-priority__mission-heading">{missionHeading}</h2>
            )}
            {missionBody && (
              <RichText content={missionBody} className="feature-priority__mission-body" />
            )}
          </div>
        </div>

        {/* Priority cards section */}
        {(sectionHeading || cards.length > 0) && (
          <div className="feature-priority__priorities">
            {sectionHeading && (
              <h3 className="feature-priority__section-heading">{sectionHeading}</h3>
            )}
            <div className="feature-priority__priority-cards">
              {cards.map((card, i) => (
                <div key={card.id ?? i} className="feature-priority__priority-card">
                  <h4 className="feature-priority__priority-title">{card.title}</h4>
                  <RichText content={card.body} className="feature-priority__priority-body" />
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
