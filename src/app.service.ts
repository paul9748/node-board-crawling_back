import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Like, Repository } from 'typeorm';
import { CrawledData } from './entities/CrawledData';
import { SiteList } from './entities/SiteList';
import { Crawler } from '@paul9748/community_crawler';
// import { crawlCommunityPosts } from '@paul9748/community_crawler/dist/crawler';
import { CrawlOptions } from "@paul9748/community_crawler";

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


  async performCrawler2(options: CrawlOptions, siteName: string): Promise<any> {
    try {
      // @paul9748/community_crawler를 사용하여 데이터를 가져옴
      const data = await Crawler(options);
      // 가져온 데이터를 CrawledData 엔터티에 저장
      for (const item of data) {
        const crawledData = new CrawledData();
        crawledData.siteName = siteName;
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
      //
      return data;
    } catch (error) {
      console.error('Error performing crawler:', error);
      throw error;
    }
  }



  // async rawDataTest(options: CrawlOptions, siteName: string):Promise<any>{
  //   const data = await crawlCommunityPosts(options);
  //   return data
  // }

  // async findDataWithKeyword(keyword: string): Promise<any> {
  //   const keywordLike = `%${keyword}%`;
  //   const query = `
  //     WITH KeyValues AS (
  //         SELECT
  //             jt.key_columns,
  //             CAST(JSON_UNQUOTE(JSON_EXTRACT(cd.processed_data, CONCAT('$.label_ratios."', jt.key_columns, '"'))) AS DECIMAL(10,2)) AS val_column
  //         FROM
  //             Crawled_Data cd
  //         CROSS JOIN
  //             JSON_TABLE(
  //                 JSON_KEYS(cd.processed_data->'$.label_ratios'),
  //                 "$[*]" COLUMNS (
  //                     key_columns VARCHAR(50) PATH '$'
  //                 )
  //             ) AS jt
  //         WHERE
  //             cd.content_text LIKE ?
  //     ),
  //     TotalSum AS (
  //         SELECT
  //             SUM(val_column) AS total_sum
  //         FROM
  //             KeyValues
  //     )
  //     SELECT
  //         kv.key_columns,
  //         SUM(kv.val_column) AS total_val_columns,
  //         (SUM(kv.val_column) / ts.total_sum) * 100 AS percent_total,
  //         ts.total_sum
  //     FROM
  //         KeyValues kv
  //     CROSS JOIN
  //         TotalSum ts
  //     GROUP BY
  //         kv.key_columns, ts.total_sum
  //   `;

  //   // 매개변수를 배열로 전달하여 SQL 인젝션 방지
  //   return await this.crawledDataRepository.query(query, [keywordLike]);
  // }
  async findDataWithKeywordAndFilters(
    keyword: string,
    startTime?: Date,
    endTime?: Date,
    siteNames: string[] = []
  ): Promise<any> {
    const keywordLike = `%${keyword}%`;
    if (typeof siteNames === 'string') {
      siteNames = [siteNames];
    }
    let query = `
  WITH KeyValues AS (
      SELECT
          jt.key_columns,
          CAST(JSON_UNQUOTE(JSON_EXTRACT(cd.processed_data, CONCAT('$.label_ratios."', jt.key_columns, '"'))) AS DECIMAL(10,2)) AS val_column
      FROM
          Crawled_Data cd
      CROSS JOIN
          JSON_TABLE(
              JSON_KEYS(cd.processed_data->'$.label_ratios'),
              "$[*]" COLUMNS (
                  key_columns VARCHAR(50) PATH '$'
              )
          ) AS jt
      WHERE
          cd.content_text LIKE ?
  `;

    const params: any[] = [keywordLike];

    if (startTime) {
      query += ' AND cd.timestamp >= ?';
      params.push(startTime); // ISO 형식으로 변환
    }

    if (endTime) {
      query += ' AND cd.timestamp <= ?';
      params.push(endTime); // ISO 형식으로 변환
    }
    console.log(siteNames);

    if (siteNames.length > 0) {
      const placeholders = siteNames.map(() => '?').join(',');
      query += ` AND cd.site_name IN (${placeholders})`;
      params.push(...siteNames);
    }
    query += `
  ),
  TotalSum AS (
      SELECT
          SUM(val_column) AS total_sum
      FROM
          KeyValues
  )
  SELECT
      kv.key_columns,
      SUM(kv.val_column) AS total_val_columns,
      (SUM(kv.val_column) / ts.total_sum) * 100 AS percent_total,
      ts.total_sum
  FROM
      KeyValues kv
  CROSS JOIN
      TotalSum ts
  GROUP BY
      kv.key_columns, ts.total_sum
  `;

    // 매개변수를 배열로 전달하여 SQL 인젝션 방지
    // console.log(query, params);
    return await this.crawledDataRepository.query(query, params);
  }






  async findPostByKeyword(keyword: string, page: number, take: number, startTime?: Date, endTime?: Date): Promise<any> {
    const whereCondition: any = {
      contentText: Like(`%${keyword}%`),
    };

    if (startTime && endTime) {
      whereCondition.timestamp = Between(startTime, endTime);
    }
    const order: any = { timestamp: 'DESC' };
    const totalCount = await this.crawledDataRepository.count({ where: whereCondition });
    const maxPage = Math.ceil(totalCount / take) - 1; // 0부터 시작하는 최대 페이지 인덱스

    if (page > maxPage) {
      return [];
    }

    const skip = page * take;

    return await this.crawledDataRepository.find({
      where: whereCondition,
      select: {
        title: true,
        link: true,
        siteName: true,
        contentText: true,
        timestamp: true,
      },
      order: order,
      take: take,
      skip: skip,
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
    const siteNameList = await this.getUseSiteNameList()
    for (const siteName of siteNameList) {
      const lastCrawledDate = await this.getlestCrawledData(siteName.siteName);
      await this.crawlSite(lastCrawledDate.toISOString(), siteName.siteName);
    }
    this.logger.log(`사이트 크롤링${siteNameList}`);
    this.logger.log(`Next crawling in ${randomInterval} minutes.`);
    setTimeout(() => {
      this.logger.log(`Crawling after ${randomInterval} minutes.`);
      this.crawlingSchedul(); // 다음 메시지 예약
    }, randomInterval * 60 * 1000); // 밀리초로 변환
  }

  async getSiteData(siteName: string) {
    const DataInfo = await this.siteListRepository.findOne({ where: { siteName: siteName } })
    return DataInfo;
  }
  private specialFlag: boolean = false;
  setCrowlingFlag() {
    this.specialFlag = !this.specialFlag;
    return this.specialFlag
  }

  async crawlSite(dateString: string, siteName: string) {
    const date = new Date(dateString);
    const data = await this.getSiteData(siteName);
    if (data == null) {
      throw new Error("siteData is null");
    }
    const options: CrawlOptions = {
      postListUrl: data.link,
      pageQueryParam: data.pageQueryParam,
      selectors: {
        title: data.title,
        postLink: data.postLink,
        startpage: data.startpage,
        author: data.author,
        views: data.views,
        upvotes: data.upvotes,
        content: data.content,
        commentCount: data.commentCount,
        timestamp: data.timestamp,
      },
      options: {
        title: RegExp(data.titleRegexp, 'g'),
        author: RegExp(data.authorRegexp, 'g'),
        views: RegExp(data.viewsRegexp, 'g'),
        upvotes: RegExp(data.upvotesRegexp, 'g'),
        content: RegExp(data.contentRegexp, 'g'),
        commentCount: RegExp(data.commentCountRegexp, 'g'),
        timestamp: RegExp(data.timestampRegexp),
      },
      referenceTime: date,

    };
    try {
      const result = await this.performCrawler2(options, siteName); // 함수를 호출하는 부분을 변경
      return result;

    }
    catch (e) { return e; }
  }
  async getUseSiteNameList() {
    //find use == 1 slect siteName
    return await this.siteListRepository.find({ where: { use: 1 }, select: { siteName: true } });
  }

}


