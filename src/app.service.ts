import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CrawledData } from './entities/CrawledData';
import { ruliwebBestCrawler } from 'community_crawler';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(CrawledData)
    private readonly crawledDataRepository: Repository<CrawledData>,
  ) { }

  getHello(): string {
    return 'Hello World!';
  }

  async performCrawler(): Promise<any> {
    try {
      // community_crawler를 사용하여 데이터를 가져옴
      const data = await ruliwebBestCrawler(new Date("2024-04-15T09:11:51.000Z"));

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
}
