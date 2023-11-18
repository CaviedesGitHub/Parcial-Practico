import { Injectable } from '@nestjs/common';
import { TiendaEntity } from './tienda.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';

@Injectable()
export class TiendaService {
  constructor(
    @InjectRepository(TiendaEntity)
    private readonly tiendaRepository: Repository<TiendaEntity>,
  ) {}

  async findAll(): Promise<TiendaEntity[]> {
    return await this.tiendaRepository.find({ relations: ['productos'] });
  }

  async findOne(id: string): Promise<TiendaEntity> {
    const tienda: TiendaEntity = await this.tiendaRepository.findOne({
      where: { id },
      relations: ['productos'],
    });
    if (!tienda)
      throw new BusinessLogicException(
        'The store with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    return tienda;
  }

  async create(tienda: TiendaEntity): Promise<TiendaEntity> {
    if (tienda.ciudad.length !== 3) {
      throw new BusinessLogicException(
        'The value for the city field is not valid. It must be 3 characters.',
        BusinessError.BAD_REQUEST,
      );
    }
    return await this.tiendaRepository.save(tienda);
  }

  async update(id: string, tienda: TiendaEntity): Promise<TiendaEntity> {
    const persistedTienda: TiendaEntity = await this.tiendaRepository.findOne({
      where: { id },
    });
    if (!persistedTienda)
      throw new BusinessLogicException(
        'The store with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    if (tienda.ciudad.length !== 3) {
      throw new BusinessLogicException(
        'The value for the city field is not valid. It must be 3 characters.',
        BusinessError.BAD_REQUEST,
      );
    }

    tienda.id = id;
    return await this.tiendaRepository.save(tienda);
  }

  async delete(id: string) {
    const tienda: TiendaEntity = await this.tiendaRepository.findOne({
      where: { id },
    });
    if (!tienda)
      throw new BusinessLogicException(
        'The store with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    await this.tiendaRepository.remove(tienda);
  }
}
