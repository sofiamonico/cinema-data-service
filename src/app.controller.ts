import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('/ping')
  ping() {
    return {
      service: 'cinema-data-service is online',
      datetime: new Date().toString(),
    };
  }
}
