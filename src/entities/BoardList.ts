import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Posts } from "./Posts";

@Index("board_no_UNIQUE", ["boardNo"], { unique: true })
@Entity("Board_list", { schema: "myBoard" })
export class BoardList {
  @PrimaryGeneratedColumn({ type: "int", name: "board_no" })
  boardNo: number;

  @Column("varchar", { name: "board_name", nullable: true, length: 45 })
  boardName: string | null;

  @Column("int", { name: "board_permission", default: () => "'0'" })
  boardPermission: number;

  @OneToMany(() => Posts, (posts) => posts.boardNo2)
  posts: Posts[];
}
