import { ApiProperty } from '@nestjs/swagger';

class JoinRequestDto {
  @ApiProperty({
    example: 'hong123',
    description: 'ID',
    required: true,
  })
  public userId: string;

  @ApiProperty({
    example: 'asd@asd.com',
    description: 'email',
    required: true,
  })
  public userEmail: string;

  @ApiProperty({
    example: '1q2w3e4r',
    description: 'password',
    required: true,
  })
  public userPw: string;
}
class UserDto {
  @ApiProperty({
    example: '1',
    description: 'userNo',
    required: false,
  })
  public userNo: string;
  @ApiProperty({
    example: 'hong123',
    description: 'ID',
    required: true,
  })
  public userId: string;

  @ApiProperty({
    example: 'asd@asd.com',
    description: 'email',
    required: true,
  })
  public userEmail: string;

  @ApiProperty({
    example: '1q2w3e4r',
    description: 'password',
    required: true,
  })
  public userPw: string;

  @ApiProperty({
    example: '2023-10-30 04:41:33',
    description: 'userJoinDate',
    required: false,
  })
  public userJoinDate: string;
}

class LoginRequestDto {
  @ApiProperty({
    example: 'asd@asd.com',
    description: 'email',
    required: true,
  })
  public userEmail: string;

  @ApiProperty({
    example: '1q2w3e4r',
    description: 'password',
    required: true,
  })
  public userPw: string;
}
export { JoinRequestDto, UserDto, LoginRequestDto };
