import mongoose from 'mongoose';

const url = process.env['MONGO_URL'] || 'mongodb://localhost:27017/ips';

mongoose.set('strictQuery', false);
mongoose.connect(url);

export { mongoose };
