import { Injectable } from '@nestjs/common';
import { connect, set, connection } from 'mongoose';

@Injectable()
export class DatabaseConnection {
  // Mongoose options
  options = {
    poolSize: 10,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  connect = () => {
    const options: any = {
      poolSize: 10,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };
    // // Setting mongoose option
    set('useFindAndModify', false);
    set('useCreateIndex', true);

    connect(process.env.MONGO_CONN_STR, options, (err) => {
      if (err) {
        console.log('error connecting to the db::: ', err.message);
      }
      console.log('database connected');
    });
  };

  dropDatabase = async () => {
    await connection.dropDatabase();
  };
}
