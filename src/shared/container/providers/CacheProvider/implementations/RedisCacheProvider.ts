import Redis, { Redis as RedisClient } from 'ioredis';
import cacheConfig from '@config/redis';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

export default class RedisCacheProvider implements ICacheProvider {

    private client: RedisClient;
    constructor() {

        this.client = new Redis(cacheConfig.config.redis);

    }

    public async save(key: string, value: any): Promise<void> {
        await this.client.set(key, JSON.stringify(value));
    }

    public async invalidate(key: string): Promise<void> {

    }

    public async recover<T>(key: string): Promise<T | null> {

        console.log(key);

        const data = await this.client.get(key);

        if (!data) {
            return null;
        }

        const parsedData = await JSON.parse(data) as T;

        return parsedData;
    }
}