import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Comment } from "./Comment";
import { PostLike } from "./PostLike";
import { User } from "./User";
import { BoardList } from "./BoardList";

@Index("FK_Board_list_TO_Post_1", ["boardNo"], {})
@Index("FK_User_TO_Post_1", ["userNo"], {})
@Entity("Posts", { schema: "myboard" })
export class Posts {
  @PrimaryGeneratedColumn({ type: "int", name: "post_no", comment: "post_no" })
  postNo: number;

  @Column("int", { primary: true, name: "user_no", comment: "user_no" })
  userNo: number;

  @Column("int", { primary: true, name: "board_no" })
  boardNo: number;

  @Column("varchar", { name: "post_title", length: 45 })
  postTitle: string;

  @Column("varchar", {
    name: "post_content",
    comment: "post_content",
    length: 16000,
  })
  postContent: string;

  @Column("timestamp", {
    name: "post_creation_time",
    comment: "post_creation_time",
    default: () => "CURRENT_TIMESTAMP",
  })
  postCreationTime: Date;

  @Column("int", { name: "post_views", default: () => "'0'" })
  postViews: number;

  @Column("int", { name: "post_activate", default: () => "'0'" })
  postActivate: number;

  @Column("int", { name: "post_likes", nullable: true, default: () => "'0'" })
  postLikes: number | null;

  @OneToMany(() => Comment, (comment) => comment.postNo2)
  comments: Comment[];

  @OneToMany(() => PostLike, (postLike) => postLike.postNo2)
  postLikes2: PostLike[];

  @ManyToOne(() => User, (user) => user.posts, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "user_no", referencedColumnName: "userNo" }])
  userNo2: User;

  @ManyToOne(() => BoardList, (boardList) => boardList.posts, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "board_no", referencedColumnName: "boardNo" }])
  boardNo2: BoardList;
}
