import {CurrencyRate} from '../models/currency-rate';
import * as redis from 'redis';

export interface ICacheService {
    getQuoteFromCache(quote: string) : Promise<CurrencyRate>
    AddQuoteToCache(quote: CurrencyRate) : Promise<CurrencyRate>
}

export class RedisCacheService implements ICacheService {
    private redisClient: redis.RedisClient =
        redis.createClient(
            6379,
            '');

    getQuoteFromCache = async (quote: string) : Promise<CurrencyRate> => {
        this.redisClient.get(quote, (rate) => {
            console.log(rate);
        });
        return null;
    }

    AddQuoteToCache = async (quote: CurrencyRate) : Promise<CurrencyRate> => {
        this.redisClient.set(quote.quote, quote.rate.toString());
        return null;
    }
}
