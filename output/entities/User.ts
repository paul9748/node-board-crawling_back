import {
  Column,
  Entity,
  Index,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Comment } from "./Comment";
import { Post } from "./Post";

@Index("user_no_UNIQUE", ["userNo"], { unique: true })
@Entity("User", { schema: "myBoard" })
export class User {
  @PrimaryGeneratedColumn({ type: "int", name: "user_no", comment: "user_no" })
  userNo: number;

  @Column("varchar", { name: "user_id", comment: "user_id", length: 45 })
  userId: string;

  @Column("varchar", { name: "user_pw", comment: "user_pw", length: 45 })
  userPw: string;

  @Column("varchar", { name: "user_email", comment: "user_email", length: 45 })
  userEmail: string;

  @Column("timestamp", {
    name: "user_join_date",
    default: () => "CURRENT_TIMESTAMP",
  })
  userJoinDate: Date;

  @OneToMany(() => Comment, (comment) => comment.userNo2)
  comments: Comment[];

  @OneToMany(() => Post, (post) => post.userNo2)
  posts: Post[];

  @ManyToMany(() => Post, (post) => post.users)
  posts2: Post[];
}
