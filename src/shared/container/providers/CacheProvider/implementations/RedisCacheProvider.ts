import Redis, { Redis as RedisClient } from 'ioredis';
import cacheConfig from '@config/redis';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

export default class RedisCacheProvider implements ICacheProvider {

    private client: RedisClient;
    constructor() {

        this.client = new Redis(cacheConfig.config.redis);

    }

    public async save(key: string, value: string): Promise<void> {

        console.log(key, JSON.stringify(value));
        await this.client.set(key, value);

    }

    public async invalidate(key: string): Promise<void> {

    }

    public async recover(key: string): Promise<string | null> {
        const data = await this.client.get(key);
        return data;
    }
}