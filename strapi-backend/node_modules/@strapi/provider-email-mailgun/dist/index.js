'use strict';

var assert = require('node:assert');
var formData = require('form-data');
var Mailgun = require('mailgun.js');

const DEFAULT_OPTIONS = {
    username: 'api'
};
var index = {
    init (providerOptions, settings) {
        assert(providerOptions.key, 'Mailgun API key is required');
        assert(providerOptions.domain, 'Mailgun domain is required');
        const mailgun = new Mailgun(formData);
        const mg = mailgun.client({
            ...DEFAULT_OPTIONS,
            ...providerOptions
        });
        return {
            send (options) {
                const { from, to, cc, bcc, replyTo, subject, text, html, ...rest } = options;
                const data = {
                    from: from || settings.defaultFrom,
                    to,
                    cc,
                    bcc,
                    'h:Reply-To': replyTo || settings.defaultReplyTo,
                    subject,
                    text,
                    html,
                    ...rest
                };
                return mg.messages.create(providerOptions.domain, data);
            }
        };
    }
};

module.exports = index;
//# sourceMappingURL=index.js.map
