import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("Crawled_Data", { schema: "myBoard" })
export class CrawledData {
  @PrimaryGeneratedColumn({ type: "int", name: "data_no" })
  dataNo: number;

  @Column("char", { name: "site_name", length: 45 })
  siteName: string;

  @Column("text", { name: "link" })
  link: string;

  @Column("text", { name: "title" })
  title: string;

  @Column("text", { name: "author" })
  author: string;

  @Column("int", { name: "views" })
  views: number;

  @Column("int", { name: "upvotes" })
  upvotes: number;

  @Column("text", { name: "content" })
  content: string;

  @Column("text", { name: "content_text", nullable: true })
  contentText: string | null;

  @Column("int", { name: "comment_count" })
  commentCount: number;

  @Column("datetime", { name: "timestamp" })
  timestamp: Date;

  @Column("datetime", {
    name: "crawled_time",
    default: () => "CURRENT_TIMESTAMP",
  })
  crawledTime: Date;

  @Column("tinyint", { name: "processed" })
  processed: number;

  @Column("json", { name: "processed_data", nullable: true })
  processedData: object | null;
}
