import { CreatePostDto, UpdatePostDto } from '@/modules/post/dto';
import { Post } from '@/modules/post/entities/post.entity';

export interface IPostService {
  findAll(): Promise<Post[]>;
  findOne(id: string): Promise<Post | null>;
  findByUser(userId: string): Promise<Post[]>;
  create(createPostDto: CreatePostDto): Promise<Post>;
  update(id: string, updatePostDto: UpdatePostDto): Promise<Post | null>;
  delete(id: string): Promise<boolean>;
}
