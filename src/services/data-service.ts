import {FixerService, IOracleService} from './oracle-service';
import {ICacheService, RedisCacheService} from './cache-service';
import {CurrencyRate} from '../models/currency-rate';

export class DataService {
    private static instance: DataService = null;
    private oracleService: IOracleService;
    private cacheService: ICacheService;

    private constructor(oS: IOracleService, cS: ICacheService) {
        this.oracleService = oS;
        this.cacheService = cS;
    }

    async initialUpdate() {
        await this.cacheService.add(new CurrencyRate('USD-SGD', 0.0, 0.0));
        await this.cacheService.add(new CurrencyRate('USDK-HKD', 0.0, 0.0));
        this.updateCacheOnTimer();
    }

    public static getInstance(): DataService {
        if (DataService.instance === null) {
            DataService.instance = new DataService(new FixerService(), new RedisCacheService());
        }
        return DataService.instance;
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

    async updateCacheOnTimer() {
        const keys: string[] = await this.cacheService.getAllKeys();
        const updates: Array<[key:string, value:string]> =
            await this.oracleService.getRateOfMultiplePairs(keys);
        const result: boolean = await this.cacheService.updateAllValues(...updates);
        if (!result) {
            console.log('updating cache failed for timer');
        }
    }

    async destroy() {
        await this.cacheService.disconnect();
    }
}
