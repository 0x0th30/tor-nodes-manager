import { Router } from 'express';
import { BanIpMiddleware } from '@middlewares/ban-ip';

const router = Router();

router.post('/ban-ip', new BanIpMiddleware().action);

export { router };
