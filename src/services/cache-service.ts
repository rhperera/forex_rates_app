import {CurrencyRate} from '../models/currency-rate';
import {createNodeRedisClient, WrappedNodeRedisClient} from 'handy-redis';

export interface ICacheService {
    find(quote: string) : Promise<CurrencyRate>
    add(quote: CurrencyRate) : Promise<boolean>;
    delete(quote: string): Promise<boolean>;
    disconnect(): Promise<boolean>;
}

export class RedisCacheService implements ICacheService {
    private asyncRedis: WrappedNodeRedisClient;

    constructor() {
        this.asyncRedis = createNodeRedisClient({port: 6379,
            host: process.env.REDIS_HOST_IP});
    }

    find = async (quote: string) : Promise<CurrencyRate> => {
        const rate: string = await this.asyncRedis.get(quote);
        if (rate === null || rate === '') {
            return null;
        }
        const q: CurrencyRate = new CurrencyRate();
        q.id = quote;
        q.quote = quote;
        q.rate = parseFloat(rate);
        return q;
    }

    add = async (quote: CurrencyRate) : Promise<boolean> => {
        const result = await this.asyncRedis.set(
            quote.quote, quote.rate.toString());
        if (result === 'OK') {
            return true;
        }
        return false;
    }

    delete = async (quote: string) : Promise<boolean> => {
        const result = await this.asyncRedis.del(quote);
        if (result == 1) {
            return true;
        }
        return false;
    }

    disconnect = async () : Promise<boolean> => {
        const res: string = await this.asyncRedis.quit();
        if (res === 'OK') {
            return true;
        }
        return false;
    }
}
