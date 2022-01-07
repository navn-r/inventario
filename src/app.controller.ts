import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHello(): string {
    // TODO: Connect with a frontend
    return 'Hello World!';
  }
}
