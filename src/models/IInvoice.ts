
export interface ILineItem {
    id?: number,
    invoiceNumber: number,
    productCode: string,
    name: string,
    quantity: number,
    itemPrice: number,
    discount: number,
    subtotal: number,
    profit: number,
    cgst: number,
    sgst: number,
    igst: number,
    total: number,
}

export enum PaymentMode {
    CASH = 'cash',
    CARD = 'card',
    UPI = 'upi',
    ONLINE = 'online'
}

export interface IInvoice {
    number?: number,
    buyer_id: number,
    date: number,
    discount: number,
    subtotal: number,
    profit: number,
    cgst: number,
    sgst: number,
    igst: number,
    total: number,
    paid_by?: PaymentMode
}