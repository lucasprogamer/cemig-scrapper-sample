import InvoiceItem from '../../domain/entity/invoice-item';
export default interface InvoiceItemRepository {
    save(item: InvoiceItem): Promise<void>;
    get(id: string): Promise<InvoiceItem>;
}