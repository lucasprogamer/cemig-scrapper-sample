import ScrapperLoad from "../../../src/application/usecase/scrapper/scrapper-load";
import RabbitMQAdapter from "../../../src/infra/queue/RabbitMQAdapter";

test('should be load invoices and put on queue', async () => {
    const queue = new RabbitMQAdapter();
    await queue.connect();
    let useCase = new ScrapperLoad(queue);
    useCase.handler();
})