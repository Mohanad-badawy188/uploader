export type UserActivityLog = {
  id: string;
  userId: number;
  action: string;
  createdAt: string;
  details: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
};
