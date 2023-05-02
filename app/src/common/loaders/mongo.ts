import mongoose from 'mongoose';
import { logger } from '@utils/logger';

const uri = process.env['MONGO_URI'] || 'mongodb://localhost:27017/ips';

mongoose.set('strictQuery', false);
mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 })
  .then(() => {
    logger.info('Mongo connection was successfully established.');
  })
  .catch((error) => {
    logger.crit(`Mongo connection was failed by: ${error}`);
  });

export { mongoose };
