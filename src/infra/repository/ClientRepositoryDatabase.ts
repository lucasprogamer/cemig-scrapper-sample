import ClientRepository from "../../application/repository/client.repository";
import Client from "../../domain/entity/client";
import { ClientNotFoundException } from "../../application/exception/ClientNotFoundException";
import { PrismaClient } from "@prisma/client";

export default class ClientRepositoryDatabase implements ClientRepository {

    constructor(private readonly prisma: PrismaClient) { }

    async save(client: Client): Promise<void> {
        await this.prisma.client.create({
            data: client
        });
        return;
    }

    async get(id: string): Promise<Client> {
        const client = await this.prisma.client.findFirst({ where: { id: id } });
        if (client) return client;
        throw new ClientNotFoundException();
    }

    async getByClientNumber(number: bigint): Promise<Client> {
        const client = await this.prisma.client.findFirst({
            where: { client_number: number },
        })
        if (client) return client;
        throw new ClientNotFoundException();
    }

    async getAll(): Promise<Client[]> {
        return this.prisma.client.findMany();
    }

}