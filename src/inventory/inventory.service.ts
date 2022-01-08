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

  public async exportItems(delimiter = ','): Promise<string> {
    const props = [
      '_id',
      // Avoids hard-coding item props (keeps schema as the only source of truth)
      ...Object.getOwnPropertyNames(new Inventory()).sort(),
    ];

    const items = (await this.getAllItems()).map((item) => {
      const values = props.map((prop) => {
        let value = item[prop];

        // Required when dealing with array props
        //    i.e. tags: ['tag1', 'tag2'] => "tag1&tag2"
        if (typeof value === 'object') {
          value = value.toString().replaceAll(delimiter, '&');
        }

        return value;
      });

      return values.join(delimiter);
    });

    // CLRF Delimiter favored over LF ('\n') for CSVs
    // @see https://csvlint.io/
    return props.join(delimiter) + '\r\n' + items.join('\r\n');
  }
}
