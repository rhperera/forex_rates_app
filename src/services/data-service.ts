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
        const currencyRate: CurrencyRate =
                await this.oracleService.getRateOfPair(quote);
        return currencyRate;
    }
}

const dataService :DataService =
        new DataService(new FixerService(), new RedisCacheService());

export const getDataService = () : DataService => {
    return dataService;
};
