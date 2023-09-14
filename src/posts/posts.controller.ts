import { Controller, Get, Query } from '@nestjs/common';
import { PostService } from './posts.service';
import { Post } from '../entities/Post';

@Controller('posts')
export class PostsController {
  constructor(private readonly postService: PostService) {}

  @Get()
  async findAll(
    @Query('take') take: number,
    @Query('pageNO') pageNo: number,
  ): Promise<Post[]> {
    return this.postService.findAll(take, pageNo);
  }
}
