import { mongoose } from '@loaders/mongo';

const bannedIpSchema = new mongoose.Schema({
  address: { type: String, unique: true, required: true },
});

const BannedIp = mongoose.model('BannedIp', bannedIpSchema);

export { BannedIp };
