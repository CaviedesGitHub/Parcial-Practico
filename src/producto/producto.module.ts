import { Module } from '@nestjs/common';
import { ProductoService } from './producto.service';
import { ProductoEntity } from './producto.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductoController } from './producto.controller';

@Module({
  providers: [ProductoService],
  imports: [TypeOrmModule.forFeature([ProductoEntity])],
  controllers: [ProductoController],
})
export class ProductoModule {}
