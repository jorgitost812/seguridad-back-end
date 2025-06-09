import { Controller, Get } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Database')
@Controller()
export class AppController {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource
  ) {}

  @Get('test-db')
  async testDatabase() {
    try {
      const result = await this.dataSource.query('SELECT NOW()');
      return {
        status: 'Connected',
        timestamp: result[0].now,
        database: this.dataSource.options.database
      };
    } catch (error) {
      return {
        status: 'Error',
        message: error.message
      };
    }
  }
}