import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { User } from "./User";

@Entity("User_auth", { schema: "myBoard" })
export class UserAuth {
  @Column("int", { primary: true, name: "user_no" })
  userNo: number;

  @Column("varchar", { primary: true, name: "user_auth_tokken", length: 45 })
  userAuthTokken: string;

  @ManyToOne(() => User, (user) => user.userAuths, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "user_no", referencedColumnName: "userNo" }])
  userNo2: User;
}
