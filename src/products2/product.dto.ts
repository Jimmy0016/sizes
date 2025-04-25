import { IsNotEmpty, IsInt, IsArray, IsString, ArrayNotEmpty, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreadDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  genero: string;

  @IsInt()
  @Min(0)  // stock debe ser 0 o mayor
  stock: number;

  @IsInt()
  @Type(() => Number)
  userId: number;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })  // Cada talla debe ser string, como "M", "L", etc.
  sizes: string[];
}
