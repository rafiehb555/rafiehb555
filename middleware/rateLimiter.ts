import { NextApiRequest, NextApiResponse } from 'next';
import Redis from 'redis';
import { promisify } from 'util';

const redisClient = Redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

const incr = promisify(redisClient.incr).bind(redisClient);
const expire = promisify(redisClient.expire).bind(redisClient);

interface RateLimitConfig {
  windowMs: number;
  max: number;
  message?: string;
  keyPrefix?: string;
}

const defaultConfig: RateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: 'Too many requests, please try again later.',
  keyPrefix: 'rate-limit:',
};

export function rateLimiter(config: RateLimitConfig = defaultConfig) {
  return async (req: NextApiRequest, res: NextApiResponse, next: () => void) => {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const key = `${config.keyPrefix}${ip}`;

    try {
      const requests = await incr(key);

      if (requests === 1) {
        await expire(key, Math.floor(config.windowMs / 1000));
      }

      if (requests > config.max) {
        return res.status(429).json({
          success: false,
          error: config.message,
          retryAfter: Math.ceil(config.windowMs / 1000),
        });
      }

      // Add rate limit headers
      res.setHeader('X-RateLimit-Limit', config.max);
      res.setHeader('X-RateLimit-Remaining', Math.max(0, config.max - requests));
      res.setHeader('X-RateLimit-Reset', Math.ceil(Date.now() / 1000 + config.windowMs / 1000));

      next();
    } catch (error) {
      console.error('Rate limit error:', error);
      // Fail open - allow request if Redis is down
      next();
    }
  };
}

// Export different rate limit configurations
export const rateLimits = {
  strict: {
    windowMs: 60 * 1000, // 1 minute
    max: 30,
    message: 'Too many requests, please try again in a minute.',
    keyPrefix: 'rate-limit-strict:',
  },
  moderate: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: 'Rate limit exceeded, please try again later.',
    keyPrefix: 'rate-limit-moderate:',
  },
  lenient: {
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 1000,
    message: 'Hourly rate limit exceeded.',
    keyPrefix: 'rate-limit-lenient:',
  },
  api: {
    windowMs: 60 * 1000, // 1 minute
    max: 60,
    message: 'API rate limit exceeded.',
    keyPrefix: 'rate-limit-api:',
  },
};
