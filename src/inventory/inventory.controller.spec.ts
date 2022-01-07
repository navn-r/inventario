import { Test, TestingModule } from '@nestjs/testing';
import { InventoryController } from './inventory.controller';
import { InventoryService } from './inventory.service';

/* File is setup where tests can be added, 
   should the app scale to a point where it is required. */

class InventoryServiceMock {}

describe('InventoryController', () => {
  let service: InventoryService;
  let controller: InventoryController;

  beforeEach(async () => {
    const ServiceProvider = {
      provide: InventoryService,
      useClass: InventoryServiceMock,
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [InventoryController],
      providers: [ServiceProvider],
    }).compile();

    controller = module.get<InventoryController>(InventoryController);
    service = module.get<InventoryService>(InventoryService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
