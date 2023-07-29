import { CommandHandler } from '../../../infra/cqrs/CommandHandler.interface'
import ClientRepository from '../../repository/client.repository';

export default class CreateClient implements CommandHandler<Promise<void>, input> {

    constructor(private readonly repository: ClientRepository) { }
    handler(input: input): Promise<void> {
        try {
            return this.repository.save(input);
        } catch (error) {
            throw new Error(`Client ${input.client_number} not can be saved`);
        }
    }
}
type input = {
    readonly id: string,
    readonly client_number: number,
    readonly instalation_number: number,
    readonly name: string,
    readonly address: string
}