import { Injectable,NotFoundException} from '@nestjs/common';
import { InjectRepository} from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import { NotFoundError } from 'rxjs';
import { CreateUserDto } from './userdto';
import { plainToInstance } from 'class-transformer';
import { Producto } from 'src/products2/produc.entity';
@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Producto)  // Inyecta el repositorio de Produ
        private produRepository: Repository<Producto>, 
    ) {}

    // Buscar todos los usuarios
    findAll(): Promise<User[]> {
        return this.userRepository.find();
    }

    // Buscar un usuario por ID
    async findOne(id: number): Promise<User> {
      const user = await this.userRepository.findOne({
        where: { id },
        relations: ['productos'], // 👈 esto trae los productos relacionados
      });
    
      if (!user) {
        throw new NotFoundException(`Usuario con ID: ${id} no encontrado`);
      }
    
      return user;
    }

    // Crear un nuevo usuario
    async create(userDto: CreateUserDto): Promise<User> {
        try {
            const user = plainToInstance(User, userDto); // Convierte el DTO a una instancia de User
            return await this.userRepository.save(user);
        } catch (error) {
            console.error('Error creando el usuario:', error);
            throw new Error('Error creando el usuario: ' + error.message);
        }
    }

    // Actualizar un usuario completo
    async update(id: number, updateDto: CreateUserDto): Promise<User> {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException(`Usuario con ID: ${id} no encontrado`);
        }

        const updated = Object.assign(user, updateDto);
        return await this.userRepository.save(updated);
    }

    // Actualizar parcialmente un usuario
    async patch(id: number, partialDto: Partial<CreateUserDto>): Promise<User> {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException(`Usuario con ID: ${id} no encontrado`);
        }

        const updated = Object.assign(user, partialDto);
        return await this.userRepository.save(updated);
    }

    // Eliminar un usuario
    async remove(id: number): Promise<void> {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException(`Usuario con ID: ${id} no encontrado`);
        }

        await this.userRepository.remove(user);
    }

    // Obtener todos los productos de un usuario específico
    
}