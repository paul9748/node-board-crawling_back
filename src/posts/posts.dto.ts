import { ApiProperty } from '@nestjs/swagger';

class CreatePostDto {

  @ApiProperty({
    description: '게시물 제목',
    example: '새로운 게시물 제목',
    required: true,

  })
  public postTitle: string;

  @ApiProperty({
    description: '게시판 번호',
    example: 1,
    required: true,

  })
  public boardNo: number;

  @ApiProperty({
    description: '게시물 내용',
    example: '새로운 게시물 내용입니다.',
    required: true,

  })
  public postContent: string;
}
export{CreatePostDto}