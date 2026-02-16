import { adminApi } from '@strapi/admin/strapi-admin';

const uploadApi = adminApi.enhanceEndpoints({
    addTagTypes: [
        'Asset',
        'Folder'
    ]
}).injectEndpoints({
    endpoints: (builder)=>({
            uploadFiles: builder.mutation({
                query: (formData)=>({
                        url: '/upload',
                        method: 'POST',
                        data: formData
                    }),
                invalidatesTags: [
                    'Asset'
                ]
            })
        })
});
const { useUploadFilesMutation } = uploadApi;

export { uploadApi, useUploadFilesMutation };
//# sourceMappingURL=api.mjs.map
