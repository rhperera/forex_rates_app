import express from 'express';
import {CurrencyRate} from '../models/currency-rate';
import {DataService} from '../services/data-service';

class HttpResponse {
    public data: any = {};
}

export class CurrencyHandler {
    async getCurrencyRate(req: express.Request, res: express.Response) {
        const httpResObj: HttpResponse = new HttpResponse();
        const quote: string = req.params.quote;
        if (quote === null || quote === '') {
            res.status(400).send(httpResObj);
        }
        const result: CurrencyRate =
                await DataService.getInstance().getRateOfPair(quote);
        httpResObj.data['CurrencyRate'] = result;
        res.send(httpResObj);
    }

    async upateCache(req: express.Request, res: express.Response) {
        if (req.hostname.toString() !== 'localhost' ) {
            console.log(req.hostname.toString());
            res.status(401).send();
        } else {
            const httpResObj: HttpResponse = new HttpResponse();
            await DataService.getInstance().updateCacheOnTimer();
            res.status(200).send(httpResObj);
        }
    }
}
