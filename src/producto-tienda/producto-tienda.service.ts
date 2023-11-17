import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductoEntity } from '../producto/producto.entity';
import { TiendaEntity } from '../tienda/tienda.entity';
import { Repository } from 'typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';

@Injectable()
export class ProductoTiendaService {
  constructor(
    @InjectRepository(ProductoEntity)
    private readonly productoRepository: Repository<ProductoEntity>,

    @InjectRepository(TiendaEntity)
    private readonly tiendaRepository: Repository<TiendaEntity>,
  ) {}

  async addTiendaProducto(
    tiendaId: string,
    productoId: string,
  ): Promise<ProductoEntity> {
    const tienda: TiendaEntity = await this.tiendaRepository.findOne({
      where: { id: tiendaId },
    });
    if (!tienda)
      throw new BusinessLogicException(
        'The store with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const producto: ProductoEntity = await this.productoRepository.findOne({
      where: { id: productoId },
      relations: ['tiendas'],
    });
    if (!producto)
      throw new BusinessLogicException(
        'The product with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    producto.tiendas = [...producto.tiendas, tienda];
    return await this.productoRepository.save(producto);
  }

  async findTiendaByTiendaIdProductoId(
    tiendaId: string,
    productoId: string,
  ): Promise<TiendaEntity> {
    const producto: ProductoEntity = await this.productoRepository.findOne({
      where: { id: productoId },
      relations: ['tiendas'],
    });
    if (!producto)
      throw new BusinessLogicException(
        'The product with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const tienda: TiendaEntity = await this.tiendaRepository.findOne({
      where: { id: tiendaId },
    });
    if (!tienda)
      throw new BusinessLogicException(
        'The store with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const tiendaProducto: TiendaEntity = producto.tiendas.find(
      (e) => e.id === tienda.id,
    );

    if (!tiendaProducto)
      throw new BusinessLogicException(
        'The store with the given id is not associated to the product',
        BusinessError.PRECONDITION_FAILED,
      );

    return tiendaProducto;
  }

  async findTiendasByProductoId(productoId: string): Promise<TiendaEntity[]> {
    const producto: ProductoEntity = await this.productoRepository.findOne({
      where: { id: productoId },
      relations: ['tiendas'],
    });
    if (!producto)
      throw new BusinessLogicException(
        'The product with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return producto.tiendas;
  }

  async associateTiendasProducto(
    productoId: string,
    tiendas: TiendaEntity[],
  ): Promise<ProductoEntity> {
    const producto: ProductoEntity = await this.productoRepository.findOne({
      where: { id: productoId },
      relations: ['tiendas'],
    });

    if (!producto)
      throw new BusinessLogicException(
        'The product with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    for (let i = 0; i < tiendas.length; i++) {
      const tienda: TiendaEntity = await this.tiendaRepository.findOne({
        where: { id: tiendas[i].id },
      });
      if (!tienda)
        throw new BusinessLogicException(
          'The store with the given id was not found',
          BusinessError.NOT_FOUND,
        );
    }

    producto.tiendas = tiendas;
    return await this.productoRepository.save(producto);
  }

  async deleteTiendaProducto(tiendaId: string, productoId: string) {
    const producto: ProductoEntity = await this.productoRepository.findOne({
      where: { id: productoId },
      relations: ['tiendas'],
    });
    if (!producto)
      throw new BusinessLogicException(
        'The product with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const tienda: TiendaEntity = await this.tiendaRepository.findOne({
      where: { id: tiendaId },
    });
    if (!tienda)
      throw new BusinessLogicException(
        'The store with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const tiendaProducto: TiendaEntity = producto.tiendas.find(
      (e) => e.id === tienda.id,
    );

    if (!tiendaProducto)
      throw new BusinessLogicException(
        'The store with the given id is not associated to the product',
        BusinessError.PRECONDITION_FAILED,
      );

    producto.tiendas = producto.tiendas.filter((e) => e.id !== tiendaId);
    await this.productoRepository.save(producto);
  }
}
