import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { CrawledData } from './entities/CrawledData';
import { SiteList } from './entities/SiteList';
import { ruliwebBestCrawler, Crawler } from 'community_crawler';
import { CrawlOptions } from "community_crawler/types"

// import { Cron } from '@nestjs/schedule';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(CrawledData)
    private readonly crawledDataRepository: Repository<CrawledData>,
    @InjectRepository(SiteList)
    private readonly siteListRepository: Repository<SiteList>
  ) { }

  getHello(): string {
    return 'Hello World!';
  }

  async performCrawler(date: Date): Promise<any> {
    try {
      // community_crawler를 사용하여 데이터를 가져옴
      const data = await ruliwebBestCrawler(date);

      // 가져온 데이터를 CrawledData 엔터티에 저장
      for (const item of data) {
        const crawledData = new CrawledData();
        crawledData.siteName = 'ruliweb';
        crawledData.title = item.title;
        crawledData.link = item.link;
        crawledData.author = item.author;
        crawledData.views = parseInt(item.views); // 숫자형으로 변환
        crawledData.upvotes = parseInt(item.upvotes); // 숫자형으로 변환
        crawledData.content = item.content;
        crawledData.contentText = item.data.join(" ");
        crawledData.commentCount = parseInt(item.commentCount); // 숫자형으로 변환
        crawledData.timestamp = new Date(item.timestamp);
        crawledData.processed = 1; // processed 필드에 1 일괄 지정
        crawledData.processedData = item.data2; // processed_data 필드에 가져온 데이터의 data2 지정

        // 데이터 저장
        await this.crawledDataRepository.save(crawledData);
      }

      // 저장된 데이터를 조회하여 반환
      // const savedData = await this.crawledDataRepository.find();
      return data;
    } catch (error) {
      console.error('Error performing crawler:', error);
      throw error;
    }
  }

  async performCrawler2(options: CrawlOptions): Promise<any> {
    try {
      // community_crawler를 사용하여 데이터를 가져옴
      const data = await Crawler(options);

      // 가져온 데이터를 CrawledData 엔터티에 저장
      for (const item of data) {
        const crawledData = new CrawledData();
        crawledData.siteName = 'ruliweb';
        crawledData.title = item.title;
        crawledData.link = item.link;
        crawledData.author = item.author;
        crawledData.views = parseInt(item.views); // 숫자형으로 변환
        crawledData.upvotes = parseInt(item.upvotes); // 숫자형으로 변환
        crawledData.content = item.content;
        crawledData.contentText = item.data.join(" ");
        crawledData.commentCount = parseInt(item.commentCount); // 숫자형으로 변환
        crawledData.timestamp = new Date(item.timestamp);
        crawledData.processed = 1; // processed 필드에 1 일괄 지정
        crawledData.processedData = item.data2; // processed_data 필드에 가져온 데이터의 data2 지정

        // 데이터 저장
        await this.crawledDataRepository.save(crawledData);
      }

      // 저장된 데이터를 조회하여 반환
      // const savedData = await this.crawledDataRepository.find();
      return data;
    } catch (error) {
      console.error('Error performing crawler:', error);
      throw error;
    }
  }



  async findDataWithKeyword(keyword: string): Promise<any> {
    const keywordLike = `%${keyword}%`;
    const query = `
      WITH KeyValues AS (
          SELECT 
              jt.key_columns,
              JSON_UNQUOTE(JSON_EXTRACT(cd.processed_data, CONCAT('$.label_ratios."', jt.key_columns, '"'))) AS val_column
          FROM 
              Crawled_Data cd,
              JSON_TABLE(
                  JSON_KEYS(cd.processed_data->'$.label_ratios'),
                  "$[*]" COLUMNS (
                      key_columns VARCHAR(50) PATH '$'
                  )
              ) AS jt
          WHERE
              cd.content_text LIKE ?
      ),
      TotalSum AS (
          SELECT 
              SUM(CAST(val_column AS DECIMAL(10,2))) AS total_sum
          FROM 
              KeyValues
      )
      SELECT 
          kv.key_columns,
          SUM(CAST(kv.val_column AS DECIMAL(10,2))) AS total_val_columns,
          SUM(CAST(kv.val_column AS DECIMAL(10,2))) / ts.total_sum * 100 AS percent_total,
          ts.total_sum
      FROM 
          KeyValues kv,
          TotalSum ts
      GROUP BY
          kv.key_columns, ts.total_sum
    `;

    // 매개변수를 배열로 전달
    return await this.crawledDataRepository.query(query, [keywordLike]);
  }

  async findpostbykeyword(keyword: string, page: number, take: number): Promise<any> {
    return await this.crawledDataRepository.find({
      where: { contentText: Like(`%${keyword}%`) }, take: take, skip: page,
    });

  }
  async getlestCrawledData(siteName: string): Promise<Date> {
    const latestRuliwebColumn = await this.crawledDataRepository
      .createQueryBuilder("entity")
      .where("entity.site_name = :siteName", { siteName: siteName })
      .orderBy("entity.timestamp", "DESC") // 최신 컬럼을 가져오기 위해 생성일 기준으로 내림차순 정렬
      .getOne();


    return latestRuliwebColumn.timestamp;

  }

  // @Cron('*/5 * * * *')
  // async handleCron() {
  //   await this.performCrawler(await this.getlestCrawledData('ruliweb')); // 함수를 호출하는 부분을 변경
  //   console.log('루리웹 크롤링');
  // }
  private readonly logger = new Logger(AppService.name);

  async crawlingSchedul() {
    if (!this.specialFlag) return {}
    const randomInterval = Math.floor(Math.random() * 5) + 6; // 1에서 10까지의 랜덤한 숫자 생성
    // this.logger.log(await this.getlestCrawledData('ruliweb'));
    await this.performCrawler(await this.getlestCrawledData('ruliweb')); // 함수를 호출하는 부분을 변경
    this.logger.log('루리웹 크롤링');
    this.logger.log(`Next crawling in ${randomInterval} minutes.`);
    setTimeout(() => {
      this.logger.log(`Crawling after ${randomInterval} minutes.`);
      this.crawlingSchedul(); // 다음 메시지 예약
    }, randomInterval * 60 * 1000); // 밀리초로 변환
  }

  async getTestData() {
    const ruliwebDataInfo = await this.siteListRepository.findOne({ where: { siteName: 'ruliweb' } })
    return ruliwebDataInfo;
  }
  private specialFlag: boolean = false;
  setCrowlingFlag() {
    this.specialFlag = !this.specialFlag;
    return this.specialFlag
  }
}
