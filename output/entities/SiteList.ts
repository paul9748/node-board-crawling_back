import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("Site_list", { schema: "myBoard" })
export class SiteList {
  @PrimaryGeneratedColumn({ type: "int", name: "site_no" })
  siteNo: number;

  @Column("char", { name: "site_name", length: 45 })
  siteName: string;

  @Column("text", { name: "link" })
  link: string;

  @Column("text", { name: "page query param" })
  pageQueryParam: string;

  @Column("text", { name: "title" })
  title: string;

  @Column("text", { name: "post_link" })
  postLink: string;

  @Column("text", { name: "author" })
  author: string;

  @Column("text", { name: "views" })
  views: string;

  @Column("text", { name: "upvotes" })
  upvotes: string;

  @Column("text", { name: "content" })
  content: string;

  @Column("text", { name: "comment_count" })
  commentCount: string;

  @Column("text", { name: "timestamp" })
  timestamp: string;

  @Column("text", { name: "link_regexp", nullable: true })
  linkRegexp: string | null;

  @Column("text", { name: "title_regexp", nullable: true })
  titleRegexp: string | null;

  @Column("text", { name: "author_regexp", nullable: true })
  authorRegexp: string | null;

  @Column("text", { name: "views_regexp", nullable: true })
  viewsRegexp: string | null;

  @Column("text", { name: "upvotes_regexp", nullable: true })
  upvotesRegexp: string | null;

  @Column("text", { name: "content_regexp", nullable: true })
  contentRegexp: string | null;

  @Column("text", { name: "comment_count_regexp", nullable: true })
  commentCountRegexp: string | null;

  @Column("text", { name: "timestamp_regexp" })
  timestampRegexp: string;
}
