import { Controller, Get, Render } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

@Controller()
export class AppController {
  /**
   * Entrypoint for React SSR (views/index.tsx)
   */
  @ApiExcludeEndpoint()
  @Get()
  @Render('index')
  getHello(): { message: string } {
    return { message: 'Hello World!' };
  }
}
