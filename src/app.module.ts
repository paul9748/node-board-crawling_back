import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './users/users.module';
import { PostsModule } from './posts/Posts.module';

import typeORMConfig from '../typeorm.config';
console.log(typeORMConfig);
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => typeORMConfig,
    }),

    UserModule,
    PostsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
