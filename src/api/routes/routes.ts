import { Router } from 'express';
import { GetAllIpsMiddleware } from '@middlewares/get-all-ips';
import { BanIpMiddleware } from '@middlewares/ban-ip';
import { GetBannedIpsMiddleware } from '@api/middlewares/get-banned-ips';
import { GetFilteredIpsMiddleware } from '@api/middlewares/get-filtered-ips';

const router = Router();

router.get('/ips', new GetAllIpsMiddleware().action);
router.post('/ips/ban', new BanIpMiddleware().action);
router.get('/ips/banned', new GetBannedIpsMiddleware().action);
router.get('/ips/filtered', new GetFilteredIpsMiddleware().action);

export { router };
