import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
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
    description: '날짜 받아서 이후 게시글 크롤링(db)',
  })
  @UseGuards(JwtServiceAuthGuard)
  @Get('test')
  async crawlRuliweb(@Query('date') dateString: string, @Query('siteName') siteName: string): Promise<any> {
    try {
      const result = await this.appService.crawlSite(dateString, siteName); // 함수를 호출하는 부분을 변경
      return result;
    }
    catch (e) { return e; }
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
    const result = await this.appService.performCrawler(date);
    return result;
  }
  @ApiBearerAuth()
  @ApiOperation({
    summary: '5분안의 게시글 크롤링(db활용)',
    description: '최근~-5분 사이의 게시글 크롤링 (루리웹)',
  })
  @UseGuards(JwtServiceAuthGuard)
  @Get('test1-3')
  async crawlRuliwebbydb(@Query('siteName') siteName: string): Promise<any> {
    const date = new Date();
    date.setMinutes(date.getMinutes() - 5);
    try {
      const result = await this.appService.crawlSite(date.toISOString(), siteName);
      return result;

    }
    catch (e) { return e; }
  }



  @ApiOperation({
    summary: '분석 조회',
    description: '키워드 기준 분석 정리 조회',
  })
  @ApiQuery({ name: 'keyword', required: true, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'startDate', required: false, type: String })
  @ApiQuery({ name: 'endDate', required: false, type: String })
  @ApiQuery({ name: 'siteNames', required: false, type: [String] })
  @Get('serchData')
  async Sentiment_analysis_data_aggregation(
    @Query('keyword') keyword: string,
    @Query('page') page?: number,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('siteNames') siteNames?: string[],
  ): Promise<any> {

    // 문자열을 Date 객체로 변환하고 유효성 검사
    const isValidDate = (dateString: string) => {
      const date = new Date(dateString);
      return !isNaN(date.getTime());
    };
    if (!page) {
      page = 0;
    }

    const startTime = startDate && isValidDate(startDate) ? new Date(startDate) : undefined;
    const endTime = endDate && isValidDate(endDate) ? new Date(endDate) : undefined;

    const result = {
      analysis: await this.appService.findDataWithKeywordAndFilters(keyword, startTime, endTime, siteNames),
      posts: await this.appService.findPostByKeyword(keyword, page, 10, startTime, endTime)
    };
    return result;
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: '크롤링 사이트 정보 출력',
    description: 'db상의 크롤링 대상 사이트 정보 출력(루리웹)',
  })
  @UseGuards(JwtServiceAuthGuard)
  @Get('SiteInfoList')
  async getSiteData(@Query('siteName') siteName: string): Promise<any> {
    return await this.appService.getSiteData(siteName);
  }
  @ApiBearerAuth()
  @ApiOperation({
    summary: '크롤링 플래그 설정',
    description: '크롤링 플래그를 설정한다',
  })
  @UseGuards(JwtServiceAuthGuard)
  @Get('setFlag')
  async setCrowlingFlag(): Promise<any> {
    return await this.appService.setCrowlingFlag();
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: '크롤링 시작',
    description: '크롤링 함수를 실행한다',
  })
  @UseGuards(JwtServiceAuthGuard)
  @Get('startCrawler')
  async startCrawler(): Promise<any> {
    this.appService.crawlingSchedul();
    return "Start crawling";
  }
  @ApiOperation({
    summary: '대상 사이트 목록 조회',
    description: '크롤링 대상 사이트 목록 조회',
  })
  @Get("siteNameList")
  async getSiteNameList(): Promise<any> {

    return await this.appService.getUseSiteNameList();
  }
}

