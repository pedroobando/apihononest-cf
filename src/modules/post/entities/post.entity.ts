export interface Post {
  id: string;
  title: string;
  content: string;
  active: boolean;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}