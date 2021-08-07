import {CurrencyRate} from '../models/currency-rate';
import {DataService} from '../services/data-service';
import {Resolver, Query, Arg} from 'type-graphql';


@Resolver(CurrencyRate)
export class CurrencyRateResolver {
    private dataService: DataService;

    constructor() {
        this.dataService = DataService.getInstance();
    }

  @Query((returns) => CurrencyRate)
    async currencyRate(@Arg('quote') quote: string) {
        const currencyRate = await this.dataService.getRateOfPair(quote);
        console.log(quote);
        if (currencyRate === undefined) {
            console.log('Error fetching data');
        }
        return currencyRate;
    }
}
