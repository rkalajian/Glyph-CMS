"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const strapi_1 = require("@strapi/strapi");
function buildSubmissionEmailBody(formName, data) {
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
exports.default = strapi_1.factories.createCoreController('api::form-submission.form-submission', ({ strapi }) => ({
    async create(ctx) {
        var _a, _b, _c, _d;
        const body = ctx.request.body;
        const inputData = (body && typeof body === 'object' && 'data' in body ? body.data : body);
        const formRef = inputData === null || inputData === void 0 ? void 0 : inputData.form;
        if (!inputData || formRef === undefined) {
            return ctx.badRequest('Form reference is required');
        }
        const docService = strapi.documents('api::form.form');
        const form = await docService.findFirst({
            filters: {
                status: 'published',
                $or: [{ documentId: formRef }, { slug: formRef }],
            },
        });
        if (!form) {
            return ctx.badRequest('Form not found or not published');
        }
        const { form: _f, ...submissionData } = inputData;
        const submission = await strapi.documents('api::form-submission.form-submission').create({
            data: {
                form: form.documentId,
                data: submissionData,
                submittedAt: new Date().toISOString(),
            },
        });
        // Email routing
        const notifyEmail = (_a = form.notifyEmail) === null || _a === void 0 ? void 0 : _a.trim();
        const notifySubmitter = (_b = form.notifySubmitter) !== null && _b !== void 0 ? _b : false;
        const subject = ((_c = form.emailSubject) === null || _c === void 0 ? void 0 : _c.trim()) || `Form submission: ${form.name}`;
        if (notifyEmail || notifySubmitter) {
            const dataPlain = submissionData;
            const { text, html } = buildSubmissionEmailBody(form.name, dataPlain);
            const emailService = strapi.service('api::theme-options.email');
            if (notifyEmail) {
                await emailService.send({ to: notifyEmail, subject, text, html });
            }
            if (notifySubmitter) {
                const emailFields = ((_d = form.fields) !== null && _d !== void 0 ? _d : []).filter((f) => f.type === 'email');
                let submitterAddr;
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
}));
