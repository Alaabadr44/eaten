import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class SystemLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  adminId: string;

  @Column()
  action: string;

  @Column({ type: 'text', nullable: true })
  details: string;

  @Column({ nullable: true })
  targetEntity: string;

  @Column({ nullable: true })
  targetId: string;

  @CreateDateColumn()
  createdAt: Date;
}
