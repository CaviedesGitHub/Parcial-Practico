import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { ProductoService } from './producto.service';
import { ProductoEntity } from './producto.entity';
import { faker } from '@faker-js/faker';

describe('ProductoService', () => {
  let service: ProductoService;
  let repository: Repository<ProductoEntity>;
  let productsList: ProductoEntity[];

  const seedDatabase = async () => {
    repository.clear();
    productsList = [];
    for (let i = 0; i < 5; i++) {
      const producto: ProductoEntity = await repository.save({
        nombre: faker.company.name(),
        precio: 10000,
        tipo: 'Perecedero',
      });
      productsList.push(producto);
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ProductoService],
    }).compile();

    service = module.get<ProductoService>(ProductoService);
    repository = module.get<Repository<ProductoEntity>>(
      getRepositoryToken(ProductoEntity),
    );
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all products', async () => {
    const productos: ProductoEntity[] = await service.findAll();
    expect(productos).not.toBeNull();
    expect(productos).toHaveLength(productsList.length);
  });

  it('findOne should return a product by id', async () => {
    const storedProducto: ProductoEntity = productsList[0];
    const producto: ProductoEntity = await service.findOne(storedProducto.id);
    expect(producto).not.toBeNull();
    expect(producto.nombre).toEqual(storedProducto.nombre);
    expect(producto.precio).toEqual(storedProducto.precio);
    expect(producto.tipo).toEqual(storedProducto.tipo);
  });

  it('findOne should throw an exception for an invalid product', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'The product with the given id was not found',
    );
  });

  it('create should return a new product', async () => {
    const producto: ProductoEntity = {
      id: '',
      nombre: faker.company.name(),
      precio: 10000,
      tipo: 'No perecedero',
      tiendas: [],
    };

    const newProducto: ProductoEntity = await service.create(producto);
    expect(newProducto).not.toBeNull();

    const storedProducto: ProductoEntity = await repository.findOne({
      where: { id: newProducto.id },
    });
    expect(storedProducto).not.toBeNull();
    expect(storedProducto.nombre).toEqual(newProducto.nombre);
    expect(storedProducto.precio).toEqual(newProducto.precio);
    expect(storedProducto.tipo).toEqual(newProducto.tipo);
  });

  it('update should modify a product', async () => {
    const producto: ProductoEntity = productsList[0];
    producto.nombre = 'New name';
    producto.precio = 20000;
    producto.tipo = 'Perecedero';
    const updatedproducto: ProductoEntity = await service.update(
      producto.id,
      producto,
    );
    expect(updatedproducto).not.toBeNull();
    const storedProducto: ProductoEntity = await repository.findOne({
      where: { id: producto.id },
    });
    expect(storedProducto).not.toBeNull();
    expect(storedProducto.nombre).toEqual(producto.nombre);
    expect(storedProducto.precio).toEqual(producto.precio);
    expect(storedProducto.tipo).toEqual(producto.tipo);
  });

  it('update should throw an exception for an invalid product', async () => {
    let producto: ProductoEntity = productsList[0];
    producto = {
      ...producto,
      nombre: 'New name',
      precio: 20000,
    };
    await expect(() => service.update('0', producto)).rejects.toHaveProperty(
      'message',
      'The product with the given id was not found',
    );
  });

  it('delete should remove a product', async () => {
    const producto: ProductoEntity = productsList[0];
    await service.delete(producto.id);
    const deletedProducto: ProductoEntity = await repository.findOne({
      where: { id: producto.id },
    });
    expect(deletedProducto).toBeNull();
  });

  it('delete should throw an exception for an invalid product', async () => {
    //const producto: ProductoEntity = productsList[0];
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'The product with the given id was not found',
    );
  });
});
