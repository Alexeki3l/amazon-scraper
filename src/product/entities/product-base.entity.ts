import {
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class ProductBase {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  url: string;

  @CreateDateColumn()
  created_at: Date;

  //   @Column({ nullable: true, default: '' })
  @Column()
  category: string;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
