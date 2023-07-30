import Client from '../../domain/entity/client';
import Invoice from '../../domain/entity/invoice';
import InvoiceItem from '../../domain/entity/invoice-item';
import { Scrapper } from './Scrapper';

export class InvoiceScrapper extends Scrapper {

    constructor(pdfFilePath: string) {
        super(pdfFilePath);
    }

    public extractClient(): Client {
        const regex = /\b\d+\b/g;
        const name = this.getClientName();
        const numbers = this.rows[39].match(regex) ?? this.rows[40].match(regex);
        const client_number = numbers ? numbers[0] : '';
        const client_instalation = numbers ? numbers[1] : '';
        const address = `${this.rows[34]}, ${this.rows[35]}, ${this.rows[36]}`;
        return Client.create(BigInt(client_number), BigInt(client_instalation), name, address);
    }

    public extractInvoice(client_id: string): Invoice {
        return Invoice.create(
            this.getMonth(),
            this.getExpirationDate(),
            client_id,
            this.getTotal(),
            this.extractBarCode() ?? ''
        );
    }

    public extractTotalInvoice(): number {
        return this.getTotal();
    }

    public extractBarCode(): string | void {
        let match;
        let regex = /[0-9]{11}-[0-9]{1} [0-9]{11}-[0-9]{1} [0-9]{11}-[0-9]{1} [0-9]{11}-[0-9]{1}/g
        return this.rows
            .map(row => {
                if ((match = regex.exec(row)) != null) {
                    return match[0];
                }
            }).find(row => row)
    }

    public extractItems(invoice_id: string): InvoiceItem[] {
        let getData = false;
        let itemsRows = this.rows.filter(row => {
            if (row.match(/ICMSICMS/g)) {
                getData = true;
            }
            if (row.match(/TOTAL    /g)) {
                getData = false;
            }
            if (getData && !row.match(/ICMSICMS/g)) {
                return row;
            }
        })
        return this.createItemsFromRows(itemsRows, invoice_id);
    }

    private createItemsFromRows(rows: string[], invoice_id: string): InvoiceItem[] {
        let regex = /^(.*?k?Wh)\s+(-?\d+(?:\.\d+)?(?:,\d+)?)(?:\s+(-?\d+(?:\.\d+)?(?:,\d+)?)){2}(?:\s+(-?\d+(?:\.\d+)?(?:,\d+)?))?/;
        let items = rows.map((row: string) => {
            let match;
            if ((match = regex.exec(row)) != null) {
                return InvoiceItem.create(
                    this.extractDescription(match[1]),
                    parseFloat(match[3].replace(",", ".")),
                    invoice_id,
                    this.extractUnityFromDescription(match[1]),
                    parseFloat(match[3].replace(",", ".")),
                    parseFloat(match[2].replace(",", ".")),
                )
            } else {
                try {
                    return this.createTaxesItemFromRow(row, invoice_id)
                } catch (err) {
                    console.error(err);
                }
            }
            throw new Error('invalid item found');
        })
        return items
    }

    private createTaxesItemFromRow(item: string, invoice_id: string): InvoiceItem {
        let regex = /^(.*?)\s+(\d{1,3}(?:\.\d{3})*,\d{2})$/;
        let match;
        if ((match = regex.exec(item)) != null) {
            return InvoiceItem.create(
                match[1].trim(),
                parseFloat(match[2].replace(",", ".")),
                invoice_id
            )
        }
        throw new Error("taxes item not found")
    }

    private extractDescription(description: string) {
        return description.replace('kWh', '').replace('Wh', '');
    }

    private extractUnityFromDescription(description: string) {
        if (description.includes('kWh')) {
            return 'kWh';
        } else if (description.includes('Wh')) {
            return 'Wh';
        }
        return undefined;
    }

    public getMonth(): Date {
        let regex = /(JAN|FEV|MAR|ABR|MAI|JUN|JUL|AGO|SET|OUT|NOV|DEZ)\/\d{4}/;
        const data = this.rows[41].match(regex) ?? this.rows[42].match(regex);
        if (data) {
            return this.getDateFromString(data[0]);
        }
        throw 'Current date cannot be found'
    }

    private getDateFromString(date: string): Date {
        const match = date.match(/^(\w{3})\/(\d{4})$/);
        if (match) {
            const monthAbbreviations: any = {
                JAN: 0,
                FEV: 1,
                MAR: 2,
                ABR: 3,
                MAI: 4,
                JUN: 5,
                JUL: 6,
                AGO: 7,
                SET: 8,
                OUT: 9,
                NOV: 10,
                DEZ: 11
            };

            const month = monthAbbreviations[match[1].toUpperCase()];
            const year = parseInt(match[2], 10);

            if (month !== undefined && !isNaN(year)) {
                return new Date(year, month, 1);
            }
        }
        throw `date from string cannot be found ${date}`
    }

    private getExpirationDate(): Date {
        let regex = /\d{2}\/\d{2}\/\d{4}/
        const data = this.rows[41].match(regex) ?? this.rows[42].match(regex);
        if (data) {
            let expiration_date = data[0];
            expiration_date = expiration_date.split('/').reverse().join('-');
            return new Date(expiration_date);
        }
        throw 'Expiration date cannot be found'
    }

    private getTotal(): number {
        let regex = /\d{1,3},\d{2}/
        const data = this.rows[41].match(regex) ?? this.rows[42].match(regex);
        if (data) {
            return parseFloat(data[0].replace(',', '.'));
        }
        throw 'Total cannot be found'
    }

    private getClientName(): string {
        return this.rows[33];
    }

}