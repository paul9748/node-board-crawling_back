import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtServiceAuthGuard } from 'src/auth/JwtServiceAuthGuard';
import { CrawlOptions } from "community_crawler/types"
import { query } from 'express';


@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @ApiBearerAuth()
  @ApiOperation({
    summary: '크롤링 테스트',
    description: '날짜 받아서 이후 게시글 크롤링',
  })
  @UseGuards(JwtServiceAuthGuard)
  @Get('test')
  async crawlRuliweb(@Query('date') date: string): Promise<any> {
    const result = await this.appService.performCrawler(new Date(date)); // 함수를 호출하는 부분을 변경
    return result;
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: '최근수집 이후 크롤링',
    description: '최근수집된 게시글 이후 크롤링 (루리웹)',
  })
  @UseGuards(JwtServiceAuthGuard)
  @Get('test1-1')
  async crawlRuliwebbydate(): Promise<any> {
    const result = await this.appService.performCrawler(await this.appService.getlestCrawledData('ruliweb')); // 함수를 호출하는 부분을 변경
    return result;
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: '5분안의 게시글 크롤링',
    description: '최근~-5분 사이의 게시글 크롤링 (루리웹)',
  })
  @UseGuards(JwtServiceAuthGuard)
  @Get('test1-2')
  async crawlRuliwebbynow(): Promise<any> {
    const date = new Date();
    date.setMinutes(date.getMinutes() - 5);
    const result = await this.appService.performCrawler(date); // 함수를 호출하는 부분을 변경
    return result;
  }
  @ApiBearerAuth()
  @ApiOperation({
    summary: '5분안의 게시글 크롤링(db활용)',
    description: '최근~-5분 사이의 게시글 크롤링 (루리웹)',
  })
  @UseGuards(JwtServiceAuthGuard)
  @Get('test1-3')
  async crawlRuliwebbydb(): Promise<any> {
    const date = new Date();
    date.setMinutes(date.getMinutes() - 5);
    const data = await this.appService.getTestData();
    const options: CrawlOptions = {
      postListUrl: data.link,
      pageQueryParam: data.pageQueryParam,
      selectors: {
        title: data.title,
        postLink: data.postLink,
        author: data.author,
        views: data.views,
        upvotes: data.upvotes,
        content: data.commentCount,
        commentCount: data.commentCount,
        timestamp: data.commentCount,
      },
      options: {
        timestamp: RegExp(data.timestampRegexp),
        views: RegExp(data.viewsRegexp),
      },
      referenceTime: date,

    };

    const result = await this.appService.performCrawler2(options); // 함수를 호출하는 부분을 변경
    return result;
  }


  @ApiOperation({
    summary: '분석 조회',
    description: '키워드 기준 분석 정리 조회',
  })
  @Get('test2')
  async Sentiment_analysis_data_aggregation(@Query('keyword') keyword: string): Promise<any> {
    const result = { analysis: await this.appService.findDataWithKeyword(keyword), posts: await this.appService.findpostbykeyword(keyword, 0, 10) }; // 함수를 호출하는 부분을 변경
    return result;
  }

  @ApiOperation({
    summary: '분석 조회2',
    description: '키워드 기준 게시글 조회',
  })
  @Get('test2-1')
  async get_page(@Query('keyword') keyword: string, @Query('page') page: number): Promise<any> {
    const result = { analysis: await this.appService.findDataWithKeyword(keyword), posts: await this.appService.findpostbykeyword(keyword, page, 10) }; // 함수를 호출하는 부분을 변경
    return result;
  }


  @ApiBearerAuth()
  @ApiOperation({
    summary: '크롤링 사이트 정보 출력',
    description: 'db상의 크롤링 대상 사이트 정보 출력(루리웹)',
  })
  @UseGuards(JwtServiceAuthGuard)
  @Get('test3')
  async getSiteData(): Promise<any> {
    return await this.appService.getTestData();
  }
  @ApiBearerAuth()
  @ApiOperation({
    summary: '크롤링 플래그 설정',
    description: '크롤링 플래그를 설정한다',
  })
  @UseGuards(JwtServiceAuthGuard)
  @Get('test4')
  async setCrowlingFlag(): Promise<any> {
    return await this.appService.setCrowlingFlag();
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: '크롤링 시작',
    description: '크롤링 함수를 실행한다',
  })
  @UseGuards(JwtServiceAuthGuard)
  @Get('test5')
  async startCrawler(): Promise<any> {
    this.appService.crawlingSchedul();
    return "Start crawling";
  }


}

