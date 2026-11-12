import { User } from '../../entities/user.entity';
import type { Request } from 'express';

export type AuthUser = Pick<
  User,
  'id' | 'email' | 'display_name' | 'role' | 'createdAt'
>;

export type AuthRequest = Request & {
  user: AuthUser;
};
