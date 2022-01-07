/**
 * Custom HTTP Exception classes
 */
import {
  BadRequestException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';

export class ItemNotFoundException extends NotFoundException {
  /**
   * @param itemId MongoDB Document id
   */
  constructor(itemId: string) {
    super(`Item with id='${itemId}' was not found.`);
  }
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
}
