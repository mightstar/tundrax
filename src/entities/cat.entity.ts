import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Cat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column("int")
  age: number;

  @Column({ length: 100 })
  breed: string;

  @ManyToMany(() => User, (user) => user.favourites)
  users: User[];
}
