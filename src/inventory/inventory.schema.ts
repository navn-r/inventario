import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { OmitType, PartialType } from '@nestjs/swagger';
import { Document } from 'mongoose';

export type InventoryDocument = Inventory & Document;

// for type readability
export type InventoryOid = string;

@Schema({ timestamps: true })
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
  quantity: number = 1;

  @Prop([{ type: String, trim: true, maxlength: 120, lowercase: true }])
  tags: string[] = [];
}

export const InventorySchema = SchemaFactory.createForClass(Inventory);

/**
 * DTO classes used for swagger; favored over TypeScript types/interfaces
 *
 * @see https://docs.nestjs.com/openapi
 */
export class CreateInventoryDto extends OmitType(Inventory, [
  'quantity',
] as const) {}
export class UpdateInventoryDto extends PartialType(Inventory) {}
