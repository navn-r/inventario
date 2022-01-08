import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import {
  InputValidationException,
  ItemNotFoundException,
} from './inventory.exceptions';
import {
  CreateInventoryDto,
  Inventory,
  InventoryOid,
  UpdateInventoryDto,
} from './inventory.schema';
import { InventoryService } from './inventory.service';

@ApiTags('inventory')
@Controller('inventory')
export class InventoryController {
  constructor(private readonly service: InventoryService) {}

  /**
   * Fetches a list of all items in the inventory.
   *
   * @returns {[Inventory]} An array of all inventory items.
   */
  @Get()
  public getAllItems(): Promise<Inventory[]> {
    return this.service.getAllItems();
  }

  /**
   * Exports a list of inventory items into a CSV file.
   *
   * @feature                "Push a button export product data to a CSV"
   * @param   {Response} res Express response object, for writing the file
   * @returns {File}         A downloadable CSV file to the client
   */
  @Get('/export')
  @ApiOkResponse({
    description:
      'A downloadable CSV file is returned with filename `export-{ISO Date}.csv`',
  })
  public async exportItems(@Res() res: Response): Promise<void> {
    const file = await this.service.exportItems();

    // Assumption: the time from fetching the list of items
    //             and the time to respond to the client
    //             is considered to be close if not identical
    res.setHeader("'Content-Type'", "'text/csv'");
    res.attachment(`export-${new Date().toISOString()}.csv`);
    res.send(file);
  }

  /**
   * Fetches a single item in the inventory using its id.
   *
   * @param   {InventoryOid}  itemId  The id of the item to be fetched.
   * @returns {Inventory}             The item from the inventory, if found.
   */
  @Get('/:id')
  @ApiNotFoundResponse({ schema: ItemNotFoundException.schema })
  public async getItem(@Param('id') itemId: InventoryOid): Promise<Inventory> {
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

  /**
   * Adds a new item into the inventory.
   *
   * @param   {CreateInventoryDto}  item  A (potentially valid) object containing all properties of an item in the inventory, excluding the quantity.
   * @returns                             The newly created item from the inventory, with its corresponding id.
   */
  @Post()
  @ApiBadRequestResponse({ schema: InputValidationException.schema })
  public async createItem(
    @Body() item: CreateInventoryDto
  ): Promise<Inventory> {
    try {
      return await this.service.createItem({ ...item, quantity: 1 });
    } catch (e) {
      throw new InputValidationException(e);
    }
  }

  /**
   * Deletes a single item in the inventory using its id.
   *
   * @param   {InventoryOid}  itemId  The id of the item to be deleted.
   * @returns {Inventory}             The deleted item from the inventory, if found.
   */
  @Delete('/:id')
  @ApiNotFoundResponse({ schema: ItemNotFoundException.schema })
  public async deleteItem(
    @Param('id') itemId: InventoryOid
  ): Promise<Inventory> {
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

  /**
   * Updates a single item in the inventory using its id, and a partial item object.
   *
   * @param   {InventoryOid}        itemId  The id of the item to be updated.
   * @param   {UpdateInventoryDto}  update  An object whose properties are a subset of the item schema.
   * @returns {Inventory}                   The updated item from the inventory, if found.
   */
  @Put('/:id')
  @ApiNotFoundResponse({ schema: ItemNotFoundException.schema })
  @ApiBadRequestResponse({ schema: InputValidationException.schema })
  public async updateItem(
    @Param('id') itemId: InventoryOid,
    @Body() update: UpdateInventoryDto
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
