import axios from "axios";
import { CurrencyRate } from "../models/currency-rate";
import { splitBaseAndQuote } from "../utils/utils";


export interface IOracleService {
    getRateOfPair(quote: string) : Promise<CurrencyRate>
}

const API_KEY: string = '';
const FIXER_END_POINT: string = 'http://data.fixer.io/api';

export class FixerService implements IOracleService {
    
    getRateOfPair = async (quote: string) : Promise<CurrencyRate> => {

        let qArray: string[] = splitBaseAndQuote(quote);

        try {
            console.log(qArray);
            const response = await axios.get(`${FIXER_END_POINT}/latest`, 
                { params: this.getParams(qArray[0], qArray[1])});

            console.log(response.data);

            if (response.status === 200 && response.data.success === true ) {
                let cR: CurrencyRate = new CurrencyRate();
                let baseRate: number = response.data.rates[qArray[0]];
                let quoteRate: number = response.data.rates[qArray[1]];
                cR.id = quote;
                cR.quote = quote;
                cR.rate = this.calculateRate(baseRate, quoteRate);
                return cR;
            }

            console.log(response.status);
            return null;

        } catch (error) {
            console.log(error)
            return null;
        }
    }

    getParams = (base: string, symbol: string) : object => {
        return {
            access_key: API_KEY,
            symbols: `${base},${symbol}`
        }
    }

    calculateRate = (baseRate: number, quoteRate: number) : number => {
        return quoteRate/baseRate;
    }
}