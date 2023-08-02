import InvoiceRepository from "../../src/application/repository/invoice.repository";
import Invoice from "../../src/domain/entity/invoice";

export class InvoiceRepositoryMock implements InvoiceRepository {
    private invoices: Invoice[] = [];
    save(invoice: Invoice): Promise<void> {
        return new Promise<void>((resolve) => {
            this.invoices.push(invoice);
            resolve();
        })
    }
    get(id: string): Promise<Invoice> {
        return new Promise<Invoice>((resolve, reject) => {
            const invoice = this.invoices.find(invoice => invoice.id === id);
            if (invoice) resolve(invoice);
            reject(new Error(`Invoice not found: ${invoice?.id}`));
        });
    }
    getByBarCode(barcode: string): Promise<Invoice> {
        return new Promise<Invoice>((resolve, reject) => {
            const invoice = this.invoices.find(invoice => invoice.barcode === barcode);
            if (invoice) resolve(invoice);
            reject(new Error(`Invoice not found: ${invoice?.barcode}`));
        });
    }
    getByMonth(month: Date): Promise<Invoice> {
        return new Promise<Invoice>((resolve, reject) => {
            const invoice = this.invoices.find(invoice => invoice.month_date === month);
            if (invoice) resolve(invoice);
            reject(new Error(`Invoice not found: ${invoice?.month_date}`));
        });
    }
    checkIfInvoiceExists(input: { bar_code?: string, client_number: bigint, month_date?: Date }): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            const invoice = this.invoices.find(invoice => {
                if ((invoice.barcode === input.bar_code || invoice.month_date == input.month_date)) return true;
            });
            if (invoice) resolve(true);
            resolve(false)
        });
    }
    getLastYear(input: { client_id: string; }): Promise<any> {
        throw new Error("Method not implemented.");
    }

}