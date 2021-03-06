import axios, {AxiosResponse} from 'axios';
import {CurrencyRate} from '../models/currency-rate';
import {Config} from '../utils/config';
import {splitBaseAndQuote} from '../utils/utils';


export interface IOracleService {
    getRateOfPair(quote: string) : Promise<CurrencyRate>;
    getRateOfMultiplePairs(keys: string[]) : Promise<Array<[key: string, value:string]>>;
}

export class FixerService implements IOracleService {
    private apiKey: string;
    private endPoint: string;

    constructor() {
        this.apiKey = Config.getInstance().FIXER_API_KEY;
        this.endPoint = Config.getInstance().FIXER_END_POINT;
    }

    async getRateOfPair(quote: string) : Promise<CurrencyRate> {
        if (quote === null || quote == '') {
            console.log('Null string received');
            return null;
        }
        const qArray: string[] = splitBaseAndQuote(quote);

        try {
            const response = await this.getFromAPI([qArray[0], qArray[1]]);

            if (response.status === 200 && response.data.success === true ) {
                const rate1: number = response.data.rates[qArray[0]];
                const rate2: number = response.data.rates[qArray[1]];
                if (rate1 !== undefined && rate2 !== undefined) {
                    const cR: CurrencyRate = new CurrencyRate(quote,
                        this.calculateRate(rate1, rate2),
                        this.calculateRate(rate2, rate1));
                    return cR;
                }
            }
            console.log(response.status);
            return null;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    async getRateOfMultiplePairs(keys: string[])
        : Promise<Array<[key: string, value:string]>> {
        const keySet: Set<string> = new Set();
        keys.forEach((key) => {
            const qArray: string[] = splitBaseAndQuote(key);
            keySet.add(qArray[0]);
            keySet.add(qArray[1]);
        });
        console.log(keySet);
        const quoteRates: Array<[key: string, value: string]> = [];
        try {
            const response = await this.getFromAPI([...keySet]);
            if (response !== null && response.status === 200 && response.data.success === true ) {
                keys.forEach((key) => {
                    const qArray: string[] = splitBaseAndQuote(key);
                    const rate: number = this.calculateRate(
                        response.data.rates[qArray[0]],
                        response.data.rates[qArray[1]]);
                    const reversedRate: number = this.calculateRate(
                        response.data.rates[qArray[1]],
                        response.data.rates[qArray[0]]);
                    quoteRates.push([key, `${rate.toString()}|${reversedRate.toString()}`]);
                });
                return quoteRates;
            }
        } catch (error) {
            console.log(error);
            return quoteRates;
        }
    }

    private async getFromAPI(keySet: string[]): Promise<AxiosResponse<any>> {
        try {
            const response = await axios.get(`${this.endPoint}/latest`,
                {params: this.getParams(keySet)});
            return response;
        } catch (err) {
            console.log(err);
            return null;
        }
    }

    private getParams(symbols: string[]) : object {
        return {
            access_key: this.apiKey,
            symbols: symbols.toString(),
        };
    }

    private calculateRate(baseRate: number, quoteRate: number) : number {
        if (baseRate <= 0 || quoteRate <= 0) {
            return 0;
        }
        return quoteRate/baseRate;
    }
}
