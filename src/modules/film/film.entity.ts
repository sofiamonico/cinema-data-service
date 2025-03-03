import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsArray,
  IsUrl,
} from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Film {
  constructor(init?: Film) {
    Object.assign(this, init);
  }

  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  @IsNotEmpty()
  @IsString()
  title: string;

  @Column()
  @IsNotEmpty()
  @IsNumber()
  episode_id: number;

  @Column('text')
  @IsNotEmpty()
  @IsString()
  opening_crawl: string;

  @Column()
  @IsNotEmpty()
  @IsString()
  director: string;

  @Column()
  @IsNotEmpty()
  @IsString()
  producer: string;

  @Column('date')
  @IsDateString()
  @IsNotEmpty()
  release_date: string;

  @IsOptional()
  @Column('text', { array: true, nullable: true })
  @IsArray()
  @IsString({ each: true })
  species?: string[];

  @IsOptional()
  @Column('text', { array: true, nullable: true })
  @IsArray()
  @IsString({ each: true })
  starships?: string[];

  @IsOptional()
  @Column('text', { array: true, nullable: true })
  @IsArray()
  @IsString({ each: true })
  vehicles?: string[];

  @Column('text', { array: true })
  @IsArray()
  @IsString({ each: true })
  characters: string[];

  @IsOptional()
  @Column('text', { array: true, nullable: true })
  @IsArray()
  @IsString({ each: true })
  planets?: string[];

  @Column()
  @IsNotEmpty()
  @IsUrl()
  url: string;

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;
}
