class Transaction {
    item: string
    itemType: string
    qty: number
    buyer: string
    buyerType: string
    totalPrice: number

    public constructor(item: string, itemType: string, qty: number, buyer: string,buyerType: string, totalPrice: number) {
        this.item = item
        this.itemType = itemType
        this.qty = qty
        this.buyer = buyer
        this.buyerType = buyerType
        this.totalPrice = totalPrice
    }
}

export default Transaction