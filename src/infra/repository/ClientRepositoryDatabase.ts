import pgp from "pg-promise";
import ClientRepository from "../../application/repository/client.repository";
import Client from "../../domain/entity/client";
import { ClientNotFoundException } from "../../application/exception/ClientNotFoundException";

export default class ClientRepositoryDatabase implements ClientRepository {

    private url_connection: string = process.env.DB_URL ?? 'postgres://postgres:postgres@postgres:5432/postgres';

    async save(client: Client): Promise<void> {
        const connection = pgp()(this.url_connection);
        await connection.query("insert into clients (id, client_number, instalation_number, name, address, created_at, updated_at) values ($1, $2, $3, $4, $5, $6, $7)",
            [
                client.id,
                client.client_number,
                client.instalation_number,
                client.name,
                client.address,
                client.created_at,
                client.updated_at
            ]
        );
        await connection.$pool.end();
    }

    async get(id: string): Promise<Client> {
        const connection = pgp()(this.url_connection);
        const [data] = await connection.query("select * from clients where id = $1", [id]);
        await connection.$pool.end();
        if (data) {
            return new Client(
                data.id,
                data.client_number,
                data.instalation_number,
                data.name,
                data.address,
                data.created_at,
                data.updated_at
            );
        }
        throw new ClientNotFoundException();
    }

    async getByClientNumber(number: number): Promise<Client> {
        const connection = pgp()(this.url_connection);
        const [data] = await connection.query("select * from clients where client_number = $1", [number]);
        await connection.$pool.end();
        if (data) {
            return new Client(
                data.id,
                data.client_number,
                data.instalation_number,
                data.name,
                data.address,
                data.created_at,
                data.updated_at
            );
        }
        throw new ClientNotFoundException();
    }

    async getAll(): Promise<Client[]> {
        const connection = pgp()(this.url_connection);
        const data = await connection.query("select * from clients");
        await connection.$pool.end();
        let clients: Client[] = [];
        if (data && data.length > 0) {
            data.forEach((client: any) => {
                clients.push(new Client(
                    client.id,
                    client.client_number,
                    client.instalation_number,
                    client.name,
                    client.address,
                    client.created_at,
                    client.updated_at
                ));
            })
        }
        return clients;
    }

}