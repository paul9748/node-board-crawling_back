import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../entities/Post';
import { error } from 'console';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}
  async findAll(take: number, pageNO: number): Promise<Post[]> {
    if (take > 40) {
      throw error('The request exceeded the maximum number of views.');
    }
    return this.postRepository.find({
      take: take,
      skip: (pageNO - 1) * take,
      select: {
        postNo: true,
        postTitle: true,
        userNo: true,
        postCreationTime: true,
      },
    });
  }
}
