import 'reflect-metadata';
import express from 'express';
import {getSchema} from './src/data/schema';
import {ApolloServer} from 'apollo-server-express';
import {createServer, Server} from 'http';
import {CurrencyHandler} from './src/handlers/handler';
import {Config} from './src/utils/config';

const config: Config = Config.getInstance();
const app: express.Application = express();
const router: express.Router = express.Router();
const currencyHandler: CurrencyHandler = new CurrencyHandler();

const initRouters = ():void => {
    router.use('/get/rate/:quote', currencyHandler.getCurrencyRate);
};

async function startApolloServer() {
    const httpServer: Server = createServer(app);
    const schema = await getSchema();
    const apolloServer = new ApolloServer({
        schema,
    });
    await apolloServer.start();
    app.use('/api/v1', router);
    initRouters();
    apolloServer.applyMiddleware({app});
    const port = parseInt(config.PORT);
    httpServer.listen(port, () =>
        console.log(`Server is now running on http://localhost:${port}/graphql`));
}

startApolloServer();
