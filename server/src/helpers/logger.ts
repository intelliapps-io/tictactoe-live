import { transports, createLogger, format } from 'winston';

export const logger = createLogger({
  level: 'debug',
  format: format.combine(
    format.timestamp(),
    format.json(),
    format.prettyPrint(),
  ),
  defaultMeta: { service: 'user-service' },
  transports: [
    new transports.Console(),
  ],
});