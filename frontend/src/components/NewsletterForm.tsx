'use client';

import { useState, useRef } from 'react';
import './NewsletterForm.css';

type Provider = 'none' | 'mailchimp' | 'constantContact' | null | undefined;

interface NewsletterFormProps {
  provider?: Provider;
  actionUrl?: string | null;
}

function subscribeMailchimp(
  actionUrl: string,
  email: string,
  onSuccess: () => void,
  onError: (msg: string) => void,
  onSettled: () => void,
) {
  const cbName = `__mc_cb_${Date.now()}`;
  const jsonpUrl =
    actionUrl.replace('/subscribe/post?', '/subscribe/post-json?') +
    `&EMAIL=${encodeURIComponent(email)}&c=${cbName}`;

  (window as unknown as Record<string, unknown>)[cbName] = (data: { result: string; msg: string }) => {
    delete (window as unknown as Record<string, unknown>)[cbName];
    script.remove();
    onSettled();
    if (data.result === 'success') {
      onSuccess();
    } else {
      const raw = data.msg?.replace(/<[^>]+>/g, '') ?? 'Subscription failed. Please try again.';
      onError(raw.toLowerCase().includes('already subscribed') ? "You're already subscribed!" : raw);
    }
  };

  const script = document.createElement('script');
  script.src = jsonpUrl;
  script.onerror = () => {
    delete (window as unknown as Record<string, unknown>)[cbName];
    script.remove();
    onSettled();
    onError('Subscription failed. Please try again.');
  };
  document.body.appendChild(script);
}

export function NewsletterForm({ provider, actionUrl }: NewsletterFormProps) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  // Only https action URLs — the Mailchimp path injects a JSONP <script>
  // pointing at this URL, and Constant Contact posts the form to it.
  const safeActionUrl = actionUrl?.startsWith('https://') ? actionUrl : null;
  const isMailchimp = provider === 'mailchimp' && !!safeActionUrl;
  const isCC = provider === 'constantContact' && !!safeActionUrl;

  const handleSubmit = (e: React.FormEvent) => {
    if (isMailchimp) {
      e.preventDefault();
      setLoading(true);
      setError(null);
      subscribeMailchimp(
        safeActionUrl!,
        email,
        () => setSubmitted(true),
        (msg) => setError(msg),
        () => setLoading(false),
      );
    } else if (isCC) {
      // Form posts to hidden iframe naturally — just show success optimistically
      setTimeout(() => setSubmitted(true), 400);
    } else {
      e.preventDefault();
      setSubmitted(true);
    }
  };

  if (submitted) {
    return <p className="newsletter-form__success">Thanks for subscribing!</p>;
  }

  return (
    <>
      {isCC && (
        <iframe name="newsletter-cc-target" title="" aria-hidden="true" className="newsletter-form__cc-iframe" />
      )}
      <form
        ref={formRef}
        className="newsletter-form"
        onSubmit={handleSubmit}
        aria-label="Newsletter signup"
        action={isCC ? safeActionUrl! : undefined}
        method={isCC ? 'post' : undefined}
        target={isCC ? 'newsletter-cc-target' : undefined}
      >
        <label htmlFor="footer-newsletter-email" className="sr-only">Email address</label>
        <input
          id="footer-newsletter-email"
          type="email"
          name={isMailchimp ? 'EMAIL' : 'email'}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email address"
          autoComplete="email"
          required
          disabled={loading}
          className="newsletter-form__input"
        />
        <button
          type="submit"
          className="newsletter-form__btn"
          disabled={loading}
          aria-busy={loading}
        >
          {loading ? 'SUBSCRIBING…' : 'SUBSCRIBE'}
        </button>
      </form>
      {error && <p className="newsletter-form__error" role="alert">{error}</p>}
    </>
  );
}
