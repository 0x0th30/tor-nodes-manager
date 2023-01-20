import mongoose from 'mongoose';

const url = process.env['MONGO_URL'] || 'mongodb://mongodb:27017/ips';

mongoose.connect(url);

export { mongoose };
