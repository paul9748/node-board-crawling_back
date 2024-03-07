import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/User';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async validateServiceUser(userEmail: string, userPw: string): Promise<any> {
    const user = await this.userRepo.findOne({
      where: {
        userEmail,
      },
    });

    if (!user) {
      throw new ForbiddenException('등록되지 않은 사용자입니다.');
    }

    // 전달받은 비밀번호와 DB에 저장된 비밀번호가 일치하는지 확인
    if (!(await bcrypt.compare(userPw, user.userPw))) {
      throw new ForbiddenException('비밀번호가 일치하지 않습니다.');
    }

    return user;
  }

  loginServiceUser(user: User) {
    const payload = {
      id: user.userId,
      email: user.userEmail,
      no: user.userNo,
      createAt: user.userJoinDate,
    };
    return {
      // 사용자 정보를 JWT 안에 전달
      token: this.jwtService.sign(payload),
    };
  }
}
