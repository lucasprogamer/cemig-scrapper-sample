import ScrapperRegister from "../../../src/application/usecase/scrapper/scrapper-register";
import RabbitMQAdapter from "../../../src/infra/queue/RabbitMQAdapter";
import ClientRepositoryDatabase from "../../../src/infra/repository/ClientRepositoryDatabase"
import InvoiceRepositoryDatabase from "../../../src/infra/repository/InvoiceRepositoryDatabase";

import { PrismaClient, Prisma } from '@prisma/client'
test('scrapper register', async () => {

    const prisma = new PrismaClient()
    const clientRepository = new ClientRepositoryDatabase(prisma);
    const invoiceRepository = new InvoiceRepositoryDatabase(prisma);
    const queue = new RabbitMQAdapter();
    await queue.connect();

    let useCase = new ScrapperRegister(
        queue,
        clientRepository,
        invoiceRepository,
    );
    await useCase.handler({ file: 'resources/invoices/3004298116-02-2023.pdf' });
})