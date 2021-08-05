import typeDefs from './typedefs.js';
import {CurrencyRateResolver} from './resolvers.js';
import { buildSchema } from 'type-graphql';
import { GraphQLSchema } from 'graphql';

export const getSchema = async () : Promise<GraphQLSchema> => {
    const schema = await buildSchema({ resolvers:[CurrencyRateResolver] });
    return schema;
}