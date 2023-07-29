import pgp from "pg-promise";
import InvoiceRepository from "../../application/repository/invoice.repository";
import Invoice from "../../domain/entity/invoice";

export default class InvoiceRepositoryDatabase implements InvoiceRepository {

    private url_connection: string = process.env.DB_URL ?? 'postgres://postgres:postgres@postgres:5432/postgres';

    async save(invoice: Invoice): Promise<void> {
        const connection = pgp()(this.url_connection);
        await connection.query("insert into invoices (id, month_date, expiration_date, total, bar_code, client_id) values ($1, $2, $3, $4, $5, $6)",
            [
                invoice.id,
                invoice.month_date,
                invoice.expiration_date,
                invoice.total,
                invoice.barcode,
                invoice.client_id
            ]
        );
        await connection.$pool.end();
    }

    async get(id: string): Promise<Invoice | undefined> {
        const connection = pgp()(this.url_connection);
        const [data] = await connection.query("select * from invoices where id = $1", [id]);
        await connection.$pool.end();
        if (data)
            return new Invoice(
                data.id,
                data.month_date,
                data.expiration_date,
                data.total,
                data.bar_code,
                data.client_id
            );
    }

    async getByBarCode(barcode: string): Promise<Invoice | undefined> {
        const connection = pgp()(this.url_connection);
        const [data] = await connection.query("select * from invoices where bar_code = $1", [barcode]);
        await connection.$pool.end();
        if (data)
            return new Invoice(
                data.id,
                data.month_date,
                data.expiration_date,
                data.total,
                data.bar_code,
                data.client_id
            );
    }

    async getByMonth(date: Date): Promise<Invoice | undefined> {
        const connection = pgp()(this.url_connection);
        const [data] = await connection.query("select * from invoices where month_date = $1", [date]);
        await connection.$pool.end();
        if (data) {
            return new Invoice(
                data.id,
                data.month_date,
                data.expiration_date,
                data.total,
                data.bar_code,
                data.client_id
            );
        }
    }

    async checkIfInvoiceExists(input: { bar_code: string, client_number: number, month_date: Date }): Promise<boolean> {
        const connection = pgp()(this.url_connection);
        const query = `SELECT COUNT(*) 
        FROM invoices
        INNER JOIN clients ON clients.id = invoices.client_id::uuid
        WHERE
            (
                invoices.bar_code = $1 AND invoices.month_date = $2 
            ) 
            AND clients.client_number =$3`;

        const [counter] = await connection.query(query, [input.bar_code, input.month_date, input.client_number])
        return counter > 0;
    }

}