import 'reflect-metadata';
import {CurrencyRate} from '../models/currency-rate';
import {RedisCacheService} from './cache-service';
import dotenv from 'dotenv';

let cacheService: RedisCacheService;

beforeAll( () => {
    dotenv.config();
    cacheService = new RedisCacheService();
});

test('RedisCache_add_find_delete', async () => {
    const quote = new CurrencyRate('USD-LKR', 100);
    const setRes = await cacheService.add(quote);
    const getRes = await cacheService.find('USD-LKR');
    const delRes = await cacheService.delete('USD-LKR');
    expect(setRes).toBe(true);
    expect(getRes).toEqual(quote);
    expect(delRes).toBe(true);
});

test('GetAllKeys', async () => {
    const arr: Array<[key: string, value: string]> = [];
    arr.push(['USD-SGD', '100']);
    arr.push(['SGD-LKR', '200']);
    await cacheService.updateAllValues(...arr);
    const keys = await cacheService.getAllKeys();
    expect(keys).toEqual(['SGD-LKR', 'USD-SGD']);
});

afterAll(async () => {
    const res:boolean = await cacheService.disconnect();
    expect(res).toBe(true);
});
