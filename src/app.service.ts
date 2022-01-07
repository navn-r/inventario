import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Inventory, InventoryDocument } from './inventory.schema';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(Inventory.name)
    private model: Model<InventoryDocument>
  ) {}

  public getAllItems(): Promise<Inventory[]> {
    return this.model.find().exec();
  }

  public getItem(id: string): Promise<Inventory> {
    return this.model.findById(id).exec();
  }

  public createItem(item: Inventory): Promise<Inventory> {
    return this.model.create(item);
  }

  public deleteItem(itemId: string): Promise<Inventory> {
    return this.model.findByIdAndDelete(itemId).exec();
  }

  public updateItem(
    itemId: string,
    update: Partial<Inventory>
  ): Promise<Inventory> {
    return this.model
      .findByIdAndUpdate(itemId, update, { new: true, runValidators: true })
      .exec();
  }
}
