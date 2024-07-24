import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, JoinColumn, ManyToOne } from "typeorm";
import { User } from "./user.models";

enum RepairsStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

@Entity()
export class Repairs extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'date',
    nullable: false
  })
  date: Date;

  @Column({
    type: 'int', 
    nullable: true
  })
  motorsNumber: number;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true
  })
  description: string; 

  @Column({
    type: 'enum',
    enum: RepairsStatus,
    default: RepairsStatus.PENDING,
    nullable: false
  })
  repairStatus: RepairsStatus;

  @ManyToOne(() => User, (user) => user.repairs)
  @JoinColumn({ name: 'user_id' }) 
  user: User; 

  @CreateDateColumn()
  created_at: Date; 

  @UpdateDateColumn()
  updated_at: Date; 
}
