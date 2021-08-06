import {IOracleService} from './oracle-service';
import {ICacheService} from './cache-service';
import {FixerService} from './oracle-service';
import {RedisCacheService} from './cache-service';
import {CurrencyRate} from '../models/currency-rate';

export class DataService {
    private oracleService: IOracleService;
    private cacheService: ICacheService;

    constructor(oS: IOracleService, cS: ICacheService) {
        this.oracleService = oS;
        this.cacheService = cS;
    }

    async getRateOfPair(quote: string) : Promise<CurrencyRate> {
        let currencyRate: CurrencyRate = null;
        currencyRate = await this.cacheService.find(quote);
        if (currencyRate !== null) {
            return currencyRate;
        }
        console.log(`Not in cache, fetching from oracle ${quote}`);
        // This quote is not in cache. get it from oracle and update cache
        currencyRate =
                await this.oracleService.getRateOfPair(quote);
        if (currencyRate !== null) {
            if (await this.cacheService.add(currencyRate) === false) {
                console.log(`Failed to update cache with ${currencyRate.quote}`);
            }
        }
        return currencyRate;
    }
}

const dataService :DataService =
        new DataService(new FixerService(), new RedisCacheService());

export const getDataService = () : DataService => {
    return dataService;
};
