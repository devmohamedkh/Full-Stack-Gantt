import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  BeforeUpdate,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { compare, genSalt, hash } from 'bcrypt';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Activity } from '../../activities/entities/activity.entity';
import { RefreshToken } from '../../auth/entities/refresh-token.entity';

export enum UserRole {
  EMPLOYEE = 'employee',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin',
}

@Entity('users')
export class User {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ length: 255 })
  name: string;

  @ApiProperty()
  @Column({ length: 255 })
  email: string;

  @ApiProperty()
  @Exclude()
  @Column({ select: false })
  password: string;

  @ApiProperty({ enum: UserRole })
  @Column({ type: 'enum', enum: UserRole, default: UserRole.EMPLOYEE })
  role: UserRole;

  @ApiProperty({ required: false })
  @Column({ length: 20, nullable: true })
  phone: string;

  @ApiProperty({ required: false })
  @Column({ type: 'text', nullable: true })
  address: string;

  @ApiProperty({ required: false })
  @Column({ type: 'text', nullable: true })
  personalId: string;

  @ApiProperty({
    type: () => [Number],
    required: false,
    description: 'Activities created by this user',
  })
  @OneToMany(() => Activity, (activity) => activity.createdBy)
  createdActivities?: Activity[];

  @OneToMany(() => RefreshToken, (token) => token.user)
  refreshTokens?: RefreshToken[];

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    if (this.password) {
      const salt = await genSalt(10);
      this.password = await hash(this.password, salt);
    }
  }

  async validatePassword(password: string): Promise<boolean> {
    return compare(password, this.password);
  }
}
