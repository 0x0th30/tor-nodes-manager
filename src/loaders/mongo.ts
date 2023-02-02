import mongoose from 'mongoose';

const url = process.env['MONGO_URL']!;

mongoose.set('strictQuery', false);
mongoose.connect(url);

export { mongoose };
