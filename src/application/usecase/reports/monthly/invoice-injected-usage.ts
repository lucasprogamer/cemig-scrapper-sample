import { CommandHandler } from "../../../../infra/cqrs/CommandHandler.interface";
import InvoiceRepository from "../../../repository/invoice.repository";

export default class InvoiceInjectedUsageMonthly implements CommandHandler<Promise<output[]>, null> {

    constructor(private readonly repository: InvoiceRepository) { }


    async handler(): Promise<output[]> {
        const months = this.getLastMonths();
        const report = await this.repository.getLastYear({ item: "Energia injetada HFP" });
        return months.map(month => {
            const report_month = report.find((r: any) => this.getMonthFromDate(r.month_date) == month);
            const month_date = report_month?.month_date ? this.getMonthFromDate(report_month?.month_date ?? month) : month;
            const total = this.getMonthTotal(report_month?.InvoiceItem ?? [])
            return {
                name: month_date,
                ...total
            }
        });
    }

    private getMonthTotal(report_items: any[]): { quantity: number, total_price: number } {
        if (report_items.length === 0) return { quantity: 0, total_price: 0 }
        return report_items.map((item: any) => {
            item.total_price = -item.total_price
            return item
        }).reduce((acc, item) => {
            acc.quantity += item.quantity
            acc.total_price += item.total_price
        })
    }

    private getLastMonths() {
        const months = [];
        let currentDate = new Date();

        for (let i = 0; i < 12; i++) {
            months.push(this.getMonthFromDate(currentDate));
            currentDate.setMonth(currentDate.getMonth() - 1);
        }

        return months.reverse();
    }

    private getMonthFromDate(date: Date): string {
        return date.toISOString().slice(0, 7);
    }
}

type output = {
    name: string,
    quantity: number,
    total_price: number
}
