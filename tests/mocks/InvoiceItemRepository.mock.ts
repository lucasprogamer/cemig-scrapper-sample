import InvoiceItemRepository from "../../src/application/repository/invoice-item.repository";
import InvoiceItem from "../../src/domain/entity/invoice-item";

export class InvoiceItemRepositoryMock implements InvoiceItemRepository {
    private invoice_items: InvoiceItem[] = [];
    save(item: InvoiceItem): Promise<void> {
        return new Promise<void>(resolve => {
            this.invoice_items.push(item);
            resolve();
        });
    }
    get(id: string): Promise<InvoiceItem> {
        return new Promise<InvoiceItem>((resolve, reject) => {
            const item = this.invoice_items.find(item => item.id === id);
            if (item) resolve(item);
            reject(new Error(`Invoice Item ${id} not found`));
        });
    }
}