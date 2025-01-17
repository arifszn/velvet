import winston from 'winston';

const logLevel = process.env.LOG_LEVEL || 'info';

// Create a logger instance
const logger = winston.createLogger({
  level: logLevel,
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }), // Add error stack trace formatting
    winston.format.printf(({ timestamp, level, message, stack }) => {
      // If there's a stack trace, append it to the log message
      if (stack) {
        return `[${timestamp}] ${level}: ${message}\n${stack}`;
      }
      return `[${timestamp}] ${level}: ${message}`;
    }),
  ),
  transports: [new winston.transports.Console()],
});

export default logger;
