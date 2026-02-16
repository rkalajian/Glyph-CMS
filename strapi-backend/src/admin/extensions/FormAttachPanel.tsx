/**
 * Side panel for attaching Form Builder forms to content.
 * Lists published forms and copies [form:slug] shortcode to clipboard.
 */

import React, { useEffect, useState } from 'react';
import {
  useFetchClient,
  useNotification,
} from '@strapi/admin/strapi-admin';
import { Box, Button, Flex, Typography } from '@strapi/design-system';
import type { PanelComponentProps } from '@strapi/content-manager/strapi-admin';

interface FormItem {
  id: number;
  documentId: string;
  name: string;
  slug: string;
}

function FormAttachPanelContent() {
  const { get } = useFetchClient();
  const { toggleNotification } = useNotification();
  const [forms, setForms] = useState<FormItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    get('/content-manager/collection-types/api::form.form?status=published')
      .then((res) => {
        const data = res.data as { results?: Array<{ id?: number; documentId?: string; name?: string; slug?: string }> } | undefined;
        const results = data?.results ?? [];
        setForms(
          results.map((f) => ({
            id: f.id ?? 0,
            documentId: f.documentId ?? '',
            name: f.name ?? 'Unnamed',
            slug: f.slug ?? '',
          }))
        );
      })
      .catch(() => setForms([]))
      .finally(() => setLoading(false));
  }, [get]);

  const handleInsert = (slug: string) => {
    const shortcode = `[form:${slug}]`;
    navigator.clipboard.writeText(shortcode).then(
      () => {
        toggleNotification({
          type: 'success',
          message: `Copied "${shortcode}" to clipboard. Paste it in your content to embed this form.`,
        });
      },
      () => {
        toggleNotification({
          type: 'warning',
          message: 'Could not copy to clipboard.',
        });
      }
    );
  };

  return (
    <Box padding={3}>
      <Typography variant="pi" textColor="neutral600" marginTop={1}>
        Click a the button next to a form to copy its shortcode. Paste it in your rich text content to embed the form.
      </Typography>
      <Box marginTop={3}>
        {loading ? (
          <Typography variant="pi" textColor="neutral600">
            Loading forms…
          </Typography>
        ) : forms.length === 0 ? (
          <Typography variant="pi" textColor="neutral600">
            No published forms. Create one in Form Builder first.
          </Typography>
        ) : (
          <Flex direction="column" gap={2}>
            {forms.map((form) => (
              <Flex key={form.documentId || form.id} justifyContent="space-between" alignItems="center" gap={2}>
                <Typography variant="pi" fontWeight="semiBold">
                  {form.name}
                </Typography>
                <Button size="S" variant="secondary" onClick={() => handleInsert(form.slug)}>
                  Copy Shortcode
                </Button>
              </Flex>
            ))}
          </Flex>
        )}
      </Box>
    </Box>
  );
}

const ALLOWED_MODELS = ['api::page.page', 'api::blog-post.blog-post'];

export function FormAttachPanel(props: PanelComponentProps) {
  if (!ALLOWED_MODELS.includes(props.model)) {
    return null;
  }
  return {
    title: 'Attach form',
    content: <FormAttachPanelContent />,
  };
}
