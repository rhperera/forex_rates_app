import {CurrencyRateResolver} from './resolvers';
import {buildSchema} from 'type-graphql';
import {GraphQLSchema} from 'graphql';

export const getSchema = async () : Promise<GraphQLSchema> => {
    const schema = await buildSchema({resolvers: [CurrencyRateResolver]});
    return schema;
};
