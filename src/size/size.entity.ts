import { Column, Entity, ManyToMany, PrimaryGeneratedColumn, JoinTable } from "typeorm";
import { Producto } from "src/products2/produc.entity";

@Entity('sizes')
export class SizesEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()

  genero: string;

  @Column()
  size_ecuador: string;

  @Column()
  size_usa: string;

  @Column()
  size_ue: string;

  @ManyToMany(() => Producto, (product) => product.sizes)
  products: Producto[];
}