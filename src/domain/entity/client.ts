export default class Client {
    constructor(
        readonly id: string,
        readonly client_number: number,
        readonly instalation_number: number,
        readonly name: string,
        readonly address: string,
        readonly created_at: Date,
        readonly updated_at: Date
    ) { }

    static create(client_number: number, instalation_number: number, name: string, address: string): Client {
        const id = crypto.randomUUID();
        return new Client(id, client_number, instalation_number, name, address, new Date(), new Date());
    }
}