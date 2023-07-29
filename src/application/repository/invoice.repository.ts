import Invoice from '../../domain/entity/invoice';
export default interface InvoiceRepository {
    save(invoice: Invoice): Promise<void>;
    get(id: string): Promise<Invoice | undefined>;
    getByBarCode(barcode: string): Promise<Invoice | undefined>;
    getByMonth(month: Date): Promise<Invoice | undefined>;
    checkIfInvoiceExists(input: { bar_code?: string, client_number: number, month_date?: Date }): Promise<boolean>
}