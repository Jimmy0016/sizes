import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SizesEntity } from './size.entity';
import { SizesService } from './size.service';
import { SizeController } from './size.controller';
import { Producto } from 'src/products2/produc.entity';
@Module({
  imports: [TypeOrmModule.forFeature([SizesEntity,Producto])], // Asegúrate de incluir esto
  providers: [SizesService],
  controllers: [SizeController],
})
export class SizeModule {}