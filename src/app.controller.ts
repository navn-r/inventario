import { Controller, Get } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

@Controller()
export class AppController {
  @ApiExcludeEndpoint()
  @Get()
  getHello(): string {
    // TODO: Connect with a frontend
    return 'Hello World!';
  }
}
