import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from './produc.entity';
import { CreadDTO } from './product.dto';
import { SizesEntity } from 'src/size/size.entity';
import { User } from 'src/user/users.entity';

@Injectable()
export class Products2Service {
  constructor(
    @InjectRepository(Producto)
    private proRepository: Repository<Producto>,

    @InjectRepository(SizesEntity)
    private sizeRepository: Repository<SizesEntity>,

    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // Obtener todos los productos
  async findAll(): Promise<Producto[]> {
    return this.proRepository.find({
      relations: ['sizes', 'userId'],
    });
  }

  // Obtener un producto por ID
  async findOne(id: number): Promise<Producto> {
    const producto = await this.proRepository.findOne({
      where: { id },
      relations: ['sizes', 'userId'],
    });

    if (!producto) {
      throw new NotFoundException(`Producto con ID: ${id} no encontrado`);
    }

    return producto;
  }

  // Contar productos por talla
  async countProductsBySize(sizeLabel: string): Promise<number> {
    const count = await this.proRepository
      .createQueryBuilder('producto')
      .leftJoin('producto.sizes', 'size')
      .where('size.size_ecuador = :sizeLabel', { sizeLabel })
      .getCount();

    return count;
  }

  // Crear un nuevo producto
  async create(proDTO: CreadDTO): Promise<Producto> {
    const conversiones: Record<string, Record<string, { usa: string; Ecuador: string; UE: string }>> = {
      hombre: {
        XS: { usa: "36", Ecuador: "S", UE: "46" },
        S:  { usa: "38", Ecuador: "M",  UE: "48" },
        M:  { usa: "40", Ecuador: "L",  UE: "50" },
        L:  { usa: "42", Ecuador: "XL", UE: "52" },
        XL: { usa: "44", Ecuador: "XXL",UE: "54" },
        XXL:{ usa: "46", Ecuador: "XXXL",UE: "56" },
      },
      mujer: {
        XS: { usa: "34", Ecuador: "XS", UE: "44" },
        S:  { usa: "36", Ecuador: "S",  UE: "46" },
        M:  { usa: "38", Ecuador: "M",  UE: "48" },
        L:  { usa: "40", Ecuador: "L",  UE: "50" },
        XL: { usa: "42", Ecuador: "XL", UE: "52" },
        XXL:{ usa: "44", Ecuador: "XXL",UE: "54" },
      },
      niño: {
        XS: { usa: "4T", Ecuador: "4", UE: "104" },
        S:  { usa: "6",  Ecuador: "6", UE: "110" },
        M:  { usa: "8",  Ecuador: "8", UE: "116" },
        L:  { usa: "10", Ecuador: "10", UE: "122" },
        XL: { usa: "12", Ecuador: "12", UE: "128" },
        XXL:{ usa: "14", Ecuador: "14", UE: "134" }
      }
    };

    const user = await this.userRepository.findOneBy({ id: proDTO.userId });
    if (!user) {
      throw new NotFoundException(`Usuario con ID: ${proDTO.userId} no encontrado`);
    }

    const sizes: SizesEntity[] = [];

    for (const label of proDTO.sizes) {
      let talla = await this.sizeRepository.findOne({
        where: {
          size_ecuador: label,
          genero: proDTO.genero,
        },
      });

      if (!talla) {
        const valores = conversiones[proDTO.genero]?.[label];
        if (!valores) {
          throw new NotFoundException(`Talla desconocida: ${label}`);
        }

        talla = this.sizeRepository.create({
          genero: proDTO.genero,
          size_ecuador: valores.Ecuador,
          size_usa: valores.usa,
          size_ue: valores.UE,
        });

        await this.sizeRepository.save(talla);
      }

      sizes.push(talla);
    }

    const producto = this.proRepository.create({
      name: proDTO.name,
      description: proDTO.description,
      genero: proDTO.genero,
      stock: proDTO.stock,
      sizes,
      userId: user,
    });

    return await this.proRepository.save(producto);
  }

  // Actualizar completamente un producto
  async update(id: number, updateDto: CreadDTO): Promise<Producto> {
    const producto = await this.findOne(id);

    const user = await this.userRepository.findOneBy({ id: updateDto.userId });
    if (!user) {
      throw new NotFoundException(`Usuario con ID: ${updateDto.userId} no encontrado`);
    }

    const sizes = await Promise.all(updateDto.sizes.map(async (label) => {
      const talla = await this.sizeRepository.findOne({
        where: { size_ecuador: label, genero: updateDto.genero },
      });

      if (!talla) {
        throw new NotFoundException(`Talla con etiqueta "${label}" y género "${updateDto.genero}" no encontrada`);
      }

      return talla;
    }));

    Object.assign(producto, {
      ...updateDto,
      usuario: user,
      sizes,
    });

    return await this.proRepository.save(producto);
  }

  // Actualización parcial
  async patch(id: number, partialDto: Partial<CreadDTO>): Promise<Producto> {
    const producto = await this.findOne(id);

    if (partialDto.userId) {
      const user = await this.userRepository.findOneBy({ id: partialDto.userId });
      if (!user) {
        throw new NotFoundException(`Usuario con ID: ${partialDto.userId} no encontrado`);
      }
      producto.userId = user;
    }

    if (partialDto.sizes) {
      const sizes = await Promise.all(partialDto.sizes.map(async (label) => {
        const talla = await this.sizeRepository.findOne({
          where: {
            size_ecuador: label,
            genero: partialDto.genero || producto.genero,
          },
        });

        if (!talla) {
          throw new NotFoundException(`Talla "${label}" no encontrada para género ${partialDto.genero || producto.genero}`);
        }

        return talla;
      }));
      producto.sizes = sizes;
    }

    Object.assign(producto, partialDto);
    return await this.proRepository.save(producto);
  }

  // Eliminar producto
  async remove(id: number): Promise<void> {
    const producto = await this.proRepository.findOneBy({ id });
    if (!producto) {
      throw new NotFoundException(`Producto con ID: ${id} no encontrado`);
    }
    await this.proRepository.remove(producto);
  }
}

