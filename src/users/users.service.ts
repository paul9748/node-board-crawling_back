import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/User';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(userId: string): Promise<User> {
    return this.userRepository.findOne({ where: { userId } });
  }

  async create(user: Partial<User>): Promise<User> {
    const newuser = this.userRepository.create(user);
    return this.userRepository.save(newuser);
  }

  async update(userId: string, user: Partial<User>): Promise<User> {
    await this.userRepository.update(userId, user);
    return this.userRepository.findOne({ where: { userId } });
  }

  async delete(userId: string): Promise<void> {
    await this.userRepository.delete(userId);
  }
}
