import { Column, Entity, PrimaryGeneratedColumn,OneToMany } from "typeorm";
import { Producto } from "src/products2/produc.entity";
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  last_name: string;

  @Column()
  email: string;

  @Column()
  birthday: Date;

  @Column()
  identification: number;

  @OneToMany(() => Producto, (producto) => producto.userId) // Relación con Produ
  productos: Producto[]; // Esto es lo que deberías tener para la relación

}