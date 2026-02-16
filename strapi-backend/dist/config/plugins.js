"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = ({ env }) => {
    const mailgunKey = env('MAILGUN_API_KEY', '');
    const mailgunDomain = env('MAILGUN_DOMAIN', '');
    const useMailgun = Boolean(mailgunKey && mailgunDomain);
    return {
        email: useMailgun
            ? {
                config: {
                    provider: 'mailgun',
                    providerOptions: {
                        key: mailgunKey,
                        domain: mailgunDomain,
                        url: env('MAILGUN_URL', 'https://api.mailgun.net'),
                    },
                    settings: {
                        defaultFrom: env('MAILGUN_DEFAULT_FROM', ''),
                        defaultReplyTo: env('MAILGUN_DEFAULT_REPLY_TO', ''),
                    },
                },
            }
            : {},
    };
};
exports.default = config;
