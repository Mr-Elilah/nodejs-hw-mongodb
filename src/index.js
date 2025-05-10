import { setuptServer } from './server.js';
import { initMongoDB } from './db/initMongoConnection.js';

const bootstrap = async () => {
  await initMongoDB();

  setuptServer();
};

bootstrap();
