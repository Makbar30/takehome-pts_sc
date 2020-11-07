import { Buyer, Item, Transaction } from './models'

const input = {
    Items:
        [
            {
                name: 'oval hat', // product name
                type: 'hats', // product type
                prices: [
                    {
                        priceFor: 'regular', // price is valid for
                        price: 20000, // the price
                    },
                    {
                        priceFor: 'VIP', // price is valid for
                        price: 15000, // the price
                    },
                ]
            }, {
                name: 'square hat', // product name
                type: 'hats', // product type
                prices: [
                    {
                        priceFor: 'regular', // price is valid for
                        price: 30000, // the price
                    },
                    {
                        priceFor: 'VIP', // price is valid for
                        price: 20000, // the price
                    },
                    {
                        priceFor: 'wholesale', // price is valid for
                        price: 15000, // the price					
                    }
                ]
            }, {
                name: 'magic shirt', // product name
                type: 'tops', // product type
                prices: [
                    {
                        priceFor: 'regular', // price is valid for
                        price: 50000, // the price
                    }
                ]
            }
        ],
    Buyers:
        [
            {
                name: 'Ani', // buyer name
                type: 'regular', // buyer type - VIP, regular, wholesale
            }, {
                name: 'Budi', // buyer name
                type: 'VIP', // buyer type - VIP, regular, wholesale
            }, {
                name: 'Charlie',
                type: 'regular'
            }, {
                name: 'Dipta',
                type: 'wholesale'
            }
        ],
    Transaction:
        [
            {
                item: 'magic shirt', // product name
                qty: 1, // buying quantity
                buyer: 'Ani' // buyer name
            }, {
                item: 'square hat', // product name
                qty: 2, // buying quantity
                buyer: 'Budi' // buyer name
            }, {
                item: 'oval hat', // product name
                qty: 1, // buying quantity
                buyer: 'Ani' // buyer name
            }, {
                item: 'square hat',
                qty: 100,
                buyer: 'Dipta'
            }
        ]
}

interface Pr {
    priceFor: string
    price: number
}

interface It {
    name: string
    type: string
    prices: Pr[]
}

interface Tr {
    item: string
    qty: number
    buyer: string
}

interface FTr {
    item: string
    itemType: string
    qty: number
    buyer: string
    buyerType: string
    totalPrice: number
}

interface Bu {
    name: string
    type: string
}

let ListItem: Array<Item> = []
let ListBuyer: Array<Buyer> = []
let ListTransaction: Array<Transaction> = []


function checkRegularPrice(Items: It[]): void {
    Items.map(value => {
        let haveRegular = value.prices.some(p => p.priceFor === 'regular')
        if (!haveRegular) {
            throw new Error('Items must have regular price!')
        }
        let i = new Item(value.name, value.type, value.prices)
        ListItem.push(i)
    })
}

function insertBuyer(Buyers: Bu[]): void {
    Buyers.map(value => {
        let b = new Buyer(value.name, value.type)
        ListBuyer.push(b)
    })
}

function checkDuplicateTr(Transactions: Tr[]): void {
    let result = Transactions.map(value => {
        return value.item + value.buyer
    }).some((value, index, array) => {
        return array.indexOf(value) !== array.lastIndexOf(value);
    })
    if (result) {
        throw new Error('Transaction item and buyer must be unique and not duplicated!')
    }

    Transactions.map(value => {
        let BuyerType = ListBuyer.filter(b => b.name === value.buyer)[0].type
        let ItemTr = ListItem.filter(i => i.name === value.item)[0]
        let PriceTr = ItemTr.prices.filter(p => p.priceFor === BuyerType || p.priceFor === 'regular').sort((a, b) => a.price - b.price)[0].price * value.qty
        let newTransaction = new Transaction(value.item, ItemTr.type, value.qty, value.buyer, BuyerType, PriceTr)
        ListTransaction.push(newTransaction)
    })
}

function calculateRPC(type: string, Transactions: FTr[]): number {
    let tempArray = Transactions.filter(s => s.itemType === type)
    let result: number;
    if (tempArray != []) {
        result = tempArray.reduce((a, cv) => a + cv.totalPrice, 0)
        return result
    }
    return 0
}

function printRPC(Transactions: FTr[]): { category: string, revenue: number }[] {
    let result = []
    let category = ['hats', 'tops', 'shorts']
    category.map(value => {
        let revenue = calculateRPC(value, Transactions)
        result.push({ category: value, revenue })
    })
    return result.sort((a, b) => b.revenue - a.revenue)
}

function calculateSpend(buyer: string, Transactions: FTr[]): number {
    let tempArray = Transactions.filter(s => s.buyer === buyer)
    let result: number;
    if (tempArray != []) {
        result = tempArray.reduce((a, cv) => a + cv.totalPrice, 0)
        return result
    }
    return 0
}

function printBestSpender(Transactions: FTr[]): { name: string, type: string, spent: number }[] {
    let result = []
    ListBuyer.map(value => {
        let totalSpend = calculateSpend(value.name, Transactions)
        if (totalSpend != 0) {
            result.push({ name: value.name, type: value.type, spent: totalSpend })
        }
    })
    return result.sort((a, b) => b.spent - a.spent)
}


function main(): void {
    try {
        checkRegularPrice(input.Items);
        insertBuyer(input.Buyers)
        checkDuplicateTr(input.Transaction);
        let totalTR = ListTransaction.length
        let BSI = ListTransaction.sort((a, b) => b.totalPrice - a.totalPrice)[0].item
        let RPC = printRPC(ListTransaction)
        let BSC = RPC[0].category
        let totalRev = RPC.reduce((a, c) => a + c.revenue, 0)
        let BSpend = printBestSpender(ListTransaction)

        const summary = {
            totalTransaction: totalTR,
            bestSellingItem: BSI,
            bestSellingCategory: BSC,
            rpc: RPC,
            revenue: totalRev,
            bestSpenders: BSpend
        }
        console.log('Summary : ', summary)
    } catch (error) {
        console.log(error)
    }
}

main();