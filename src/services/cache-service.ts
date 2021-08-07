import {CurrencyRate} from '../models/currency-rate';
import {createNodeRedisClient, WrappedNodeRedisClient} from 'handy-redis';
import {Config} from '../utils/config';

export interface ICacheService {
    find(quote: string) : Promise<CurrencyRate>
    add(quote: CurrencyRate) : Promise<boolean>;
    delete(quote: string): Promise<boolean>;
    disconnect(): Promise<boolean>;
    getAllKeys() : Promise<string[]>;
    updateAllValues(...values: Array<[key: string, value: string]>) : Promise<boolean>;
}

export class RedisCacheService implements ICacheService {
    private asyncRedis: WrappedNodeRedisClient;

    constructor() {
        this.asyncRedis = createNodeRedisClient({port: 6379,
            host: Config.getInstance().REDIS_HOST_IP});
    }

    find = async (quote: string) : Promise<CurrencyRate> => {
        const rate: string = await this.asyncRedis.get(quote);
        if (rate === null || rate === '') {
            return null;
        }
        const q: CurrencyRate = new CurrencyRate(quote, parseFloat(rate));
        return q;
    }

    add = async (quote: CurrencyRate) : Promise<boolean> => {
        // keep this alive for 1 and half hours.
        // We will update the cache every one hour
        const result = await this.asyncRedis.set(
            quote.quote, quote.rate.toString(), ['EX', 7200]);
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

    getAllKeys = async () : Promise<string[]> => {
        const keys:string[] = await this.asyncRedis.keys('*-*');
        return keys;
    }

    updateAllValues = async (...values: Array<[key: string, value: string]>) : Promise<boolean> => {
        const result: string = await this.asyncRedis.mset(...values);
        if (result === 'OK') {
            return true;
        }
        return false;
    }
}
