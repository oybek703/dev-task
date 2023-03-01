import { Column, Entity } from 'typeorm'

@Entity({ name: 'users' })
export class User {
  @Column({ unique: true, primary: true })
  id: string

  @Column({ nullable: false })
  password: string
}
