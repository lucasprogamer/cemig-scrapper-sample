import pgp from "pg-promise";
import InvoiceItemRepository from "../../application/repository/invoice-item.repository";
import Item from "../../domain/entity/invoice-item";
import InvoiceItem from "../../domain/entity/invoice-item";

export default class InvoiceItemRepositoryDatabase implements InvoiceItemRepository {

    private url_connection: string = 'postgres://postgres:postgres@postgres:5432/postgres';

    async save(item: InvoiceItem): Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                const connection = pgp()(this.url_connection);
                await connection.query("insert into invoice_items (id, description, total_price, unity, unit_price, quantity, invoice_id, created_at, updated_at) values ($1, $2, $3, $4, $5, $6, $7, $8, $9)",
                    [
                        item.id,
                        item.description,
                        item.total_price,
                        item.unity,
                        item.unit_price,
                        item.quantity,
                        item.invoice_id,
                        item.created_at,
                        item.updated_at
                    ]
                );
                await connection.$pool.end();
                resolve()
            } catch (error: any) {
                console.log(error);
                reject(error)
            }
        })
    }

    async get(id: string): Promise<Item> {
        const connection = pgp()(this.url_connection);
        const [data] = await connection.query("select * from invoice_items where id = $1", [id]);
        await connection.$pool.end();
        return new Item(
            data.id,
            data.description,
            data.unity,
            data.quantity,
            data.unit_price,
            data.total_price,
            data.invoice_id,
            data.created_at,
            data.updated_at
        );
    }
}