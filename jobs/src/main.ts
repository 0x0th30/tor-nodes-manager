import { TornodesProcessor } from '@workers/tornodes-processor';

const tornodesWorker = new TornodesProcessor();

tornodesWorker.start();
