class Price{
    priceFor: string
    price: number
}

class Item {
    name: string
    type: string
    prices: Price[]

    constructor(name: string, type: string, prices: Price[]) {
        this.name = name
        this.type = type
        this.prices = prices
    }
}

export default Item
