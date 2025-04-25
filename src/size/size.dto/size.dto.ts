import { IsString,IsNotEmpty,ArrayNotEmpty,IsArray} from 'class-validator';

export class SizeDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  genero: string;

  @IsArray()
  @ArrayNotEmpty()
  sizes: string[];  // Cambiado a string[] para aceptar etiquetas como "M", ,"S",L"
}