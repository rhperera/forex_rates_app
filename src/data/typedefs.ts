export default `

  type CurrencyRate {
    id: ID,
    quote: String,
    rate: number
  }

  type Query {
      getCurrencyRate(quote: string!)
  }

`;