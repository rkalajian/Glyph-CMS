import { factories } from '@strapi/strapi';

interface SubmissionInput {
  form?: string;
  [key: string]: unknown;
}

interface FormWithEmailOptions {
  documentId: string;
  name: string;
  slug: string;
  notifyEmail?: string | null;
  notifySubmitter?: boolean;
  emailSubject?: string | null;
  fields?: Array<{ name: string; type: string }>;
}

function buildSubmissionEmailBody(
  formName: string,
  data: Record<string, unknown>
): { text: string; html: string } {
  const entries = Object.entries(data).filter(([, v]) => v != null && String(v).trim() !== '');
  const text = `New form submission: ${formName}\n\n${entries.map(([k, v]) => `${k}: ${String(v)}`).join('\n')}`;
  const html = `
    <h2>New form submission: ${formName}</h2>
    <table cellpadding="8" cellspacing="0" border="1" style="border-collapse:collapse;">
      ${entries.map(([k, v]) => `<tr><td><strong>${k}</strong></td><td>${String(v)}</td></tr>`).join('')}
    </table>
  `.trim();
  return { text, html };
}

export default factories.createCoreController(
  'api::form-submission.form-submission',
  ({ strapi }) => ({
    async create(ctx) {
      const body = ctx.request.body as { data?: SubmissionInput } | SubmissionInput;
      const inputData = (body && typeof body === 'object' && 'data' in body ? body.data : body) as SubmissionInput | undefined;
      const formRef = inputData?.form;
      if (!inputData || formRef === undefined) {
        return ctx.badRequest('Form reference is required');
      }

      const docService = strapi.documents('api::form.form');
      const form = await docService.findFirst({
        filters: {
          status: 'published',
          $or: [{ documentId: formRef }, { slug: formRef }],
        },
      } as object) as unknown as FormWithEmailOptions | null;

      if (!form) {
        return ctx.badRequest('Form not found or not published');
      }

      const { form: _f, ...submissionData } = inputData;

      const submission = await strapi.documents('api::form-submission.form-submission').create({
        data: {
          form: form.documentId,
          data: submissionData as Record<string, string | number | boolean | null>,
          submittedAt: new Date().toISOString(),
        },
      });

      // Email routing
      const notifyEmail = form.notifyEmail?.trim();
      const notifySubmitter = form.notifySubmitter ?? false;
      const subject = form.emailSubject?.trim() || `Form submission: ${form.name}`;

      if (notifyEmail || notifySubmitter) {
        const dataPlain = submissionData as Record<string, unknown>;
        const { text, html } = buildSubmissionEmailBody(form.name, dataPlain);
        const emailService = strapi.service('api::theme-options.email') as { send: (opts: { to: string | string[]; subject: string; text?: string; html?: string }) => Promise<{ success: boolean; error?: string }> };

        if (notifyEmail) {
          await emailService.send({ to: notifyEmail, subject, text, html });
        }

        if (notifySubmitter) {
          const emailFields = (form.fields ?? []).filter((f: { type: string }) => f.type === 'email');
          let submitterAddr: string | undefined;
          for (const f of emailFields) {
            const v = dataPlain[f.name];
            if (v && typeof v === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
              submitterAddr = v;
              break;
            }
          }
          if (!submitterAddr) {
            const fallbackKeys = ['email', 'Email', 'your-email', 'e-mail'];
            for (const k of fallbackKeys) {
              const v = dataPlain[k];
              if (v && typeof v === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
                submitterAddr = v;
                break;
              }
            }
          }
          if (submitterAddr && typeof submitterAddr === 'string') {
            const copySubject = `Copy of your submission: ${form.name}`;
            const copyText = `Thank you for your submission. Here is a copy:\n\n${text}`;
            const copyHtml = `<p>Thank you for your submission. Here is a copy:</p>${html}`;
            await emailService.send({ to: submitterAddr, subject: copySubject, text: copyText, html: copyHtml });
          }
        }
      }

      return { data: submission };
    },
  })
);
