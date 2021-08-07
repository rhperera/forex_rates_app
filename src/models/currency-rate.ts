import {ObjectType, Field, ID, Float} from 'type-graphql';

@ObjectType()
export class CurrencyRate {
    constructor(quote: string, rate: number, reversedRate: number) {
        this.id = quote;
        this.quote = quote;
        this.rate = rate;
        this.reversedRate = reversedRate;
        this.difference = rate - reversedRate;
    }
    @Field((type) => ID)
    id: string;

    @Field()
    quote: string;

    @Field((type) => Float)
    rate: number;

    @Field((type) => Float)
    reversedRate: number;

    @Field((type) => Float)
    difference: number;
}

