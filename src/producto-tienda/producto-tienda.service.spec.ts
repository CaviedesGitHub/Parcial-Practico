import { Test, TestingModule } from '@nestjs/testing';
import { ProductoTiendaService } from './producto-tienda.service';

describe('ProductoTiendaService', () => {
  let service: ProductoTiendaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductoTiendaService],
    }).compile();

    service = module.get<ProductoTiendaService>(ProductoTiendaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
