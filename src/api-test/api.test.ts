import 'reflect-metadata';
import supertest from 'supertest';
import * as main from '../../index';
import {DataService} from '../services/data-service';

beforeAll((done) => {
    main.app.on('ServerStarted', () => {
        done();
    });
});

test('get/rate_legitString', async () => {
    const request = supertest(main.app);
    const resp = await request.get('/api/v1/get/rate/USD-LKR');
    expect(200);
    console.log(resp.body);
    expect(resp.body.data.CurrencyRate.quote).toBe('USD-LKR');
});

test('get/rate_invalidString', async () => {
    const request = supertest(main.app);
    const resp = await request.get('/api/v1/get/rate/USDLKR');
    expect(200);
    expect(resp.body.data.CurrencyRate).toBeFalsy();
});

test('get/rate_withoutparam', async () => {
    const request = supertest(main.app);
    await request.get('/api/v1/get/rate/');
    expect(400);
});

test('/graphql', async () => {
    const request = supertest(main.app);
    await request.post('/graphql').send({
        query: '{currencyRate(quote: "USD-LKR") {id quote rate reversedRate difference}}'})
        .set('content-type', 'application/json')
        .expect(200)
        .then((res) => {
            expect(res.body).toBeInstanceOf(Object);
            expect(res.body.data.currencyRate.quote).toEqual('USD-LKR');
            expect(res.body.data.currencyRate.rate - res.body.data.currencyRate.reversedRate).
                toBeCloseTo(res.body.data.currencyRate.difference);
        });
});

test('/updateCache_fromLocal', async () => {
    const request = supertest(main.app);
    await request.get('/api/v1/updateCache').set('Host', 'localhost');
    expect(200);
});

test('/updateCache_NotFromLocal', async () => {
    const request = supertest(main.app);
    await request.get('/api/v1/updateCache').set('Host', 'someotherhost');
    expect(401);
});


afterAll(async () => {
    main.httpServer.close();
    DataService.getInstance().destroy();
});
