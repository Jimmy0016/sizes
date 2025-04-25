import { Controller, Get, Delete, Param } from '@nestjs/common';
import { SizesService } from './size.service';
import { SizesEntity } from './size.entity';

@Controller('sizes')
export class SizeController {
  constructor(private readonly sizeService: SizesService) {}

  // Obtener todas las tallas
  @Get()
  async getAllSizes(): Promise<SizesEntity[]> {
    return this.sizeService.findAll();
  }

  // Eliminar una talla por ID
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.sizeService.remove(id); // Llama al servicio para eliminar la talla
  }
}