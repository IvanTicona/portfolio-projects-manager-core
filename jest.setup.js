jest.setTimeout(30000);

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server-core');
const connectDB = require('./src/config/db');
const { DB } = require('./src/config/index');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  DB.URI = mongoServer.getUri();
  await connectDB();
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});
