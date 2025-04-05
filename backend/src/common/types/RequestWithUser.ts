// src/common/types/request-with-user.ts
import { Request } from 'express';
import { User } from '@prisma/client';

export interface RequestWithUser extends Request {
  user: User;
}
