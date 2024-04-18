import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Get('test')
  async crawlRuliweb(@Query('date') date: string): Promise<any> {
    const result = await this.appService.performCrawler(new Date(date)); // 함수를 호출하는 부분을 변경
    return result;
  }
  @Get('test1-1')
  async crawlRuliwebbydate(): Promise<any> {
    const result = await this.appService.performCrawler(await this.appService.getlestCrawledData('ruliweb')); // 함수를 호출하는 부분을 변경
    return result;
  }
  @Get('test2')
  async Sentiment_analysis_data_aggregation(@Query('date') date: string): Promise<any> {
    const result = await this.appService.findDataWithKeyword(date); // 함수를 호출하는 부분을 변경
    return result;
  }


}

