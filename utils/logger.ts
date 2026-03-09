import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json() // Mandatory for industry tools to parse logs
  ),
  defaultMeta: { service: 'node-app' },
  transports: [
    new winston.transports.Console() // Docker will capture this output
  ],
});

export default logger;
