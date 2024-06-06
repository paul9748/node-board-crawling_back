import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";
import { Posts } from "./Posts";

@Index("comment_no_UNIQUE", ["commentNo"], { unique: true })
@Index("FK_Post_TO_Comment_1", ["postNo"], {})
@Index("FK_User_TO_Comment_1", ["userNo"], {})
@Entity("Comment", { schema: "myboard" })
export class Comment {
  @PrimaryGeneratedColumn({
    type: "int",
    name: "comment_no",
    comment: "comment_no",
  })
  commentNo: number;

  @Column("int", { primary: true, name: "user_no", comment: "user_no" })
  userNo: number;

  @Column("int", { primary: true, name: "post_no", comment: "post_no" })
  postNo: number;

  @Column("varchar", {
    name: "comment_content",
    comment: "comment_content",
    length: 16000,
  })
  commentContent: string;

  @Column("timestamp", {
    name: "comment_creation_time",
    comment: "comment_creation_time",
    default: () => "CURRENT_TIMESTAMP",
  })
  commentCreationTime: Date;

  @ManyToOne(() => User, (user) => user.comments, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "user_no", referencedColumnName: "userNo" }])
  userNo2: User;

  @ManyToOne(() => Posts, (posts) => posts.comments, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "post_no", referencedColumnName: "postNo" }])
  postNo2: Posts;
}
