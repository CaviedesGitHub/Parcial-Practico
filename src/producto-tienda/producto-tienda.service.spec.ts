import { Test, TestingModule } from '@nestjs/testing';
import { ProductoTiendaService } from './producto-tienda.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { TiendaEntity } from '../tienda/tienda.entity';
import { ProductoEntity } from '../producto/producto.entity';
import { faker } from '@faker-js/faker';

describe('ProductoTiendaService', () => {
  let service: ProductoTiendaService;
  let tiendaRepository: Repository<TiendaEntity>;
  let productoRepository: Repository<ProductoEntity>;
  let producto: ProductoEntity;
  let storesList: TiendaEntity[];

  const seedDatabase = async () => {
    tiendaRepository.clear();
    productoRepository.clear();

    storesList = [];
    for (let i = 0; i < 5; i++) {
      const tienda: TiendaEntity = await tiendaRepository.save({
        nombre: faker.company.name(),
        ciudad: faker.location.city(),
        direccion: faker.location.secondaryAddress(),
      });
      storesList.push(tienda);
    }

    producto = await productoRepository.save({
      nombre: faker.company.name(),
      precio: Math.floor(Math.random() * 10000) + 1,
      tipo: 'Perecedero',
      tiendas: storesList,
    });
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ProductoTiendaService],
    }).compile();

    productoRepository = module.get<Repository<ProductoEntity>>(
      getRepositoryToken(ProductoEntity),
    );
    tiendaRepository = module.get<Repository<TiendaEntity>>(
      getRepositoryToken(TiendaEntity),
    );
    service = module.get<ProductoTiendaService>(ProductoTiendaService);
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addStoreProduct should add a store to a product', async () => {
    const newTienda: TiendaEntity = await tiendaRepository.save({
      nombre: faker.company.name(),
      ciudad: faker.location.city(),
      direccion: faker.location.secondaryAddress(),
    });

    const newProducto: ProductoEntity = await productoRepository.save({
      nombre: faker.company.name(),
      precio: Math.floor(Math.random() * 10000) + 1,
      tipo: 'Perecedero',
    });

    const result: ProductoEntity = await service.addTiendaProducto(
      newTienda.id,
      newProducto.id,
    );

    expect(result.tiendas.length).toBe(1);
    expect(result.tiendas[0]).not.toBeNull();
    expect(result.tiendas[0].nombre).toBe(newTienda.nombre);
    expect(result.tiendas[0].ciudad).toBe(newTienda.ciudad);
    expect(result.tiendas[0].direccion).toBe(newTienda.direccion);
  });

  it('addTiendaProducto should thrown exception for an invalid store', async () => {
    const newProducto: ProductoEntity = await productoRepository.save({
      nombre: faker.company.name(),
      precio: Math.floor(Math.random() * 10000) + 1,
      tipo: 'Perecedero',
    });

    await expect(() =>
      service.addTiendaProducto('0', newProducto.id),
    ).rejects.toHaveProperty(
      'message',
      'The store with the given id was not found',
    );
  });

  it('addTiendaProducto should throw an exception for an invalid product', async () => {
    const newTienda: TiendaEntity = await tiendaRepository.save({
      nombre: faker.company.name(),
      ciudad: faker.location.city(),
      direccion: faker.location.secondaryAddress(),
    });

    await expect(() =>
      service.addTiendaProducto(newTienda.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The product with the given id was not found',
    );
  });

  it('findTiendaByProductoIdTiendaId should return store by product', async () => {
    const tienda: TiendaEntity = storesList[0];
    const storedTienda: TiendaEntity =
      await service.findTiendaByTiendaIdProductoId(tienda.id, producto.id);
    expect(storedTienda).not.toBeNull();
    expect(storedTienda.nombre).toBe(tienda.nombre);
    expect(storedTienda.ciudad).toBe(tienda.ciudad);
    expect(storedTienda.direccion).toBe(tienda.direccion);
  });

  it('findStoreByProductIdStoreId should throw an exception for an invalid store', async () => {
    await expect(() =>
      service.findTiendaByTiendaIdProductoId('0', producto.id),
    ).rejects.toHaveProperty(
      'message',
      'The store with the given id was not found',
    );
  });

  it('findStoreByStoreIdProductId should throw an exception for an invalid product', async () => {
    const tienda: TiendaEntity = storesList[0];
    await expect(() =>
      service.findTiendaByTiendaIdProductoId(tienda.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The product with the given id was not found',
    );
  });

  it('findStoreByProductIdStoreId should throw an exception for an store not associated to the product', async () => {
    const newTienda: TiendaEntity = await tiendaRepository.save({
      nombre: faker.company.name(),
      ciudad: faker.location.city(),
      direccion: faker.location.secondaryAddress(),
    });

    await expect(() =>
      service.findTiendaByTiendaIdProductoId(newTienda.id, producto.id),
    ).rejects.toHaveProperty(
      'message',
      'The store with the given id is not associated to the product',
    );
  });

  it('findStoresByProductId should return stores by product', async () => {
    const tiendas: TiendaEntity[] = await service.findTiendasByProductoId(
      producto.id,
    );
    expect(tiendas.length).toBe(5);
  });

  it('findStoresByProductId should throw an exception for an invalid product', async () => {
    await expect(() =>
      service.findTiendasByProductoId('0'),
    ).rejects.toHaveProperty(
      'message',
      'The product with the given id was not found',
    );
  });

  it('associateStoreProduct should update stores list for a product', async () => {
    const newTienda: TiendaEntity = await tiendaRepository.save({
      nombre: faker.company.name(),
      ciudad: faker.location.city(),
      direccion: faker.location.secondaryAddress(),
    });

    const updatedProducto: ProductoEntity =
      await service.associateTiendasProducto(producto.id, [newTienda]);
    expect(updatedProducto.tiendas.length).toBe(1);

    expect(updatedProducto.tiendas[0].nombre).toBe(newTienda.nombre);
    expect(updatedProducto.tiendas[0].ciudad).toBe(newTienda.ciudad);
    expect(updatedProducto.tiendas[0].direccion).toBe(newTienda.direccion);
  });

  it('associateTiendasProducto should throw an exception for an invalid product', async () => {
    const newTienda: TiendaEntity = await tiendaRepository.save({
      nombre: faker.company.name(),
      ciudad: faker.location.city(),
      direccion: faker.location.secondaryAddress(),
    });

    await expect(() =>
      service.associateTiendasProducto('0', [newTienda]),
    ).rejects.toHaveProperty(
      'message',
      'The product with the given id was not found',
    );
  });

  it('associateTiendasProducto should throw an exception for an invalid store', async () => {
    const newTienda: TiendaEntity = storesList[0];
    newTienda.id = '0';

    await expect(() =>
      service.associateTiendasProducto(producto.id, [newTienda]),
    ).rejects.toHaveProperty(
      'message',
      'The store with the given id was not found',
    );
  });

  it('deleteStoreToProduct should remove an store from a product', async () => {
    const tienda: TiendaEntity = storesList[0];

    await service.deleteTiendaProducto(tienda.id, producto.id);

    const storedProducto: ProductoEntity = await productoRepository.findOne({
      where: { id: producto.id },
      relations: ['tiendas'],
    });
    const deletedTienda: TiendaEntity = storedProducto.tiendas.find(
      (a) => a.id === tienda.id,
    );

    expect(deletedTienda).toBeUndefined();
  });

  it('deleteStoreToProduct should thrown an exception for an invalid store', async () => {
    await expect(() =>
      service.deleteTiendaProducto('0', producto.id),
    ).rejects.toHaveProperty(
      'message',
      'The store with the given id was not found',
    );
  });

  it('deleteStoreToProduct should thrown an exception for an invalid product', async () => {
    const tienda: TiendaEntity = storesList[0];
    await expect(() =>
      service.deleteTiendaProducto(tienda.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The product with the given id was not found',
    );
  });

  it('deleteStoreToProduct should thrown an exception for an non asocciated store', async () => {
    const newTienda: TiendaEntity = await tiendaRepository.save({
      nombre: faker.company.name(),
      ciudad: faker.location.city(),
      direccion: faker.location.secondaryAddress(),
    });

    await expect(() =>
      service.deleteTiendaProducto(newTienda.id, producto.id),
    ).rejects.toHaveProperty(
      'message',
      'The store with the given id is not associated to the product',
    );
  });
});
