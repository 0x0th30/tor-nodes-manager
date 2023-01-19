import moment from 'moment';
import { createLogger, format, transports } from 'winston';
import { reset, dim } from '@utils/ansi-style-codes';

const logTemplate = format.printf(({
  level, message, timestamp,
}) => {
  const formattedTimestamp = moment(timestamp).format('YYYY/MM/DD - hh:mm:ss');
  const colorizedTimestamp = `${dim}${formattedTimestamp}${reset}`;
  return `[${level}] | ${colorizedTimestamp} | ${message}`;
});

export const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.colorize(),
    logTemplate,
  ),
  transports: [
    new transports.Console({
      silent: process.argv.indexOf('--silent') >= 0,
    }),
  ],
});
