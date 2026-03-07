import 'dotenv/config';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

async function testRedis() {
  try {
    await redis.set('test', 'hello');
    const value = await redis.get('test');
    console.log('Redis test successful:', value);
  } catch (error) {
    console.error('Redis test failed:', error);
  }
}

testRedis();