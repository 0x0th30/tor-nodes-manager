import { BannedIp } from '@data-access/banned-ip';

export class BanIp {
  public async execute(address: string) {
    BannedIp.create({ address });
  }
}
