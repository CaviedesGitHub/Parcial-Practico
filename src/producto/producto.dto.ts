import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class ProductoDto {
  @IsString()
  @IsNotEmpty()
  readonly nombre: string;

  @IsNumber()
  @IsNotEmpty()
  readonly precio: number;

  @IsString()
  @IsNotEmpty()
  readonly tipo: string;
}
