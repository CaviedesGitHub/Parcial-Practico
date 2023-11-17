import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { TiendaEntity } from './tienda.entity';
import { TiendaService } from './tienda.service';
import { faker } from '@faker-js/faker';

describe('TiendaService', () => {
  let service: TiendaService;
  let repository: Repository<TiendaEntity>;
  let storesList: TiendaEntity[];

  const seedDatabase = async () => {
    repository.clear();
    storesList = [];
    for (let i = 0; i < 5; i++) {
      const tienda: TiendaEntity = await repository.save({
        nombre: faker.company.name(),
        ciudad: faker.location.city(),
        direccion: faker.location.secondaryAddress(),
      });
      storesList.push(tienda);
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [TiendaService],
    }).compile();

    service = module.get<TiendaService>(TiendaService);
    repository = module.get<Repository<TiendaEntity>>(
      getRepositoryToken(TiendaEntity),
    );
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all stores', async () => {
    const tiendas: TiendaEntity[] = await service.findAll();
    expect(tiendas).not.toBeNull();
    expect(tiendas).toHaveLength(storesList.length);
  });

  it('findOne should return a store by id', async () => {
    const storedTienda: TiendaEntity = storesList[0];
    const tienda: TiendaEntity = await service.findOne(storedTienda.id);
    expect(tienda).not.toBeNull();
    expect(tienda.nombre).toEqual(storedTienda.nombre);
    expect(tienda.ciudad).toEqual(storedTienda.ciudad);
    expect(tienda.direccion).toEqual(storedTienda.direccion);
  });

  it('findOne should throw an exception for an invalid store', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'The store with the given id was not found',
    );
  });

  it('create should return a new store', async () => {
    const tienda: TiendaEntity = {
      id: '',
      nombre: faker.company.name(),
      ciudad: faker.location.city(),
      direccion: faker.location.secondaryAddress(),
      productos: [],
    };

    const newTienda: TiendaEntity = await service.create(tienda);
    expect(newTienda).not.toBeNull();

    const storedTienda: TiendaEntity = await repository.findOne({
      where: { id: newTienda.id },
    });
    expect(storedTienda).not.toBeNull();
    expect(storedTienda.nombre).toEqual(newTienda.nombre);
    expect(storedTienda.ciudad).toEqual(newTienda.ciudad);
    expect(storedTienda.direccion).toEqual(newTienda.direccion);
  });

  it('update should modify a store', async () => {
    const tienda: TiendaEntity = storesList[0];
    tienda.nombre = 'New name';
    tienda.ciudad = faker.location.city();
    tienda.direccion = faker.location.secondaryAddress();
    const updatedTienda: TiendaEntity = await service.update(tienda.id, tienda);
    expect(updatedTienda).not.toBeNull();
    const storedTienda: TiendaEntity = await repository.findOne({
      where: { id: tienda.id },
    });
    expect(storedTienda).not.toBeNull();
    expect(storedTienda.nombre).toEqual(tienda.nombre);
    expect(storedTienda.ciudad).toEqual(tienda.ciudad);
    expect(storedTienda.direccion).toEqual(tienda.direccion);
  });

  it('update should throw an exception for an invalid store', async () => {
    let tienda: TiendaEntity = storesList[0];
    tienda = {
      ...tienda,
      nombre: 'New name',
      ciudad: faker.location.city(),
      direccion: faker.location.secondaryAddress(),
    };
    await expect(() => service.update('0', tienda)).rejects.toHaveProperty(
      'message',
      'The store with the given id was not found',
    );
  });

  it('delete should remove a store', async () => {
    const tienda: TiendaEntity = storesList[0];
    await service.delete(tienda.id);
    const deletedProducto: TiendaEntity = await repository.findOne({
      where: { id: tienda.id },
    });
    expect(deletedProducto).toBeNull();
  });

  it('delete should throw an exception for an invalid store', async () => {
    //const tienda: TiendaEntity = storesList[0];
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'The store with the given id was not found',
    );
  });
});
