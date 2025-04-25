import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users.entity';
import { Products2Module } from 'src/products2/products2.module';
import { Producto } from 'src/products2/produc.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User,Producto]),Products2Module],
  providers: [UserService],
  controllers: [UserController]
})
export class UserModule {}
