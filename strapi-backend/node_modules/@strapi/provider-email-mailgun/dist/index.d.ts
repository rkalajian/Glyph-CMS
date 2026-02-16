import { type MailgunClientOptions } from 'mailgun.js';
interface Settings {
    defaultFrom: string;
    defaultReplyTo: string;
}
interface SendOptions {
    from?: string;
    to: string;
    cc: string;
    bcc: string;
    replyTo?: string;
    subject: string;
    text: string;
    html: string;
    [key: string]: unknown;
}
type ProviderOptions = MailgunClientOptions & {
    domain: string;
};
declare const _default: {
    init(providerOptions: ProviderOptions, settings: Settings): {
        send(options: SendOptions): Promise<import("mailgun.js").MessagesSendResult>;
    };
};
export default _default;
//# sourceMappingURL=index.d.ts.map