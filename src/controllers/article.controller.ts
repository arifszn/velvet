import { Response } from 'express';
import {
  ArticleOutput,
  CreateArticleInput,
  QueryArticlesInput,
  UpdateArticleInput,
} from '../dtos/article.dto';
import { AuthRequest } from '../interfaces/authRequest.interface';
import { ArticleService } from '../services/article.service';
import { ErrorMessages } from '../constants/message.constant';
import { z } from 'zod';
import logger from '../utils/logger.utils';

export class ArticleController {
  private readonly articleService: ArticleService;

  constructor() {
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
      if (error instanceof z.ZodError) {
        res.status(400).json({
          errors: error.errors,
        });
      } else {
        logger.error(error);
        res.status(500).json({
          message: error?.message || ErrorMessages.InternalServerError,
        });
      }
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
      }

      res.status(200).json(ArticleOutput.fromEntity(article));
    } catch (error) {
      logger.error(error);
      res
        .status(500)
        .json({ message: error?.message || ErrorMessages.InternalServerError });
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
      if (error instanceof z.ZodError) {
        res.status(400).json({
          errors: error.errors,
        });
      } else {
        logger.error(error);
        res.status(500).json({
          message: error?.message || ErrorMessages.InternalServerError,
        });
      }
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
      logger.error(error);
      if (error instanceof z.ZodError) {
        res.status(400).json({
          errors: error.errors,
        });
      } else {
        logger.error(error);
        res.status(500).json({
          message: error?.message || ErrorMessages.InternalServerError,
        });
      }
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
      if (error instanceof z.ZodError) {
        res.status(400).json({
          errors: error.errors,
        });
      } else {
        logger.error(error);
        res.status(500).json({
          message: error?.message || ErrorMessages.InternalServerError,
        });
      }
    }
  }
}
