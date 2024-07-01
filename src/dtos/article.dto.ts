import { z } from 'zod';
import { Expose, plainToInstance } from 'class-transformer';
import { BaseQueryInput } from './baseQuery.dto';
import { Article } from '../entities/article.entity';

export const CreateArticleInput = z.object({
  title: z.string().max(255),
  body: z.string(),
});

export const UpdateArticleInput = z.object({
  title: z.string().max(255).optional(),
  body: z.string().optional(),
});

export const QueryArticlesInput = BaseQueryInput.extend({
  sortBy: z.enum(['createdAt', 'title']).default('createdAt'),
});

export type CreateArticleInput = z.infer<typeof CreateArticleInput>;
export type UpdateArticleInput = z.infer<typeof UpdateArticleInput>;
export type QueryArticlesInput = z.infer<typeof QueryArticlesInput>;

export class ArticleOutput {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  body: string;

  @Expose({ name: 'created_at' })
  created_at: Date;

  static fromEntity(article: Article): ArticleOutput {
    return plainToInstance(ArticleOutput, article, {
      excludeExtraneousValues: true,
    });
  }

  static fromEntities(articles: Article[]): ArticleOutput[] {
    return articles.map((article) => this.fromEntity(article));
  }
}
