import Client from '../../../domain/entity/client';
import Invoice from '../../../domain/entity/invoice';
import InvoiceItem from '../../../domain/entity/invoice-item';
import { CommandHandler } from '../../../infra/cqrs/CommandHandler.interface'
import Queue from '../../../infra/queue/queue.interface';
import { InvoiceScrapper } from '../../../infra/scrapper/InvoiceScrapper';
import { ClientNotFoundException } from '../../exception/ClientNotFoundException';
import ClientRepository from '../../repository/client.repository';
import InvoiceRepository from '../../repository/invoice.repository';
import CreateClient from '../client/create-client';


export default class ScrapperRegister implements CommandHandler<void, input> {
    constructor(
        private readonly queue: Queue,
        private readonly clientRepository: ClientRepository,
        private readonly invoiceRepository: InvoiceRepository
    ) { }

    async handler(input: input): Promise<void> {
        // let invoice_file = __dirname + '/../' + input.file;
        let invoice_file = __dirname + '/../../../../' + input.file;
        const scrapper = new InvoiceScrapper(invoice_file);
        await scrapper.parse();
        const isRegisteredInvoice = await this.checkIfInvoiceAreRegistered(scrapper);
        if (!isRegisteredInvoice) {
            await this.processData(scrapper);
        }
    }

    private async checkIfInvoiceAreRegistered(scrapper: InvoiceScrapper): Promise<boolean> {
        const client = scrapper.extractClient();
        const invoice = scrapper.extractInvoice(client.id);
        return await this.invoiceRepository.checkIfInvoiceExists({ bar_code: invoice.barcode, month_date: invoice.month_date, client_number: client.client_number });
    }

    private async processData(scrapper: InvoiceScrapper) {
        let client = scrapper.extractClient();
        if (client.client_number) {
            client = await this.saveOrGetClientIfExists(client);
            let invoice = scrapper.extractInvoice(client.id);
            invoice.client_id = client.id;
            let items = scrapper.extractItems(invoice.id);
            items = await this.setInvoiceIdOnItems(items, invoice.id);
            await this.publishInvoice(invoice, items);
        }
    }

    private async setInvoiceIdOnItems(items: InvoiceItem[], invoice_id: string): Promise<InvoiceItem[]> {
        return items.map(item => {
            item.invoice_id = invoice_id
            return item;
        });
    }

    private async publishInvoice(invoice: Invoice, items: InvoiceItem[]): Promise<void> {
        this.queue.publish('create_invoice', { invoice: invoice, items: items });
    }

    private async saveOrGetClientIfExists(client: Client): Promise<Client> {
        try {
            return await this.clientRepository.getByClientNumber(client.client_number);
        } catch (error) {
            if (error instanceof ClientNotFoundException) {
                await this.saveClient(client);
                return client;
            }
            throw new Error(`cannot be found client ${client.client_number}`);
        }
    }

    private async saveClient(client: Client): Promise<void> {
        const command = new CreateClient(this.clientRepository);
        await command.handler(client);
    }

}

type input = {
    file: string
}