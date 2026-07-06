'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { getStrapiImageUrl, getFocalPointStyle } from '../../lib/strapi';
import { RichText } from '../RichText';
import './ProfileCarouselBlock.css';
import type { StrapiBlockProfileCarousel, StrapiLeadershipMember } from '../../types/strapi';

function LinkedInIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false">
      <rect width="16" height="16" rx="2" fill="#D36119" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.5 5.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM2.5 6.5h2v6h-2v-6Zm3 0h2v.87c.37-.56 1.07-.87 1.75-.87C11 6.5 11.5 7.52 11.5 9v3.5h-2V9.25C9.5 8.56 9.2 8 8.5 8c-.7 0-1 .56-1 1.25V12.5h-2v-6Z"
        fill="white"
      />
    </svg>
  );
}

function AboutArrowIcon() {
  return (
    <svg
      className="profile-carousel__about-arrow"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      {/* diagonal ↗ at rest, rotates to → on hover via CSS */}
      <path
        d="M5 15L15 5M15 5H7M15 5V13"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false">
      <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowLeftIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M9 11L5 7L9 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M5 3L9 7L5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MemberModal({ member, onClose }: { member: StrapiLeadershipMember; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return createPortal(
    <div className="profile-carousel__modal-backdrop" onClick={onClose} role="presentation">
      <div
        className="profile-carousel__modal"
        role="dialog"
        aria-modal="true"
        aria-label={`About ${member.name}`}
        onClick={e => e.stopPropagation()}
      >
        <button ref={closeRef} className="profile-carousel__modal-close" onClick={onClose} aria-label="Close">
          <CloseIcon />
        </button>
        <div className="profile-carousel__modal-body">
          <div>
            <p className="profile-carousel__card-name">{member.name}</p>
            <p className="profile-carousel__card-role">{member.role}</p>
          </div>
          {member.bio && <RichText content={member.bio} className="profile-carousel__modal-bio" />}
          {member.linkedinUrl && (
            <a
              href={member.linkedinUrl}
              className="profile-carousel__modal-linkedin"
              target="_blank"
              rel="noopener noreferrer"
            >
              <LinkedInIcon />
              <span>View LinkedIn Profile</span>
            </a>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}

function MemberCard({ member }: { member: StrapiLeadershipMember }) {
  const [modalOpen, setModalOpen] = useState(false);
  const imgUrl = getStrapiImageUrl(member.image);
  const nameParts = member.name.trim().split(' ');
  const firstName = nameParts.find(p => !p.endsWith('.')) ?? nameParts[0];
  const hasAbout = !!(member.bio || member.linkedinUrl);

  return (
    <div className="profile-carousel__card">
      {imgUrl ? (
        <img
          src={imgUrl}
          alt=""
          width={member.image?.width ?? 300}
          height={224}
          className="profile-carousel__card-image"
          loading="lazy"
          style={getFocalPointStyle(member.image)}
        />
      ) : (
        <div className="profile-carousel__card-image-placeholder" aria-hidden="true" />
      )}
      <div className="profile-carousel__card-content">
        <div>
          <p className="profile-carousel__card-name">{member.name}</p>
          <p className="profile-carousel__card-role">{member.role}</p>
        </div>
        {hasAbout && (
          <button
            className="profile-carousel__about-btn"
            onClick={() => setModalOpen(true)}
            aria-haspopup="dialog"
            aria-label={`About ${member.name}`}
          >
            <span>ABOUT {firstName.toUpperCase()}</span>
            <AboutArrowIcon />
          </button>
        )}
      </div>
      {modalOpen && <MemberModal member={member} onClose={() => setModalOpen(false)} />}
    </div>
  );
}

export function ProfileCarouselBlock({
  heading,
  description,
  members,
}: StrapiBlockProfileCarousel) {
  const cards = members ?? [];
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollToIndex = useCallback((index: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const cardEls = el.querySelectorAll<HTMLElement>('.profile-carousel__card');
    const target = cardEls[index];
    if (!target) return;
    el.scrollTo({ left: target.offsetLeft, behavior: 'smooth' });
    setActiveIndex(index);
  }, []);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const cardEls = el.querySelectorAll<HTMLElement>('.profile-carousel__card');
    let closest = 0;
    let minDist = Infinity;
    cardEls.forEach((card, i) => {
      const dist = Math.abs(card.offsetLeft - el.scrollLeft);
      if (dist < minDist) { minDist = dist; closest = i; }
    });
    setActiveIndex(closest);
  }, []);

  return (
    <section className="profile-carousel">
      <div className="profile-carousel__inner">
        {(heading || description) && (
          <div className="profile-carousel__header">
            {heading && <h2 className="profile-carousel__heading">{heading}</h2>}
            {description && <RichText content={description} className="profile-carousel__description" />}
          </div>
        )}

        <div ref={scrollRef} className="profile-carousel__cards" onScroll={handleScroll}>
          {cards.map((member, i) => (
            <MemberCard key={member.id ?? i} member={member} />
          ))}
        </div>

        {cards.length > 1 && (
          <nav className="profile-carousel__nav" aria-label="Leadership members navigation">
            <button
              className="profile-carousel__nav-arrow"
              onClick={() => scrollToIndex(Math.max(0, activeIndex - 1))}
              disabled={activeIndex === 0}
              aria-label="Previous member"
            >
              <ArrowLeftIcon />
            </button>
            <div className="profile-carousel__nav-dots" role="tablist" aria-label="Members">
              {cards.map((_, i) => (
                <button
                  key={i}
                  role="tab"
                  aria-selected={i === activeIndex}
                  aria-label={`Go to member ${i + 1}`}
                  className={`profile-carousel__nav-dot${i === activeIndex ? ' profile-carousel__nav-dot--active' : ''}`}
                  onClick={() => scrollToIndex(i)}
                />
              ))}
            </div>
            <button
              className="profile-carousel__nav-arrow"
              onClick={() => scrollToIndex(Math.min(cards.length - 1, activeIndex + 1))}
              disabled={activeIndex === cards.length - 1}
              aria-label="Next member"
            >
              <ArrowRightIcon />
            </button>
          </nav>
        )}
      </div>
    </section>
  );
}
