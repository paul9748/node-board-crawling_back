import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Post } from "./Post";
import { User } from "./User";

@Index("comment_no_UNIQUE", ["commentNo"], { unique: true })
@Index("FK_User_TO_Comment_1", ["userNo"], {})
@Index("FK_Post_TO_Comment_1", ["postNo"], {})
@Entity("Comment", { schema: "myBoard" })
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

  @ManyToOne(() => Post, (post) => post.comments, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "post_no", referencedColumnName: "postNo" }])
  postNo2: Post;

  @ManyToOne(() => User, (user) => user.comments, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "user_no", referencedColumnName: "userNo" }])
  userNo2: User;
}