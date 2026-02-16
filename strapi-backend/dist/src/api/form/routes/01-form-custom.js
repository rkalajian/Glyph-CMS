"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** Custom routes for form API - findBySlug and embed code */
exports.default = {
    type: 'content-api',
    routes: [
        {
            method: 'GET',
            path: '/slug/:slug',
            handler: 'api::form.form.findBySlug',
            config: { auth: false },
        },
    ],
};
