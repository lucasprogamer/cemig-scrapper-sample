import Client from '../../domain/entity/client';
export default interface ClientRepository {
    get(id: string): Promise<Client>;
    getByClientNumber(id: number): Promise<Client>;
    getAll(): Promise<Client[]>
    save(client: Client): Promise<void>;
}