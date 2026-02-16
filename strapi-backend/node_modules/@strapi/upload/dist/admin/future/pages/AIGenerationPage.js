'use strict';

var jsxRuntime = require('react/jsx-runtime');
var strapiAdmin = require('@strapi/admin/strapi-admin');
var designSystem = require('@strapi/design-system');

const AIGenerationPage = ()=>{
    return /*#__PURE__*/ jsxRuntime.jsxs(strapiAdmin.Layouts.Root, {
        children: [
            /*#__PURE__*/ jsxRuntime.jsx(strapiAdmin.Layouts.Header, {
                title: "AI Generation",
                primaryAction: /*#__PURE__*/ jsxRuntime.jsx(designSystem.Button, {
                    children: "TODO: Generate"
                })
            }),
            /*#__PURE__*/ jsxRuntime.jsx(strapiAdmin.Layouts.Content, {
                children: "TODO: AI ListView"
            })
        ]
    });
};

exports.AIGenerationPage = AIGenerationPage;
//# sourceMappingURL=AIGenerationPage.js.map
