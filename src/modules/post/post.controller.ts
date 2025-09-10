import { Context } from 'hono';
import { PostService } from './post.service';
import { CreatePostDto, UpdatePostDto } from './dto';

export class PostController {
  constructor(private readonly postService: PostService) {}

  async getAllPosts(c: Context) {
    try {
      const posts = await this.postService.findAll();
      return c.json(posts);
    } catch (error) {
      return c.json({ error: 'Internal server error' }, 500);
    }
  }

  async getPostById(c: Context) {
    try {
      const id = c.req.param('id');
      const post = await this.postService.findOne(id);

      if (!post) {
        return c.json({ error: 'Post not found' }, 404);
      }

      return c.json(post);
    } catch (error) {
      return c.json({ error: 'Internal server error' }, 500);
    }
  }

  async getPostsByUser(c: Context) {
    try {
      const userId = c.req.param('userId');
      const posts = await this.postService.findByUser(userId);
      return c.json(posts);
    } catch (error) {
      return c.json({ error: 'Internal server error' }, 500);
    }
  }

  async createPost(c: Context) {
    try {
      const createPostDto: CreatePostDto = await c.req.json();
      const post = await this.postService.create(createPostDto);
      return c.json(post, 201);
    } catch (error) {
      return c.json({ error: 'Internal server error' }, 500);
    }
  }

  async updatePost(c: Context) {
    try {
      const id = c.req.param('id');
      const updatePostDto: UpdatePostDto = await c.req.json();
      const post = await this.postService.update(id, updatePostDto);

      if (!post) {
        return c.json({ error: 'Post not found' }, 404);
      }

      return c.json(post);
    } catch (error) {
      return c.json({ error: 'Internal server error' }, 500);
    }
  }

  async deletePost(c: Context) {
    try {
      const id = c.req.param('id');
      const result = await this.postService.delete(id);

      if (!result) {
        return c.json({ error: 'Post not found' }, 404);
      }

      return c.json({ message: 'Post deleted successfully' });
    } catch (error) {
      return c.json({ error: 'Internal server error' }, 500);
    }
  }
}
