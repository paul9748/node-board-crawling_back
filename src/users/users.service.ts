import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/User';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt'



@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>
    ){}

    async Join(userId:string, userEmail:string, userPw:string){
        const newuser = await this.usersRepository.findOne({where:{userId}});
        if(newuser){
            throw new UnauthorizedException('이미 존재하는 사용자입니다.')
            return;
        }else{
            const hashedpassword = await bcrypt.hash(userPw, 12);
            await this.usersRepository.save({
                userId,
                userEmail,
                userPw:hashedpassword,
            })
        }     
    }
}
