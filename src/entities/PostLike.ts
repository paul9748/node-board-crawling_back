import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Posts } from "./Posts";
import { User } from "./User";

@Index("user_no", ["userNo"], {})
@Entity("Post_like", { schema: "myBoard" })
export class PostLike {
  @Column("int", { primary: true, name: "post_no" })
  postNo: number;

  @Column("int", { primary: true, name: "user_no" })
  userNo: number;

  @Column("timestamp", {
    name: "created_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date | null;

  @ManyToOne(() => Posts, (posts) => posts.postLikes2, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "post_no", referencedColumnName: "postNo" }])
  postNo2: Posts;

  @ManyToOne(() => User, (user) => user.postLikes, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "user_no", referencedColumnName: "userNo" }])
  userNo2: User;
}
