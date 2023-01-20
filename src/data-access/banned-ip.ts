import { mongoose } from '@loaders/mongo';

const bannedIpSchema = new mongoose.Schema({ address: String });

const BannedIp = mongoose.model('BannedIp', bannedIpSchema);

export { BannedIp };
