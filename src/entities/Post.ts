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
import { BoardList } from "./BoardList";
import { User } from "./User";

@Index("FK_User_TO_Post_1", ["userNo"], {})
@Index("FK_Board_list_TO_Post_1", ["boardNo"], {})
@Entity("Post", { schema: "myBoard" })
export class Post {
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

  @OneToMany(() => Comment, (comment) => comment.postNo2)
  comments: Comment[];

  @ManyToOne(() => BoardList, (boardList) => boardList.posts, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "board_no", referencedColumnName: "boardNo" }])
  boardNo2: BoardList;

  @ManyToOne(() => User, (user) => user.posts, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "user_no", referencedColumnName: "userNo" }])
  userNo2: User;
}
