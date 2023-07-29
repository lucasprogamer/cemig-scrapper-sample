export class ClientNotFoundException extends Error {
    constructor(message?: string) {
        super(message ?? "Client not found");
    }
}