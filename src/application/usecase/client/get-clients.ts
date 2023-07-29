import Client from '../../../domain/entity/client';
import { CommandHandler } from '../../../infra/cqrs/CommandHandler.interface'
import ClientRepository from '../../repository/client.repository';

export default class GetClients implements CommandHandler<Promise<Client[]>, void> {
    constructor(private readonly repository: ClientRepository) { }
    handler(): Promise<Client[]> {
        return this.repository.getAll();
    }
}