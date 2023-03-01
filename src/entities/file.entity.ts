import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity({ name: 'files' })
export class File {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ nullable: false })
  name: string

  @Column({ nullable: false })
  extension: string

  @Column({ nullable: false })
  mime_type: string

  @Column({ nullable: false, type: 'float' })
  size: number

  @Column({ nullable: false, type: 'datetime' })
  upload_time: Date
}
