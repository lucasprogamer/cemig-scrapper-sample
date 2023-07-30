import { ClientNotFoundException } from "../../src/application/exception/ClientNotFoundException";
import ClientRepository from "../../src/application/repository/client.repository";
import Client from "../../src/domain/entity/client";

export class ClientRepositoryMock implements ClientRepository {
    private clients: Client[] = [];
    get(id: string): Promise<Client> {
        return new Promise<Client>((resolve, reject) => {
            const client = this.clients.find(client => client.id === id);
            if (client) resolve(client);
            reject(new ClientNotFoundException(`Client ${id} not found`));
        });
    }
    getByClientNumber(number: bigint): Promise<Client> {
        return new Promise<Client>((resolve, reject) => {
            const client = this.clients.find(client => client.client_number === number);
            if (client) resolve(client);
            reject(new ClientNotFoundException(`Client ${number} not found`));

        });
    }
    getAll(): Promise<Client[]> {
        return new Promise<Client[]>(resolve => {
            resolve(this.clients);
        });
    }
    save(client: Client): Promise<void> {
        return new Promise(resolve => {
            this.clients.push(client)
            resolve();
        });
    }

}