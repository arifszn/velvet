import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { UserStatus } from '../constants/userStatus.constant';
import { compare, hash } from 'bcryptjs';
import { UNIQUE_CONSTRAINT } from '../constants/uniqueConstraint.constant';

@Entity('users')
@Unique(UNIQUE_CONSTRAINT.USERS_EMAIL.indexName, [
  UNIQUE_CONSTRAINT.USERS_EMAIL.columnName,
])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 200 })
  email: string;

  @Column()
  password: string;

  @Column({ default: false })
  isAdmin: boolean;

  @Column({ default: UserStatus.ACTIVE })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  async hashPassword() {
    this.password = await hash(this.password, 10);
  }

  async validatePassword(password: string): Promise<boolean> {
    return await compare(password, this.password);
  }
}
