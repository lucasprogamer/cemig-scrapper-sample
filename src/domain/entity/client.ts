export default class Client {
    constructor(
        readonly id: string,
        readonly client_number: bigint,
        readonly instalation_number: bigint,
        readonly name: string,
        readonly address: string,
        readonly created_at: Date,
        readonly updated_at: Date
    ) { }

    static create(client_number: bigint, instalation_number: bigint, name: string, address: string): Client {
        const id = crypto.randomUUID();
        return new Client(id, client_number, instalation_number, name, address, new Date(), new Date());
    }
}