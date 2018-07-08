import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'
import { BaseEntity } from 'typeorm/repository/BaseEntity'
import { IsString, IsIn, MaxLength } from 'class-validator';

const colors = ["red", "blue", "green", "yellow", "magenta"]

@Entity()
export default class Game extends BaseEntity {

  @PrimaryGeneratedColumn()
  id?: number

  @IsString()
  @MaxLength(25)
  @Column('text', {nullable:false})
  name: string

  @IsIn(colors)
  @Column('text', {nullable:false})
  color: string

  @Column('json')
  board: string[][]
}