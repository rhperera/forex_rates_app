import 'reflect-metadata';
import dotenv from 'dotenv';
import {CurrencyRate} from '../models/currency-rate';
import {DataService} from './data-service';
import {RedisCacheService} from './cache-service';
import {FixerService} from './oracle-service';

let dS: DataService;

beforeAll( () => {
    dotenv.config();
    dS = DataService.getInstance();
});

test('getRateOfPair_cacheReturnsNull', async () => {
    const cacheFindMock = jest.spyOn(RedisCacheService.prototype as any, 'find');
    cacheFindMock.mockImplementation(() => {
        return new CurrencyRate('USD-LKR', 4, 5);
    });
    const result = await dS.getRateOfPair('USD-LKR');
    expect(result.quote).toBe('USD-LKR');
});

test('getRateOfPair_cacheAddReturnsfalse', async () => {
    const cacheFindMock = jest.spyOn(RedisCacheService.prototype as any, 'find');
    const cacheAddMock = jest.spyOn(RedisCacheService.prototype as any, 'add');
    const oracleGetMock = jest.spyOn(FixerService.prototype as any, 'getRateOfPair');
    cacheFindMock.mockImplementation(() => {
        return null;
    });
    oracleGetMock.mockImplementation(() => {
        return new CurrencyRate('USD-LKR', 4, 5);
    });
    cacheAddMock.mockImplementation(() => {
        return false;
    });
    const result = await dS.getRateOfPair('USD-LKR');
    expect(result).not.toBe(null);
});

test('updateCacheOnTimer_updateAllReturnFalse', async () => {
    const getAllKeys = jest.spyOn(RedisCacheService.prototype as any, 'getAllKeys');
    const updateAllValues =
        jest.spyOn(RedisCacheService.prototype as any, 'updateAllValues');
    const getRateOfMultiplePairs =
        jest.spyOn(FixerService.prototype as any, 'getRateOfMultiplePairs');
    getAllKeys.mockImplementation(() => {
        return ['USD-LKR'];
    });
    getRateOfMultiplePairs.mockImplementation(() => {
        return [['USD-LKR']];
    });
    updateAllValues.mockImplementation(() => {
        return false;
    });
    await expect(dS.updateCacheOnTimer()).resolves.not.toThrow();
});

afterAll(async () => {
    await dS.destroy();
});
