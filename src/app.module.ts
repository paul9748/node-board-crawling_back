import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { AuthModule } from './auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { CrawledData } from './entities/CrawledData';
import { SiteList } from './entities/SiteList';


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
    TypeOrmModule.forFeature([CrawledData, SiteList]),
    ScheduleModule.forRoot(),
    UserModule,
    PostsModule,
    AuthModule,
    PassportModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private readonly consoleService: AppService) {
  }
}
