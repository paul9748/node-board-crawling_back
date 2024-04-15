import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { AuthModule } from './auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { CrawledData } from './entities/CrawledData'; // CrawledData 엔터티 추가


import typeORMConfig from '../typeorm.config';
console.log(typeORMConfig);
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => typeORMConfig,
    }),
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
    }),
    TypeOrmModule.forFeature([CrawledData]),
    UserModule,
    PostsModule,
    AuthModule,
    PassportModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
