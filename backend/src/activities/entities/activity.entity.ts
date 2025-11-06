import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';

export enum ActivityStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  BLOCKED = 'blocked',
}

export enum ActivityType {
  TASK = 'task',
  PROJECT = 'project',
  MILESTONE = 'milestone',
}

@Entity('activities')
export class Activity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'timestamp', name: 'start_date' })
  start: Date;

  @Column({ type: 'timestamp', name: 'end_date' })
  end: Date;

  @Column({ type: 'int', default: 0 })
  progress: number;

  @Column({
    type: 'enum',
    enum: ActivityStatus,
    default: ActivityStatus.TODO,
  })
  status: ActivityStatus;

  @Column({
    type: 'enum',
    enum: ActivityType,
    default: ActivityType.TASK,
  })
  type: ActivityType;

  @Column({ type: 'varchar', length: 50, nullable: true })
  color: string;

  @ManyToMany(() => Activity, (activity) => activity.dependents)
  @JoinTable({
    name: 'activity_dependencies',
    joinColumn: { name: 'activity_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'dependency_id', referencedColumnName: 'id' },
  })
  dependencies: Activity[]; // Activities that this task depends on

  @ManyToMany(() => Activity, (activity) => activity.dependencies)
  dependents: Activity[]; // Activities that depend on this task

  @Column({ type: 'int', default: 0 })
  order: number; // For sorting

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
