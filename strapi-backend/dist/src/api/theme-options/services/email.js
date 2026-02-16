"use strict";
/**
 * Email service using Mailgun config from Theme Options or env.
 * Use strapi.service('api::theme-options.email').send(...)
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ({ strapi }) => ({
    async send(options) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        const key = process.env.MAILGUN_API_KEY;
        const domain = process.env.MAILGUN_DOMAIN;
        let apiKey = key !== null && key !== void 0 ? key : '';
        let mailgunDomain = domain !== null && domain !== void 0 ? domain : '';
        let defaultFrom = (_a = process.env.MAILGUN_DEFAULT_FROM) !== null && _a !== void 0 ? _a : '';
        let defaultReplyTo = (_b = process.env.MAILGUN_DEFAULT_REPLY_TO) !== null && _b !== void 0 ? _b : '';
        let host = (_c = process.env.MAILGUN_URL) !== null && _c !== void 0 ? _c : 'https://api.mailgun.net';
        // Prefer Theme Options config when set
        try {
            const themeDoc = await strapi.documents('api::theme-options.theme-option').findFirst({
                status: 'published',
                populate: ['mailgun'],
            });
            const mailgun = ((_d = themeDoc === null || themeDoc === void 0 ? void 0 : themeDoc.mailgun) !== null && _d !== void 0 ? _d : {});
            if (mailgun.apiKey)
                apiKey = mailgun.apiKey;
            if (mailgun.domain)
                mailgunDomain = mailgun.domain;
            if (mailgun.host)
                host = /^https?:\/\//i.test(mailgun.host) ? mailgun.host : `https://${mailgun.host}`;
            if (mailgun.defaultFrom)
                defaultFrom = mailgun.defaultFrom;
            if (mailgun.defaultReplyTo)
                defaultReplyTo = mailgun.defaultReplyTo;
        }
        catch {
            // Use env defaults
        }
        if (!apiKey || !mailgunDomain) {
            return { success: false, error: 'Mailgun not configured. Set MAILGUN_API_KEY and MAILGUN_DOMAIN, or configure in Theme Options > Mailgun.' };
        }
        const from = (_e = options.from) !== null && _e !== void 0 ? _e : defaultFrom;
        if (!from) {
            return { success: false, error: 'From address required. Set MAILGUN_DEFAULT_FROM or Theme Options > Mailgun > Default From.' };
        }
        try {
            const Mailgun = (await Promise.resolve().then(() => __importStar(require('mailgun.js')))).default;
            const FormData = (await Promise.resolve().then(() => __importStar(require('form-data')))).default;
            const mailgun = new Mailgun(FormData);
            const mg = mailgun.client({
                username: 'api',
                key: apiKey,
                url: host,
            });
            const to = Array.isArray(options.to) ? options.to : [options.to];
            await mg.messages.create(mailgunDomain, {
                from,
                to,
                subject: options.subject,
                text: (_g = (_f = options.text) !== null && _f !== void 0 ? _f : options.html) !== null && _g !== void 0 ? _g : '',
                html: (_h = options.html) !== null && _h !== void 0 ? _h : undefined,
                'h:Reply-To': (_j = options.replyTo) !== null && _j !== void 0 ? _j : (defaultReplyTo || undefined),
            });
            return { success: true };
        }
        catch (err) {
            const msg = err instanceof Error ? err.message : 'Unknown error';
            (_l = (_k = strapi.log) === null || _k === void 0 ? void 0 : _k.error) === null || _l === void 0 ? void 0 : _l.call(_k, 'Mailgun send failed:', err);
            return { success: false, error: msg };
        }
    },
});
