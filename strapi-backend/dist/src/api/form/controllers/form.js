"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const strapi_1 = require("@strapi/strapi");
exports.default = strapi_1.factories.createCoreController('api::form.form', ({ strapi }) => ({
    async findBySlug(ctx) {
        var _a;
        const { slug } = ctx.params;
        const docService = strapi.documents('api::form.form');
        const form = await docService.findFirst({
            filters: { slug, status: 'published' },
        });
        if (!form) {
            return ctx.notFound('Form not found');
        }
        const baseUrl = (_a = process.env.FRONTEND_URL) !== null && _a !== void 0 ? _a : 'http://localhost:5173';
        const embedUrl = `${baseUrl}/embed/form/${form.slug}`;
        return {
            data: {
                ...form,
                embedCode: `<iframe src="${embedUrl}" width="100%" height="400" style="border:none;" title="${form.name}"></iframe>`,
            },
        };
    },
}));
