import winston from 'winston';

// 1. Define custom colors for terminal visibility
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};
winston.addColors(colors);

const logger = winston.createLogger({
  // Use 'debug' for dev to see "Candidate Generation" steps, 'info' for prod
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    winston.format.errors({ stack: true }), // Captures full stack traces for Stage 3/4 crashes
    winston.format.json() // Machine-readable for CloudWatch/Datadog
  ),
  defaultMeta: { service: 'transaction-engine' }, // Specific to your system
  transports: [
    // Console: Optimized for YOU to read while coding
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize({ all: true }),
        winston.format.printf(
          (info) => `${info.timestamp} ${info.level}: ${info.message}${info.stack ? '\n' + info.stack : ''}`
        )
      ),
    }),
    // File: Persistent storage for critical failures in the funnel
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

export default logger;
