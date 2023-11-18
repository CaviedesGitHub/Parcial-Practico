import { Module } from '@nestjs/common';
import { TiendaService } from './tienda.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TiendaEntity } from './tienda.entity';
import { TiendaController } from './tienda.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TiendaEntity])],
  providers: [TiendaService],
  controllers: [TiendaController],
})
export class TiendaModule {}
