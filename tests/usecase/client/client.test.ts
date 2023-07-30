import CreateClient from "../../../src/application/usecase/client/create-client"
import GetClient from "../../../src/application/usecase/client/get-client";
import GetClients from "../../../src/application/usecase/client/get-clients";
import Client from "../../../src/domain/entity/client";
import { ClientRepositoryMock } from "../../mocks/ClientRepository.mock"
const repository = new ClientRepositoryMock();

test('should create a new client', async () => {
    const useCase = new CreateClient(repository);
    const client = Client.create(BigInt(12341), BigInt(5678), 'Manuel Rodrigues da Silva', 'Rua São Roque do Paraguaçu, Vila Quintana, São Paulo-SP, CEP: 04837-150');
    await useCase.handler(client);
    const clientFromRepository = await repository.get(client.id);
    expect(client).toBeInstanceOf(Client);
    expect(client.id).toBe(clientFromRepository.id);
});

test('should find a client', async () => {
    const client = Client.create(BigInt(1234), BigInt(5678), 'José Pereira dos Santos', 'Avenida E, Residencial Park dos Buritis, Gurupi-TO, CEP: 77426-072');
    await repository.save(client);
    const useCase = new GetClient(repository);
    const clientFromUseCase = await useCase.handler({ id: client.id });
    expect(client).toBeInstanceOf(Client);
    expect(client.id).toBe(clientFromUseCase.id);
});


test('should return a list of clients', async () => {
    const client = Client.create(BigInt(1234), BigInt(5678), 'Thiago Pereira Almeida', 'Avenida E, Residencial Park dos Buritis, Gurupi-TO, CEP: 77426-072');
    await repository.save(client);
    const useCase = new GetClients(repository);
    const list = await useCase.handler();
    expect(list).toBeInstanceOf(Array<Client>);
    expect(list.length).toBeGreaterThan(0);
});