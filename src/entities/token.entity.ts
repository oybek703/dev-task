import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity({ name: 'tokens' })
export class Token {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ nullable: false })
  user_id: string

  @Column({ type: 'datetime' })
  created_at: Date

  @Column({ type: 'datetime' })
  expires_at: Date
}
