import 'reflect-metadata';
import {FixerService} from './oracle-service';
import dotenv from 'dotenv';
import {CurrencyRate} from '../models/currency-rate';

let oracleService: FixerService;

beforeAll( () => {
    dotenv.config();
    oracleService = new FixerService();
});

test('getRateOfPair_legitQuote', async () => {
    const result:CurrencyRate = await oracleService.getRateOfPair('USD-LKR');
    expect(result.quote).toBe('USD-LKR');
});

test('getRateOfPair_emptyString', async () => {
    const result:CurrencyRate = await oracleService.getRateOfPair('');
    expect(result).toBe(null);
});

test('getRateOfPair_stringWithoutDash', async () => {
    const result:CurrencyRate = await oracleService.getRateOfPair('ABCD');
    expect(result).toBe(null);
});

test('getRateOfPair_invalidCurrency', async ()=> {
    const result:CurrencyRate = await oracleService.getRateOfPair('ABC-DEF');
    expect(result).toBe(null);
});

test('getRateOfMultiplePairs_legtQuote', async ()=> {
    jest.clearAllMocks();
    const result = await oracleService.getRateOfMultiplePairs(['USD-LKR', 'USD-SGD']);
    console.log(result);
    expect(result[0][0]).toBe('USD-LKR');
    expect(result[1][0]).toBe('USD-SGD');
});

test('getRateOfPair_apiRequestThrowError', async ()=> {
    const apiCallFunc = jest.spyOn(FixerService.prototype as any, 'getFromAPI');
    apiCallFunc.mockImplementation(() => {
        throw new Error();
    });
    const result:CurrencyRate = await oracleService.getRateOfPair('ABC-DEF');
    expect(result).toBe(null);
    expect(apiCallFunc).toHaveBeenCalled();
});
