import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductoTiendaService } from './producto-tienda.service';
import { ProductoEntity } from '../producto/producto.entity';
import { TiendaEntity } from '../tienda/tienda.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductoEntity, TiendaEntity])],
  providers: [ProductoTiendaService],
})
export class ProductoTiendaModule {}
