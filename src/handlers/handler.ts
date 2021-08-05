import express from 'express';
import {CurrencyRate} from '../models/currency-rate';
import {DataService} from '../services/data-service';

export class CurrencyHandler {
    private dataService: DataService;

    constructor(oS : DataService) {
        this.dataService = oS;
    }

    async getCurrencyRate(req: express.Request, res: express.Response) {
        const quote: string = req.params.quote;
        const result: CurrencyRate =
                await this.dataService.getRateOfPair(quote);
        res.send(`${result}`);
    }
}
