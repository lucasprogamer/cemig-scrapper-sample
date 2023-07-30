export default class InvoiceItem {

    constructor(
        readonly id: string,
        readonly description: string,
        readonly total_price: number | any,
        public invoice_id: string,
        readonly unity?: 'kWh' | 'Wh',
        readonly unit_price?: number | any,
        readonly quantity?: number,
        public created_at?: Date,
        public updated_at?: Date
    ) {
    }

    public static create(description: string, total_price: number, invoice_id: string, unity?: 'kWh' | 'Wh', unit_price?: number, quantity?: number) {
        return new InvoiceItem(
            crypto.randomUUID(),
            description,
            total_price,
            invoice_id,
            unity,
            unit_price,
            quantity,
            new Date(),
            new Date()
        );
    }

}