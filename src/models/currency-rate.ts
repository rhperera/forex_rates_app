import {ObjectType, Field, ID, Float} from 'type-graphql';

@ObjectType()
export class CurrencyRate {
    constructor(quote: string, rate: number) {
        this.id = quote;
        this.quote = quote;
        this.rate = rate;
    }
    @Field((type) => ID)
    id: string;

    @Field()
    quote: string;

    @Field((type) => Float)
    rate: number;
}

