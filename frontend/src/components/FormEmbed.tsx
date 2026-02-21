/**
 * Renders a form from the form builder by slug.
 * Used for embedding on any page or post.
 * WCAG 2.2: Labels, error identification, focus management.
 */

import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getForm, getFormBySlug, submitForm } from '../lib/strapi';
import type { StrapiForm, StrapiFormField } from '../types/strapi';

interface FormEmbedProps {
  slug: string;
  className?: string;
}

const inputClasses =
  'w-full px-3 py-2 border border-border rounded bg-bg text-fg min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2';
const textareaClasses =
  'w-full px-3 py-2 border border-border rounded bg-bg text-fg focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 resize-y min-h-[120px]';
const labelClasses = 'block text-sm font-medium mb-1';

function FormFieldInput({ field }: { field: StrapiFormField }) {
  const id = `form-${field.name}`;
  const required = field.required ?? false;

  if (field.type === 'textarea') {
    return (
      <textarea
        id={id}
        name={field.name}
        required={required}
        rows={5}
        className={textareaClasses}
        aria-required={required}
      />
    );
  }

  if (field.type === 'select') {
    return (
      <select
        id={id}
        name={field.name}
        required={required}
        className={inputClasses}
        aria-required={required}
      >
        <option value="">— Select —</option>
        {(field.options ?? []).map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    );
  }

  if (field.type === 'checkbox') {
    return (
      <input
        id={id}
        name={field.name}
        type="checkbox"
        value="yes"
        className="h-4 w-4 rounded border-border text-accent focus:ring-accent"
        aria-required={required}
      />
    );
  }

  const inputType = field.type === 'email' ? 'email' : 'text';
  const autocomplete =
    field.name.toLowerCase().includes('email')
      ? 'email'
      : field.name.toLowerCase().includes('name')
        ? 'name'
        : undefined;

  return (
    <input
      id={id}
      name={field.name}
      type={inputType}
      required={required}
      autoComplete={autocomplete}
      className={inputClasses}
      aria-required={required}
    />
  );
}

export function FormEmbed({ slug, className = '' }: FormEmbedProps) {
  const navigate = useNavigate();
  const [form, setForm] = useState<StrapiForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    setLoading(true);
    getForm(slug)
      .then((f) => setForm(f ?? null))
      .catch(() => getFormBySlug(slug))
      .then((f) => setForm(f ?? null))
      .catch(() => setForm(null))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!form) return;
      setStatus('submitting');
      setMessage('');

      const formEl = e.currentTarget;
      const formData = new FormData(formEl);
      const data: Record<string, string | number | boolean> = {};
      formData.forEach((val, key) => {
        if (key === 'form') return;
        if (typeof val === 'string') {
          data[key] = val;
        }
      });

      const result = await submitForm(form.slug, data);

      if (result.ok) {
        const successType = form.successType ?? 'message';
        const redirectUrl = form.successRedirectUrl?.trim();

        if (successType === 'redirect' && redirectUrl) {
          if (redirectUrl.startsWith('http://') || redirectUrl.startsWith('https://')) {
            window.location.href = redirectUrl;
          } else {
            navigate(redirectUrl.startsWith('/') ? redirectUrl : `/${redirectUrl}`);
          }
          return;
        }

        setStatus('success');
        setMessage(form.successMessage ?? 'Thank you! Your submission has been received.');
        formEl.reset();
      } else {
        setStatus('error');
        setMessage(result.error ?? 'Something went wrong. Please try again.');
      }
    },
    [form]
  );

  if (loading) {
    return (
      <div className={`max-w-lg ${className}`.trim()} aria-busy="true">
        <p className="text-muted">Loading form…</p>
      </div>
    );
  }

  if (!form) {
    return (
      <div className={`max-w-lg ${className}`.trim()}>
        <p className="text-muted">Form not found.</p>
      </div>
    );
  }

  const fields = Array.isArray(form.fields) ? form.fields : [];

  return (
    <div className={`max-w-lg ${className}`.trim()}>
      <form
        onSubmit={handleSubmit}
        noValidate
        aria-labelledby="form-heading"
        aria-describedby={message ? 'form-status' : undefined}
      >
        <h2 id="form-heading" className="text-2xl font-semibold mb-4">
          {form.name}
        </h2>
        {form.description && (
          <p className="text-muted mb-4">{form.description}</p>
        )}

        {message && (
          <div
            id="form-status"
            role="status"
            aria-live="polite"
            className={`mb-4 p-4 rounded ${
              status === 'error'
                ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
                : 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
            }`}
          >
            {message}
          </div>
        )}

        <div className="space-y-4">
          {fields.map((field) => (
            <div key={field.name}>
              <label htmlFor={`form-${field.name}`} className={labelClasses}>
                {field.label}
                {field.required && <span className="text-red-500" aria-hidden="true"> *</span>}
              </label>
              <FormFieldInput field={field} />
            </div>
          ))}

          <motion.button
            type="submit"
            disabled={status === 'submitting'}
            aria-busy={status === 'submitting'}
            className="px-6 py-3 bg-accent text-white font-medium rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:opacity-70 min-h-[44px] min-w-[44px]"
            whileHover={{ backgroundColor: 'var(--color-accent-hover)' }}
            whileTap={{ scale: 0.98 }}
          >
            {status === 'submitting' ? 'Submitting…' : (form.submitButtonLabel ?? 'Submit')}
          </motion.button>
        </div>
      </form>
    </div>
  );
}
