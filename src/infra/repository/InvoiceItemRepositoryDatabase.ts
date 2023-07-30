import { PrismaClient } from "@prisma/client";
import InvoiceItemRepository from "../../application/repository/invoice-item.repository";
import InvoiceItem from "../../domain/entity/invoice-item";

export default class InvoiceItemRepositoryDatabase implements InvoiceItemRepository {

    constructor(private readonly prisma: PrismaClient) { }

    async save(item: InvoiceItem): Promise<void> {
        await this.prisma.invoiceItem.create({ data: item })
    }

    async get(id: string): Promise<any> {
        return this.prisma.invoiceItem.findFirstOrThrow({ where: { id: id } });
    }
}