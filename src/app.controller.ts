import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Get('test')
  async findAll(): Promise<any> {
    const result = await this.appService.performCrawler(); // 함수를 호출하는 부분을 변경
    return result;
  }
}

