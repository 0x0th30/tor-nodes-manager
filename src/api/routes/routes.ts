import { Router } from 'express';
import { BanIpMiddleware } from '@middlewares/ban-ip';
import { GetBannedIpsMiddleware } from '@api/middlewares/get-banned-ips';

const router = Router();

router.post('/ips/ban', new BanIpMiddleware().action);
router.get('/ips/banned', new GetBannedIpsMiddleware().action);

export { router };
