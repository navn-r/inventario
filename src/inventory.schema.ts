import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type InventoryDocument = Inventory & Document;

@Schema()
export class Inventory {
  @Prop({ required: true, trim: true, maxlength: 120 })
  name: string;

  @Prop({ trim: true, maxlength: 120 })
  brand: string;

  @Prop({ required: true, min: 0 })
  price: number;

  @Prop({ maxlength: 400, trim: true })
  description: string;

  @Prop({ required: true, min: 1 })
  quantity: number;

  @Prop([{ type: String, trim: true, maxlength: 120 }])
  tags: string[];
}

export const InventorySchema = SchemaFactory.createForClass(Inventory);
