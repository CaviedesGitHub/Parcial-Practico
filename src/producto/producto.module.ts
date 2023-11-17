import { Module } from '@nestjs/common';
import { ProductoService } from './producto.service';
import { ProductoEntity } from './producto.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  providers: [ProductoService],
  imports: [TypeOrmModule.forFeature([ProductoEntity])],
})
export class ProductoModule {}
