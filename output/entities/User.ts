import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Comment } from "./Comment";
import { PostLike } from "./PostLike";
import { Posts } from "./Posts";
import { UserAuth } from "./UserAuth";

@Index("user_no_UNIQUE", ["userNo"], { unique: true })
@Entity("User", { schema: "myboard" })
export class User {
  @PrimaryGeneratedColumn({ type: "int", name: "user_no", comment: "user_no" })
  userNo: number;

  @Column("varchar", { name: "user_id", comment: "user_id", length: 45 })
  userId: string;

  @Column("varchar", { name: "user_pw", comment: "user_pw", length: 100 })
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

  @OneToMany(() => PostLike, (postLike) => postLike.userNo2)
  postLikes: PostLike[];

  @OneToMany(() => Posts, (posts) => posts.userNo2)
  posts: Posts[];

  @OneToMany(() => UserAuth, (userAuth) => userAuth.userNo2)
  userAuths: UserAuth[];
}
