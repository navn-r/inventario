import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Inventory, InventoryDocument, InventoryOid } from './inventory.schema';

@Injectable()
export class InventoryService {
  constructor(
    @InjectModel(Inventory.name)
    private model: Model<InventoryDocument>
  ) {}

  public getAllItems(): Promise<Inventory[]> {
    return this.model.find().exec();
  }

  public getItem(id: InventoryOid): Promise<Inventory> {
    return this.model.findById(id).exec();
  }

  public createItem(item: Inventory): Promise<Inventory> {
    return this.model.create(item);
  }

  public deleteItem(itemId: InventoryOid): Promise<Inventory> {
    return this.model.findByIdAndDelete(itemId).exec();
  }

  public updateItem(
    itemId: InventoryOid,
    update: Partial<Inventory>
  ): Promise<Inventory> {
    return this.model
      .findByIdAndUpdate(itemId, update, { new: true, runValidators: true })
      .exec();
  }
}
