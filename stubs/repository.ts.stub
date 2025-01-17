import { DataSource, Repository } from 'typeorm';
import dataSource from '@/configs/dataSource.config';
import { Article } from '@/entities/article.entity';

export class ArticleRepository extends Repository<Article> {
  public readonly dataSource: DataSource;

  constructor() {
    super(Article, dataSource.createEntityManager());
    this.dataSource = dataSource;
  }
}
