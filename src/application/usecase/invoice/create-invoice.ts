import Invoice from '../../../domain/entity/invoice';
import InvoiceItem from '../../../domain/entity/invoice-item';
import { CommandHandler } from '../../../infra/cqrs/CommandHandler.interface'
import Queue from '../../../infra/queue/queue.interface';
import InvoiceRepository from '../../repository/invoice.repository';

export default class CreateInvoice implements CommandHandler<Promise<void>, createInvoiceInput> {

    constructor(private readonly repository: InvoiceRepository, private readonly queue: Queue) { }
    async handler(input: createInvoiceInput): Promise<void> {
        try {
            await this.repository.save(input.invoice);
            let promises: any = [];
            input.items.forEach((item) => {
                promises.push(this.queue.publish('create_item', item))
            })
            await Promise.all(promises);
        } catch (error) {
            console.log(error);
            throw new Error(`invoice ${input.invoice.id} not can be saved`);
        }
    }
}

export type createInvoiceInput = {
    invoice: Invoice,
    items: InvoiceItem[]
}