import {ObjectType, Field, ID, Float} from 'type-graphql';

@ObjectType()
export class CurrencyRate {
    @Field((type) => ID)
    id: string;

    @Field()
    quote: string;

    @Field((type) => Float)
    rate: number;
}

