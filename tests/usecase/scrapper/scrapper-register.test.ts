import ScrapperRegister from "../../../src/application/usecase/scrapper/scrapper-register";
import RabbitMQAdapter from "../../../src/infra/queue/RabbitMQAdapter";
import ClientRepositoryDatabase from "../../../src/infra/repository/ClientRepositoryDatabase"
import InvoiceRepositoryDatabase from "../../../src/infra/repository/InvoiceRepositoryDatabase";
import InvoiceItemRepositoryDatabase from "../../../src/infra/repository/InvoiceItemRepositoryDatabase";

test('scrapper register', async () => {
    const clientRepository = new ClientRepositoryDatabase();
    const invoiceRepository = new InvoiceRepositoryDatabase();
    const itemRepository = new InvoiceItemRepositoryDatabase();
    const queue = new RabbitMQAdapter();

    let useCase = new ScrapperRegister(
        queue,
        clientRepository,
        invoiceRepository,
        itemRepository
    );
    await useCase.handler({ file: 'resources/invoices/3004298116-02-2023.pdf' });
})