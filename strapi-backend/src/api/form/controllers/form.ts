import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::form.form', ({ strapi }) => ({
  async findBySlug(ctx) {
    const { slug } = ctx.params;
    const docService = strapi.documents('api::form.form');
    const form = await docService.findFirst({
      filters: { slug, status: 'published' },
    });
    if (!form) {
      return ctx.notFound('Form not found');
    }
    const baseUrl = process.env.FRONTEND_URL ?? 'http://localhost:5173';
    const embedUrl = `${baseUrl}/embed/form/${form.slug}`;
    return {
      data: {
        ...form,
        embedCode: `<iframe src="${embedUrl}" width="100%" height="400" style="border:none;" title="${form.name}"></iframe>`,
      },
    };
  },
}));
