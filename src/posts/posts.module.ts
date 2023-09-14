import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostService } from './posts.service';
import { PostsController } from './posts.controller';
import { Post } from '../entities/Post';

@Module({
  imports: [TypeOrmModule.forFeature([Post])],
  controllers: [PostsController],
  providers: [PostService],
})
export class PostsModule {}
