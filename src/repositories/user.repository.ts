import { DataSource, Repository } from 'typeorm';
import dataSource from '@/configs/dataSource.config';
import { User } from '@/entities/user.entity';

export class UserRepository extends Repository<User> {
  public readonly dataSource: DataSource;

  constructor() {
    super(User, dataSource.createEntityManager());
    this.dataSource = dataSource;
  }
}
