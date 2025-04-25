
import { Body, Controller,Get, Param, ParseIntPipe,Post,ValidationPipe,Put,Patch,Delete } from '@nestjs/common';
import { Producto } from './produc.entity';
import { CreadDTO } from './product.dto';
import { Products2Service } from './products2.service';

@Controller('products2')
export class Products2Controller {


     constructor(private readonly proService : Products2Service){}
    
        @Get()
        findAll():Promise<Producto[]>{
            return this.proService.findAll();
        }
    
        @Get(':id')
        findOne(@Param('id',ParseIntPipe)id:number): Promise<Producto>
    {
        return this.proService.findOne(id);
        
    }
    @Post()
    create(@Body(new ValidationPipe()) user: CreadDTO): Promise<Producto> {
      console.log(user);  // Verifica que los datos sean correctos
      return this.proService.create(user);
    }

    @Put(':id')
  update(@Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe()) updateDto: CreadDTO,
  ): Promise<Producto> {
    return this.proService.update(id, updateDto);
  }

  @Patch(':id')
patch(
  @Param('id', ParseIntPipe) id: number,
  @Body(new ValidationPipe({ skipMissingProperties: true }))
  partialDto: Partial<CreadDTO>,
): Promise<Producto> {
  return this.proService.patch(id, partialDto);
}

@Delete(':id')
remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
  return this.proService.remove(id);
}

@Get('count-by-size/:sizeLabel')
  async countBySize(@Param('sizeLabel') sizeLabel: string): Promise<{ message: string, count: number }> {
    const count = await this.proService.countProductsBySize(sizeLabel);
    
    if (count === 0) {
      return {
        message: `No hay productos disponibles para la talla ${sizeLabel}`,
        count: 0,
      };
    }

    return {
      message: `Hay ${count} productos disponibles para la talla ${sizeLabel}`,
      count: count,
    };
  }
    }

