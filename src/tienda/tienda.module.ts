import { Module } from '@nestjs/common';
import { TiendaService } from './tienda.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TiendaEntity } from './tienda.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TiendaEntity])],
  providers: [TiendaService],
})
export class TiendaModule {}
