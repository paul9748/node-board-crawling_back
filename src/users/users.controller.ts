import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JoinRequestDto, LoginRequestDto, UserDto } from './user.dto';
import { UserService } from './users.service';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { LocalServiceAuthGuard } from 'src/auth/local-service.guard';
import { AuthService } from '../auth/auth.service';
import { JwtServiceAuthGuard } from 'src/auth/JwtServiceAuthGuard';

@Controller('users')
export class UserController {
  constructor(
    private UsersService: UserService,
    private authService: AuthService,
  ) { }
  // @ApiOperation({
  //   summary: '사용자 가입 API',
  //   description: '사용자가 가입을 한다.',
  // })
  // @Post('join')
  // async Join(@Body() body: JoinRequestDto) {
  //   await this.UsersService.Join(body.userId, body.userEmail, body.userPw);
  // }

  @ApiOperation({
    summary: '사용자 로그인 API',
    description: '사용자가 로그인을 한다.',
  })
  @UseGuards(LocalServiceAuthGuard)
  @Post('login')
  async postLogin(@Body() body: LoginRequestDto, @Req() req) {
    // validate() 반환값이 req의 프로퍼티로 추가됩니다.
    const token = this.authService.loginServiceUser(req.user);
    return token;
  }
  @ApiBearerAuth()
  @ApiOperation({
    summary: '내 정보 조회 API',
    description: '이름, 메일 등을 조회한다.',
  })
  @UseGuards(JwtServiceAuthGuard)
  @Get('profile')
  async getProfile(@Req() req) {
    const user = req.user;
    return {
      result: true,
      message: '내 정보를 조회합니다.',
      data: user,
    };
  }
}
