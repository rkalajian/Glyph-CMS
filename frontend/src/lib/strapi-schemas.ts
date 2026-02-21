/**
 * Zod schemas for Strapi REST API responses.
 * Validates external API data at the boundary.
 */

import { z } from 'zod';

// -----------------------------------------------------------------------------
// Base schemas
// -----------------------------------------------------------------------------

export const strapiPaginationSchema = z.object({
  page: z.number(),
  pageSize: z.number(),
  pageCount: z.number(),
  total: z.number(),
}).passthrough();

export const strapiImageSchema = z.object({
  id: z.number().optional(),
  documentId: z.string().optional(),
  url: z.string(),
  alternativeText: z.string().nullable().optional(),
  caption: z.string().nullable().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
}).passthrough().nullable().optional();

// -----------------------------------------------------------------------------
// Content type schemas (minimal - fields we actually use)
// -----------------------------------------------------------------------------

export const strapiSiteAlertSchema = z.object({
  id: z.number().optional(),
  documentId: z.string(),
  message: z.string(),
  startDate: z.string(),
  endDate: z.string().nullable().optional(),
  severity: z.enum(['info', 'warning', 'critical']).optional(),
  linkUrl: z.string().nullable().optional(),
  linkLabel: z.string().nullable().optional(),
  publishedAt: z.string().nullable().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
}).passthrough();

export const strapiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    data: z.union([dataSchema, z.array(dataSchema)]),
    meta: z.object({ pagination: strapiPaginationSchema.optional() }).passthrough().optional(),
    error: z.object({ message: z.string() }).optional(),
  }).passthrough();

/** Parse Strapi response or return null on validation failure. */
export function parseStrapiResponse<T>(
  raw: unknown,
  schema: z.ZodType<T>,
  logPrefix = '[Strapi]'
): { data: T | T[]; meta?: { pagination?: z.infer<typeof strapiPaginationSchema> } } | null {
  const result = z.object({
    data: z.union([schema, z.array(schema)]),
    meta: z.object({ pagination: strapiPaginationSchema.optional() }).passthrough().optional(),
  }).passthrough().safeParse(raw);

  if (!result.success) {
    if (import.meta.env.DEV) {
      console.warn(`${logPrefix} Validation failed:`, result.error.flatten());
    }
    return null;
  }
  return result.data;
}
