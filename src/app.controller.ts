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
import { AppService } from './app.service';
import { InputValidationException, ItemNotFoundException } from './exceptions';
import { Inventory } from './inventory.schema';

@Controller()
export class AppController {
  constructor(private readonly service: AppService) {}

  @Get()
  public getAllItems(): Promise<Inventory[]> {
    return this.service.getAllItems();
  }

  @Get('/:id')
  public async getItem(@Param('id') itemId: string): Promise<Inventory> {
    try {
      return this.service.getItem(itemId);
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
      return await this.service.deleteItem(itemId);
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
      return await this.service.updateItem(itemId, update);
    } catch (e) {
      switch (e.name) {
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
