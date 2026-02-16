import { jsxs, jsx } from 'react/jsx-runtime';
import { Layouts } from '@strapi/admin/strapi-admin';
import { Button } from '@strapi/design-system';

const AIGenerationPage = ()=>{
    return /*#__PURE__*/ jsxs(Layouts.Root, {
        children: [
            /*#__PURE__*/ jsx(Layouts.Header, {
                title: "AI Generation",
                primaryAction: /*#__PURE__*/ jsx(Button, {
                    children: "TODO: Generate"
                })
            }),
            /*#__PURE__*/ jsx(Layouts.Content, {
                children: "TODO: AI ListView"
            })
        ]
    });
};

export { AIGenerationPage };
//# sourceMappingURL=AIGenerationPage.mjs.map
