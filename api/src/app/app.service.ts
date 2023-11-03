import { Get, Injectable } from '@nestjs/common';
import { DatabaseConnection } from './app.database';

@Injectable()
export class AppService {
  constructor(
    private readonly databaseConnection: DatabaseConnection,
  ) {
    this.databaseConnection.connect();
    // this.masterService.printData();
    // this.masterService.createData();
  }

  @Get()
  getHello(): string {
    return 'Welcome to the API of the Armat. Please visit https://menuzmini.eachbase.com/api-doc to see documentation about the possible endpoints';
  }

  async dropDatabase() {
    await this.databaseConnection.dropDatabase();
  }
}
