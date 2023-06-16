import { TornodesProcessor } from '@workers/process-tornodes-message';

const tornodesWorker = new TornodesProcessor();

tornodesWorker.start();
