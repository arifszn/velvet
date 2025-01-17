import { Response } from 'express';
import {
  ArticleOutput,
  CreateArticleInput,
  QueryArticlesInput,
  UpdateArticleInput,
} from '@/dtos/article.dto';
import { AuthRequest } from '@/interfaces/authRequest.interface';
import { ArticleService } from '@/services/article.service';
import { ErrorMessages } from '@/enums/message.enum';
import { BaseController } from '@/controllers/base.controller';

export class ArticleController extends BaseController {
  private readonly articleService: ArticleService;

  constructor() {
    super();
    this.articleService = new ArticleService();
  }

  public async getPaginatedArticles(
    req: AuthRequest,
    res: Response,
  ): Promise<void> {
    try {
      const userId = req.user.id;
      const {
        page,
        limit,
        search_query: searchQuery,
        sortOrder,
        sortBy,
      } = QueryArticlesInput.parse(req.query);
      const { articles, count } =
        await this.articleService.getPaginatedArticlesByUserId(
          userId,
          page,
          limit,
          sortBy,
          sortOrder,
          searchQuery,
        );

      res
        .status(200)
        .json({ data: ArticleOutput.fromEntities(articles), meta: { count } });
    } catch (error) {
      this.handleError(res, error);
    }
  }

  public async getArticle(req: AuthRequest, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      const userId = req.user.id;

      const article = await this.articleService.getArticleByIdAndUserId(
        id,
        userId,
      );
      if (!article) {
        res.status(404).json({ message: ErrorMessages.ResourceNotFound });
        return;
      }

      res.status(200).json(ArticleOutput.fromEntity(article));
    } catch (error) {
      this.handleError(res, error);
    }
  }

  public async createArticle(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user.id;
      const createArticleInput = CreateArticleInput.parse(req.body);

      const article = await this.articleService.createArticle(
        createArticleInput,
        userId,
      );
      res.status(201).json(ArticleOutput.fromEntity(article));
    } catch (error) {
      this.handleError(res, error);
    }
  }

  public async updateArticle(req: AuthRequest, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      const userId = req.user.id;
      const updateArticleInput = UpdateArticleInput.parse(req.body);

      const article = await this.articleService.updateArticleByIdAndUserId(
        id,
        userId,
        updateArticleInput,
      );
      if (!article) {
        res.status(404).json({ message: ErrorMessages.ResourceNotFound });
        return;
      }

      res.status(200).json(ArticleOutput.fromEntity(article));
    } catch (error) {
      this.handleError(res, error);
    }
  }

  public async deleteArticle(req: AuthRequest, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      const userId = req.user.id;

      const article = await this.articleService.getArticleByIdAndUserId(
        id,
        userId,
      );
      if (!article) {
        res.status(404).json({ message: ErrorMessages.ResourceNotFound });
        return;
      }

      await this.articleService.deleteArticlesByIdsAndUserId([id], userId);
      res.status(204).send();
    } catch (error) {
      this.handleError(res, error);
    }
  }
}
