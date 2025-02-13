import { In } from 'typeorm';
import { CreateArticleInput, UpdateArticleInput } from '@/dtos/article.dto';
import { Article } from '@/entities/article.entity';
import { ArticleRepository } from '@/repositories/article.repository';

export class ArticleService {
  private readonly articleRepository: ArticleRepository;

  constructor() {
    this.articleRepository = new ArticleRepository();
  }

  public async getAllArticlesByUserId(userId: number): Promise<Article[]> {
    return this.articleRepository.find({
      where: { user: { id: userId } },
    });
  }

  public async getPaginatedArticlesByUserId(
    userId: number,
    page: number,
    limit: number,
    sortBy: string = 'createdAt',
    sortOrder: 'ASC' | 'DESC' = 'DESC',
    searchQuery?: string,
  ): Promise<{ articles: Article[]; count: number }> {
    const queryBuilder = this.articleRepository.createQueryBuilder('articles');
    queryBuilder.where('articles.userId = :userId', { userId });

    if (searchQuery) {
      queryBuilder.andWhere('articles.title LIKE :searchQuery', {
        searchQuery: `%${searchQuery}%`,
      });
      queryBuilder.andWhere('articles.body LIKE :searchQuery', {
        searchQuery: `%${searchQuery}%`,
      });
    }

    queryBuilder
      .orderBy(`articles.${sortBy}`, sortOrder)
      .skip((page - 1) * limit)
      .take(limit);

    const [articles, count] = await queryBuilder.getManyAndCount();

    return { articles, count };
  }

  public async getArticleByIdAndUserId(
    id: number,
    userId: number,
  ): Promise<Article | undefined> {
    return this.articleRepository.findOneBy({
      id,
      user: { id: userId },
    });
  }

  public async createArticle(
    createArticleInput: CreateArticleInput,
    userId: number,
  ): Promise<Article> {
    const article = this.articleRepository.create({
      title: createArticleInput.title,
      body: createArticleInput.body,
      user: { id: userId },
    });
    return this.articleRepository.save(article);
  }

  public async updateArticleByIdAndUserId(
    id: number,
    userId: number,
    updateArticleInput: UpdateArticleInput,
  ): Promise<Article | undefined> {
    await this.articleRepository.update(
      {
        id,
        user: { id: userId },
      },
      {
        title: updateArticleInput.title,
        body: updateArticleInput.body,
      },
    );

    return this.articleRepository.findOne({
      where: { id, user: { id: userId } },
    });
  }

  public async deleteArticlesByIdsAndUserId(
    ids: number[],
    userId: number,
  ): Promise<void> {
    await this.articleRepository.delete({ id: In(ids), user: { id: userId } });
  }
}
