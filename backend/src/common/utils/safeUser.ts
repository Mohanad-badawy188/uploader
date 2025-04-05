import { User } from '@prisma/client';

export function getSafeUser(user: User) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...safeUser } = user;
  return safeUser;
}
