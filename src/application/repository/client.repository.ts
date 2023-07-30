import Client from '../../domain/entity/client';
export default interface ClientRepository {
    get(id: string): Promise<Client>;
    getByClientNumber(number: bigint): Promise<Client>;
    getAll(): Promise<Client[]>
    save(client: Client): Promise<void>;
}