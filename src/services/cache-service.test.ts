import 'reflect-metadata';
import {CurrencyRate} from '../models/currency-rate';
import {RedisCacheService} from './cache-service';
import dotenv from 'dotenv';

let cacheService: RedisCacheService;

beforeAll( () => {
    dotenv.config();
    cacheService = new RedisCacheService();
});

test('RedisCache_CRUD', async () => {
    const quote = new CurrencyRate('USD-LKR', 100, 0.5);
    const setRes = await cacheService.add(quote);
    const getRes = await cacheService.find('USD-LKR');
    const delRes = await cacheService.delete('USD-LKR');
    expect(setRes).toBe(true);
    expect(getRes).toEqual(quote);
    expect(delRes).toBe(true);
});

test('find_notAlreadyIn', async () => {
    const getRes = await cacheService.find('AAA-AAA');
    expect(getRes).toBe(null);
});

test('find_withNull', async () => {
    const getRes = await cacheService.find(null);
    expect(getRes).toBe(null);
});

test('add_givenNullValues', async () => {
    const getRes = await cacheService.add(new CurrencyRate(null, null, null));
    expect(getRes).toBe(false);
});

test('delete_notAlreadyIn', async () => {
    const deleteRes = await cacheService.delete('AAA-AAA');
    expect(deleteRes).toBe(false);
});

test('updateAllValues_emptyList', async () => {
    const res = await cacheService.updateAllValues(...[]);
    expect(res).toBe(false);
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
