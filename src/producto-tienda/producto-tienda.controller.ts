import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { ProductoTiendaService } from './producto-tienda.service';
import { TiendaEntity } from '../tienda/tienda.entity';
import { TiendaDto } from '../tienda/tienda.dto';
import { plainToInstance } from 'class-transformer';

@Controller('products')
@UseInterceptors(BusinessErrorsInterceptor)
export class ProductoTiendaController {
  constructor(private readonly productotiendaService: ProductoTiendaService) {}

  @Post(':productoId/stores/:tiendaId')
  async addTiendaProducto(
    @Param('tiendaId') tiendaId: string,
    @Param('productoId') productoId: string,
  ) {
    return await this.productotiendaService.addTiendaProducto(
      tiendaId,
      productoId,
    );
  }

  @Get(':productoId/stores/:tiendaId')
  async findTiendaByProductoIdTiendaId(
    @Param('tiendaId') tiendaId: string,
    @Param('productoId') productoId: string,
  ) {
    return await this.productotiendaService.findTiendaByTiendaIdProductoId(
      tiendaId,
      productoId,
    );
  }

  @Get(':productoId/stores')
  async findTiendasByProductoId(@Param('productoId') productoId: string) {
    return await this.productotiendaService.findTiendasByProductoId(productoId);
  }

  @Put(':productoId/stores')
  async associateTiendasProducto(
    @Body() tiendasDto: TiendaDto[],
    @Param('productoId') productoId: string,
  ) {
    const tiendas = plainToInstance(TiendaEntity, tiendasDto);
    return await this.productotiendaService.associateTiendasProducto(
      productoId,
      tiendas,
    );
  }

  @Delete(':productoId/stores/:tiendaId')
  @HttpCode(204)
  async deleteTiendaProducto(
    @Param('productoId') productoId: string,
    @Param('tiendaId') tiendaId: string,
  ) {
    return await this.productotiendaService.deleteTiendaProducto(
      tiendaId,
      productoId,
    );
  }
}
