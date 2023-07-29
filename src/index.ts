import express from "express";
import ClientRepositoryDatabase from "./infra/repository/ClientRepositoryDatabase";
import GetClients from "./application/usecase/client/get-clients";
import getClient from "./application/usecase/client/get-client";
import QueueConsumer from "./infra/queue/QueueConsumer";
import RabbitMQAdapter from "./infra/queue/RabbitMQAdapter";
import ScrapperRegister from "./application/usecase/scrapper/scrapper-register";
import InvoiceRepositoryDatabase from "./infra/repository/InvoiceRepositoryDatabase";
import CreateClient from "./application/usecase/client/create-client";
import CreateInvoice from "./application/usecase/invoice/create-invoice";
import CreateInvoiceItem from "./application/usecase/invoice-item/create-invoice-item";
import dotenv from 'dotenv'
import InvoiceItemRepositoryDatabase from "./infra/repository/InvoiceItemRepositoryDatabase";

async function main() {
    dotenv.config()
    const app = express();
    app.use(express.json());
    const queue = new RabbitMQAdapter();
    const clientRepository = new ClientRepositoryDatabase();
    const invoiceRepository = new InvoiceRepositoryDatabase();
    const itemRepository = new InvoiceItemRepositoryDatabase();
    const scrapperRegister = new ScrapperRegister(
        queue,
        clientRepository,
        invoiceRepository,
        itemRepository
    );
    const createClient = new CreateClient(clientRepository);
    const createInvoice = new CreateInvoice(invoiceRepository, queue);
    const createInvoiceItem = new CreateInvoiceItem(itemRepository);
    await queue.connect();
    new QueueConsumer(queue, scrapperRegister, createClient, createInvoice, createInvoiceItem);

    app.get('/', (req, res) => {
        res.send('hello world');
    })
    app.get('/api/clients', async (req, res) => {
        let clientRepository = new ClientRepositoryDatabase();
        let useCase = new GetClients(clientRepository);
        let response = await useCase.handler();
        res.send({
            "data": response
        });
    })
    app.get('/api/clients/:id', async (req, res) => {
        try {
            let clientRepository = new ClientRepositoryDatabase();
            let useCase = new getClient(clientRepository);
            let response = await useCase.handler({ id: req.params.id });
            res.send({
                "data": response
            });
        } catch (error) {
            res.status(400)
            res.send({
                error: error
            })
        }
    })

    app.listen(3001, () => {
        console.log(`⚡️[server]: Server is running`)
    });
}

main();