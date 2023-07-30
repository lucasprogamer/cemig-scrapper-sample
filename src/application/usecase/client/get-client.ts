import Client from '../../../domain/entity/client';
import { CommandHandler } from '../../../infra/cqrs/CommandHandler.interface'
import ClientRepository from '../../repository/client.repository';

export default class GetClient implements CommandHandler<Promise<Client>, input> {

    constructor(private readonly repository: ClientRepository) { }
    handler(input: input): Promise<Client> {
        return this.repository.get(input.id);
    }
}

type input = {
    id: string
}