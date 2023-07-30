import { Prisma, PrismaClient } from "@prisma/client";
import InvoiceRepository from "../../application/repository/invoice.repository";
import Invoice from "../../domain/entity/invoice";

export default class InvoiceRepositoryDatabase implements InvoiceRepository {

    constructor(private readonly prisma: PrismaClient) { }

    async save(invoice: Invoice): Promise<void> {
        await this.prisma.invoice.create({ data: invoice })
    }

    async get(id: string): Promise<any> {
        return this.prisma.invoice.findFirstOrThrow({ where: { id: id } });
    }

    async getByBarCode(barcode: string): Promise<any> {
        return this.prisma.invoice.findFirstOrThrow({ where: { barcode: barcode } });
    }

    async getByMonth(date: Date): Promise<any> {
        return this.prisma.invoice.findFirstOrThrow({ where: { month_date: date } });
    }

    async checkIfInvoiceExists(input: { bar_code: string, client_number: bigint, month_date: Date }): Promise<boolean> {

        const res = await this.prisma.$queryRaw<{ counter: number }>
            (Prisma.sql`SELECT COUNT(*) as counter 
                        FROM invoices
                        INNER JOIN clients ON clients.id = invoices.client_id
                        WHERE
                        (
                            invoices.barcode = ${input.bar_code} AND invoices.month_date = ${input.month_date} 
                        ) 
                        AND clients.client_number = ${input.client_number}`);
        return res.counter > 0;
    }

}