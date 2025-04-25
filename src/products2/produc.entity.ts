import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { User } from 'src/user/users.entity';
import { SizesEntity } from 'src/size/size.entity';

@Entity()
export class Producto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  genero: string;

  @Column()
  stock: number;

  @ManyToOne(() => User, (usuario) => usuario.productos, { nullable: true })
  userId?: User;

  @ManyToMany(() => SizesEntity, (size) => size.products)
  @JoinTable()
  sizes: SizesEntity[];
}
