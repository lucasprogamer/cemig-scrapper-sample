export default class Invoice {

    constructor(
        readonly id: string,
        readonly month_date: Date,
        readonly expiration_date: Date,
        readonly total: number,
        readonly barcode?: string,
        public client_id?: string,
        readonly created_at?: Date,
        readonly updated_at?: Date
    ) {
    }

    static create(month_date: Date, expiration_date: Date, total: number, barcode: string, client_id?: string): Invoice {
        return new Invoice(
            crypto.randomUUID(),
            month_date,
            expiration_date,
            total,
            barcode,
            client_id,
            new Date(),
            new Date(),
        );
    }

}