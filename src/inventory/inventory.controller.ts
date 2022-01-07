import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import {
  InputValidationException,
  ItemNotFoundException,
} from './inventory.exceptions';
import { Inventory } from './inventory.schema';
import { InventoryService } from './inventory.service';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly service: InventoryService) {}

  @Get()
  public getAllItems(): Promise<Inventory[]> {
    return this.service.getAllItems();
  }

  @Get('/:id')
  public async getItem(@Param('id') itemId: string): Promise<Inventory> {
    try {
      const item: Inventory | null = await this.service.getItem(itemId);

      // valid ObjectID, not in database
      if (!item) {
        throw -1;
      }

      return item;
    } catch (e) {
      throw new ItemNotFoundException(itemId);
    }
  }

  @Post()
  public async createItem(
    @Body() item: Omit<Inventory, 'quantity'>
  ): Promise<Inventory> {
    try {
      return await this.service.createItem({ ...item, quantity: 1 });
    } catch (e) {
      throw new InputValidationException(e);
    }
  }

  @Delete('/:id')
  public async deleteItem(@Param('id') itemId: string): Promise<Inventory> {
    try {
      const deleted: Inventory | null = await this.service.deleteItem(itemId);

      // valid ObjectID, not in database
      if (!deleted) {
        throw -1;
      }

      return deleted;
    } catch (e) {
      throw new ItemNotFoundException(itemId);
    }
  }

  @Put('/:id')
  public async updateItem(
    @Param('id') itemId: string,
    @Body() update: Partial<Inventory>
  ): Promise<Inventory> {
    try {
      const updated: Inventory | null = await this.service.updateItem(
        itemId,
        update
      );

      // valid ObjectID, not in database
      if (!updated) {
        throw 'CastError';
      }

      return updated;
    } catch (e) {
      switch (e.name ?? e) {
        case 'CastError':
          throw new ItemNotFoundException(itemId);
        case 'ValidationError':
          throw new InputValidationException(e);
        default:
          throw new BadRequestException();
      }
    }
  }
}
