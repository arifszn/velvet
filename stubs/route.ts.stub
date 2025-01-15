import { Router } from 'express';
import { authenticateUser } from '@/middlewares/auth.middleware';
import { ArticleController } from '@/controllers/article.controller';

const articleRouter = Router();
const articleController = new ArticleController();

articleRouter.use(authenticateUser);

articleRouter.get(
  '/',
  articleController.getPaginatedArticles.bind(articleController),
);

articleRouter.post(
  '/',
  articleController.createArticle.bind(articleController),
);

articleRouter.get(
  '/:id(\\d+)/',
  articleController.getArticle.bind(articleController),
);

articleRouter.patch(
  '/:id(\\d+)/',
  articleController.updateArticle.bind(articleController),
);

articleRouter.delete(
  '/:id(\\d+)/',
  articleController.deleteArticle.bind(articleController),
);

export default articleRouter;
