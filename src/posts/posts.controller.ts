import { Controller, Get, Query, Post, Body, UseGuards, Req } from '@nestjs/common';
import { PostsService } from './posts.service';
import { Posts } from '../entities/Posts';
import { CreatePostDto } from './posts.dto';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtServiceAuthGuard } from 'src/auth/JwtServiceAuthGuard';
import { query } from 'express';


@Controller('posts')
export class PostsController {
  constructor(private readonly postService: PostsService) { }

  @Get()
  async findAll(
    @Query('take') take: number,
    @Query('pageNO') pageNo: number,
  ): Promise<Posts[]> {
    return this.postService.findAll(take, pageNo);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: '게시글 작성',
    description: '게시글 작성을 한다.',
  })
  @UseGuards(JwtServiceAuthGuard)
  @Post('createPost')
  async createPost(@Body() body: CreatePostDto, @Req() req) {
    await this.postService.creatPost(req.user.no, body.postTitle, body.boardNo, body.postContent);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: '게시글 좋아요',
    description: '게시글 좋아요를 생성,삭제 한다.',
  })
  @UseGuards(JwtServiceAuthGuard)
  @Post('like')
  async likePost(@Query('post') postNo: number, @Req() req) {
    await this.postService.likePost(req.user.no, postNo)
  }



}
