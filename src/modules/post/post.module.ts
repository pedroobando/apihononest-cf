import { Hono } from 'hono';
import { PostController } from './post.controller';
import { PostService } from './post.service';

export class PostModule {
  private readonly postController: PostController;
  private readonly postService: PostService;
  private readonly router: Hono;

  constructor() {
    this.postService = new PostService();
    this.postController = new PostController(this.postService);
    this.router = new Hono();
    this.setupRoutes();
  }

  private setupRoutes() {
    this.router.get('/', (c) => this.postController.getAllPosts(c));
    this.router.get('/:id', (c) => this.postController.getPostById(c));
    this.router.get('/user/:userId', (c) => this.postController.getPostsByUser(c));
    this.router.post('/', (c) => this.postController.createPost(c));
    this.router.put('/:id', (c) => this.postController.updatePost(c));
    this.router.delete('/:id', (c) => this.postController.deletePost(c));
  }

  getRoutes() {
    return this.router;
  }
}
