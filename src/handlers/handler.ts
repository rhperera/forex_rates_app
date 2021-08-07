import express from 'express';
import {CurrencyRate} from '../models/currency-rate';
import {DataService} from '../services/data-service';

class HttpResponse {
    public data: any = {};
}

export class CurrencyHandler {
    async getCurrencyRate(req: express.Request, res: express.Response) {
        const quote: string = req.params.quote;
        const result: CurrencyRate =
                await DataService.getInstance().getRateOfPair(quote);
        const httpResObj: HttpResponse = new HttpResponse();
        httpResObj.data['CurrencyRate'] = result;
        res.send(httpResObj);
    }
}
