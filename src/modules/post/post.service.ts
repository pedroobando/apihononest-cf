import { IPostService } from './interfaces/post.interface';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { v4 as uuidv4 } from 'uuid';

// En memoria por ahora, luego se reemplazará con la base de datos
const posts: Post[] = [];

export class PostService implements IPostService {
  async findAll(): Promise<Post[]> {
    return posts.filter((post) => post.active);
  }

  async findOne(id: string): Promise<Post | null> {
    return posts.find((post) => post.id === id && post.active) || null;
  }

  async findByUser(userId: string): Promise<Post[]> {
    return posts.filter((post) => post.userId === userId && post.active);
  }

  async create(createPostDto: CreatePostDto): Promise<Post> {
    const newPost: Post = {
      id: uuidv4(),
      ...createPostDto,
      active: createPostDto.active !== undefined ? createPostDto.active : true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    posts.push(newPost);
    return newPost;
  }

  async update(id: string, updatePostDto: UpdatePostDto): Promise<Post | null> {
    const index = posts.findIndex((post) => post.id === id && post.active);

    if (index === -1) return null;

    posts[index] = {
      ...posts[index],
      ...updatePostDto,
      updatedAt: new Date(),
    };

    return posts[index];
  }

  async delete(id: string): Promise<boolean> {
    const index = posts.findIndex((post) => post.id === id && post.active);

    if (index === -1) return false;

    // Soft delete
    posts[index].active = false;
    posts[index].updatedAt = new Date();

    return true;
  }
}
