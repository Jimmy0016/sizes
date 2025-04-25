import { Body, Controller,Get, Param, ParseIntPipe,Post,ValidationPipe,Put,Patch,Delete} from '@nestjs/common';
import { User } from './users.entity';
import { UserService } from './user.service';
import { CreateUserDto } from './userdto';
import { Producto} from 'src/products2/produc.entity';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    // Obtener todos los usuarios
    @Get()
    findAll(): Promise<User[]> {
        return this.userService.findAll();
    }

    // Obtener un usuario por ID
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
        return this.userService.findOne(id);
    }

    // Crear un nuevo usuario
    @Post()
    create(@Body(new ValidationPipe()) user: CreateUserDto): Promise<User> {
        console.log(user);  // Verifica que los datos sean correctos
        return this.userService.create(user);
    }

    // Actualizar un usuario completo
    @Put(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body(new ValidationPipe()) updateDto: CreateUserDto
    ): Promise<User> {
        return this.userService.update(id, updateDto);
    }

    // Actualizar parcialmente un usuario
    @Patch(':id')
    patch(
        @Param('id', ParseIntPipe) id: number,
        @Body(new ValidationPipe({ skipMissingProperties: true })) partialDto: Partial<CreateUserDto>
    ): Promise<User> {
        return this.userService.patch(id, partialDto);
    }

    // Eliminar un usuario
    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.userService.remove(id);
    }

    // Obtener los productos de un usuario específico
    
}

