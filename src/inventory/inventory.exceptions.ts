/**
 * Custom HTTP Exception classes for /inventory
 */
import {
  BadRequestException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { generateExceptionSchema } from '../utils';

/**
 * Used in the following cases:
 *  - Invalid ObjectId
 *  - Valid ObjectId, Item not found
 */
export class ItemNotFoundException extends NotFoundException {
  /**
   * @param itemId MongoDB Document id
   */
  constructor(itemId: string) {
    super(`Item with id='${itemId}' was not found.`);
  }

  static schema = generateExceptionSchema(
    HttpStatus.NOT_FOUND,
    'The item was not found.',
    'Either the id was invalid, or the item with said id was not found.'
  );
}

export class InputValidationException extends BadRequestException {
  /**
   * @param e: Errors object from mongoose
   * @see https://github.com/Automattic/mongoose/blob/master/lib/error/validation.js
   */
  constructor(e: Record<string, any>) {
    const { errors, _message: message } = e;
    super({
      statusCode: HttpStatus.BAD_REQUEST,
      message: `Bad Request: ${message}`,
      error: Object.values(errors).map(({ message }) => message),
    });
  }

  static schema = generateExceptionSchema(
    HttpStatus.BAD_REQUEST,
    'Input validation error.',
    [
      'An array of properties that were invalidated by the schema, including its reason',
    ]
  );
}
