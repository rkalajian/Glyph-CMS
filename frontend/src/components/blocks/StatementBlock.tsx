import { RichText } from '../RichText';
import { BubbleBackground } from '../BubbleBackground';
import './StatementBlock.css';
import type { StrapiBlockStatement } from '../../types/strapi';

export function StatementBlock({ heading, body }: StrapiBlockStatement) {
  return (
    <section className="statement">
      <BubbleBackground variant="on-light" />
      <div className="statement__inner">
        <div className="statement__content">
          {heading && <h2 className="statement__heading">{heading}</h2>}
          {body && <RichText content={body} className="statement__body" />}
        </div>
      </div>
    </section>
  );
}
