import 'reflect-metadata';
import {CurrencyRate} from '../models/currency-rate';
import {RedisCacheService} from './cache-service';
import dotenv from 'dotenv';

let cacheService: RedisCacheService;

beforeAll( () => {
    dotenv.config();
    cacheService = new RedisCacheService();
});

test('CacheServiceAddAndGetTest', async () => {
    const quote = new CurrencyRate();
    quote.id = 'USD-LKR';
    quote.quote = 'USD-LKR';
    quote.rate = 189.09;
    const setRes = await cacheService.add(quote);
    const getRes = await cacheService.find('USD-LKR');
    const delRes = await cacheService.delete('USD-LKR');
    expect(setRes).toBe(true);
    expect(getRes).toEqual(quote);
    expect(delRes).toBe(true);
});

afterAll(async () => {
    const res:boolean = await cacheService.disconnect();
    expect(res).toBe(true);
});
