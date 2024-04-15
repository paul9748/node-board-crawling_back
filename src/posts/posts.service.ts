import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Posts } from '../entities/Posts';
import { PostLike } from "../entities/PostLike"
import { error } from 'console';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Posts)
    private postsRepository: Repository<Posts>,
    @InjectRepository(PostLike)
    private postLikeRepository: Repository<PostLike>
  ) { }
  async findAll(take: number, pageNO: number): Promise<Posts[]> {
    if (take > 40) {
      throw error('The request exceeded the maximum number of views.');
    }
    return this.postsRepository.find({
      take: take,
      skip: (pageNO - 1) * take,
      select: {
        postNo: true,
        postTitle: true,
        userNo: true,
        postCreationTime: true,
        postViews: true,
        postLikes: true,
      },
      where: {
        postActivate: 0,
      }
    });
  }
  async creatPost(user_no: number, title: string, board_no: number, content: string) {
    await this.postsRepository.save({
      userNo: user_no,
      postTitle: title,
      boardNo: board_no,
      postContent: content,

    })
  }
  async likePost(user_no: number, post_no: number,) {
    const likedPost = this.postLikeRepository.findOne({
      where: {
        userNo: user_no,
        postNo: post_no,
      }
    })
    if (likedPost) {
      await this.postLikeRepository.delete({
        userNo: user_no,
        postNo: post_no,
      })
    } else {
      await this.postLikeRepository.save({
        userNo: user_no,
        postNo: post_no,
      })
    }

  }
  async findOne(post_no: number): Promise<Posts | undefined> {
    return await this.postsRepository.findOne({
      where: {
        postNo: post_no,
      }
    });

  }
}
