export default class InvoiceItem {

    constructor(
        readonly id: string,
        readonly description: string,
        readonly total_price: number,
        readonly unity?: 'kWh' | 'Wh',
        readonly unit_price?: number,
        readonly quantity?: number,
        public invoice_id?: string,
        public created_at?: Date,
        public updated_at?: Date
    ) {
    }

    public static create(description: string, total_price: number, invoice_id?: string, unity?: 'kWh' | 'Wh', unit_price?: number, quantity?: number) {
        return new InvoiceItem(
            crypto.randomUUID(),
            description,
            total_price,
            unity,
            unit_price,
            quantity,
            invoice_id,
            new Date(),
            new Date()
        );
    }

}