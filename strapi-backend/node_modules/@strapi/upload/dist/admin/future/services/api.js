'use strict';

var strapiAdmin = require('@strapi/admin/strapi-admin');

const uploadApi = strapiAdmin.adminApi.enhanceEndpoints({
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

exports.uploadApi = uploadApi;
exports.useUploadFilesMutation = useUploadFilesMutation;
//# sourceMappingURL=api.js.map
