import CreateClient from "../../application/usecase/client/create-client";
import CreateInvoiceItem from "../../application/usecase/invoice-item/create-invoice-item";
import CreateInvoice, { createInvoiceInput } from "../../application/usecase/invoice/create-invoice";
import ScrapperRegister from "../../application/usecase/scrapper/scrapper-register";
import Client from "../../domain/entity/client";
import Invoice from "../../domain/entity/invoice";
import InvoiceItem from "../../domain/entity/invoice-item";
import Queue from "./queue.interface";

export default class QueueConsumer {

    constructor(
        private readonly queue: Queue,
        scrapperRegister: ScrapperRegister,
        createClient: CreateClient,
        createInvoice: CreateInvoice,
        createItem: CreateInvoiceItem,
    ) {

        queue.on("invoice_files", async function (file: string) {
            scrapperRegister.handler({ file: file });
        });
        queue.on("create_client", async function (message: Client) {
            createClient.handler(message);
        });
        queue.on("create_invoice", async function (message: createInvoiceInput) {
            createInvoice.handler(message);
        });
        queue.on("create_item", async function (msg: InvoiceItem) {
            createItem.handler(msg);
        });
    }
}
