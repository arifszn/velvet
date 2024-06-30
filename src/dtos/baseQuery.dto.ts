import { z } from 'zod';

export const BaseQueryInput = z.object({
  page: z.preprocess((val) => Number(val), z.number().min(1).default(1)),
  limit: z.preprocess((val) => Number(val), z.number().min(1).default(10)),
  sortOrder: z.enum(['ASC', 'DESC']).default('DESC'),
  search_query: z.string().optional(),
});

export type BaseQueryInput = z.infer<typeof BaseQueryInput>;
