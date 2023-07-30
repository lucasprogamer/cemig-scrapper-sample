import { CommandHandler } from '../../../infra/cqrs/CommandHandler.interface'
import ClientRepository from '../../repository/client.repository';
import Client from '../../../domain/entity/client';
import { ClientNotFoundException } from '../../exception/ClientNotFoundException';

export default class CreateClient implements CommandHandler<Promise<void | boolean>, Client> {

    constructor(private readonly repository: ClientRepository) { }
    async handler(input: Client): Promise<void> {
        const clientAlreadyExists = await this.checkIfClientAlreadyExists(input);
        if (!clientAlreadyExists) {
            try {
                return await this.repository.save(input);
            } catch (error) {
                console.log(error);
                throw new Error(`Client ${input.client_number} not can be saved`);
            }
        }
    }

    private async checkIfClientAlreadyExists(client: Client): Promise<boolean> {
        try {
            const result = await this.repository.getByClientNumber(client.client_number);
            if (result.client_number) return true;
        } catch (err) {
            if (err instanceof ClientNotFoundException) return false;
            throw err;
        }
        return false
    }
}