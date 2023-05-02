import { Router } from 'express';
import { GetAllIpsMiddleware } from '@use-cases/get-all-ips/get-all-ips.middleware';
import { BanIpMiddleware } from '@use-cases/ban-ip/ban-ip.middleware';
import { UnbanIpMiddleware } from '@use-cases/unban-ip/unban-ip.middleware';
import { GetBannedIpsMiddleware }
  from '@use-cases/get-banned-ips/get-banned-ips.middleware';
import { GetFilteredIpsMiddleware }
  from '@use-cases/get-filtered-ips/get-filtered-ips.middleware';

const router = Router();

router.get('/ips', new GetAllIpsMiddleware().handle);
router.post('/ips/ban', new BanIpMiddleware().handle);
router.post('/ips/unban', new UnbanIpMiddleware().handle);
router.get('/ips/banned', new GetBannedIpsMiddleware().handle);
router.get('/ips/filtered', new GetFilteredIpsMiddleware().handle);

export { router };
