import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { Posts } from '../entities/Posts';
import { PostLike } from '../entities/PostLike'

@Module({
  imports: [TypeOrmModule.forFeature([Posts, PostLike])],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule { }
