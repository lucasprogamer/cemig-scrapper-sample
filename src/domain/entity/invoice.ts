export default class Invoice {

    constructor(
        readonly id: string,
        readonly month_date: Date,
        readonly expiration_date: Date,
        public client_id: string,
        readonly total: number,
        readonly barcode?: string,
        readonly created_at?: Date,
        readonly updated_at?: Date
    ) {
    }

    static create(month_date: Date, expiration_date: Date, client_id: string, total: number, barcode: string): Invoice {
        return new Invoice(
            crypto.randomUUID(),
            month_date,
            expiration_date,
            client_id,
            total,
            barcode,
            new Date(),
            new Date(),
        );
    }

}