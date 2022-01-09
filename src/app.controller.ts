import { HttpService } from '@nestjs/axios';
import { Controller, Get, Render } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { firstValueFrom } from 'rxjs';

/**
 * This controller is only used for rendering the frontend.
 *
 * For accessing the challenge related routes, see /inventory.
 */
@Controller()
export class AppController {
  constructor(private service: HttpService) {}
  /**
   * Entrypoint for React SSR (views/index.tsx)
   */
  @ApiExcludeEndpoint()
  @Get()
  @Render('index')
  async getHello(): Promise<any> {
    const url =
      process.env.NODE_ENV === 'production'
        ? 'https://inventario-server.herokuapp.com'
        : 'http://localhost:3000';

    const { data: items } = await firstValueFrom(
      this.service.get(url + '/inventory')
    );

    return { items };
  }
}
