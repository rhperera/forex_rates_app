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

    async find(quote: string) : Promise<CurrencyRate> {
        try {
            const rate: string = await this.asyncRedis.get(quote);
            if (rate === null || rate === '') {
                return null;
            }
            const rates: string[] = rate.split('|');
            const q: CurrencyRate = new CurrencyRate(quote,
                parseFloat(rates[0]), parseFloat(rates[1]));
            return q;
        } catch (err) {
            console.log(err);
            return null;
        }
    }

    async add(quote: CurrencyRate) : Promise<boolean> {
        // keep this alive for 1 and half hours.
        // We will update the cache every one hour
        try {
            const result = await this.asyncRedis.set(quote.quote,
                quote.rate.toString() + '|' + quote.reversedRate.toString(),
                ['EX', 7200]);

            if (result === 'OK') {
                return true;
            }
            return false;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async delete(quote: string) : Promise<boolean> {
        const result = await this.asyncRedis.del(quote);
        if (result == 1) {
            return true;
        }
        return false;
    }

    async disconnect() : Promise<boolean> {
        const res: string = await this.asyncRedis.quit();
        if (res === 'OK') {
            return true;
        }
        return false;
    }

    async getAllKeys() : Promise<string[]> {
        const keys:string[] = await this.asyncRedis.keys('*-*');
        return keys;
    }

    async updateAllValues(...values: Array<[key: string, value: string]>) : Promise<boolean> {
        try {
            const result: string = await this.asyncRedis.mset(...values);
            if (result === 'OK') {
                return true;
            }
            return false;
        } catch (err) {
            console.log(err);
            return false;
        }
    }
}
