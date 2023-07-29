import { CommandHandler } from '../../../infra/cqrs/CommandHandler.interface'
import ClientRepository from '../../repository/client.repository';
import ItemRepository from '../../repository/invoice-item.repository';

export default class CreateInvoiceItem implements CommandHandler<Promise<void>, input> {

    constructor(private repository: ItemRepository) { }
    handler(input: input): Promise<void> {
        try {
            return this.repository.save(input);
        } catch (error) {
            console.log(error);
            throw new Error(`Item ${input.description} not can be saved`);
        }
    }
}
type input = {
    id: string,
    description: string,
    total_price: number,
    unity?: 'kWh' | 'Wh',
    unit_price?: number,
    quantity?: number,
    invoice_id?: string,
}