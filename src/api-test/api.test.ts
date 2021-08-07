import 'reflect-metadata';
import supertest from 'supertest';
import * as main from '../../index';

test('get/rate_legitString', async () => {
    const request = supertest(main.httpServer);
    const resp = await request.get('/api/v1/get/rate/USD-LKR');
    expect(200);
    expect(resp.body.data.CurrencyRate.quote).toBe('USD-LKR');
});

test('get/rate_invalidString', async () => {
    const request = supertest(main.httpServer);
    const resp = await request.get('/api/v1/get/rate/USDLKR');
    expect(200);
    expect(resp.body.data.CurrencyRate).toBe(null);
});

test('get/rate_withoutparam', async () => {
    const request = supertest(main.httpServer);
    await request.get('/api/v1/get/rate/');
    expect(400);
});


afterAll(async () => {
    main.httpServer.close();
});
