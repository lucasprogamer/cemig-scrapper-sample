import * as fs from 'fs';
import PDFReader from 'pdf-parse';
import { ScrapperInterface } from './Scrapper.interface';

export class Scrapper implements ScrapperInterface {
    private pdfFilePath: string;
    protected rows: string[] = [];
    protected numberOfPages: number = 0;
    protected numberOfRows: number = 0;

    constructor(pdfFilePath: string) {
        this.pdfFilePath = pdfFilePath;
    }

    public parse() {
        return new Promise((resolve, reject) => {
            const dataBuffer = fs.readFileSync(this.pdfFilePath);
            PDFReader(dataBuffer).then((data) => {
                const rows = data.text.split('\n');
                rows.forEach((row: string, index) => {
                    this.rows.push(row);
                });
                this.numberOfPages = data.numpages;
                this.numberOfRows = this.rows.length;
                resolve(true)
            }).catch(reject);
        })
    }

    public getNumberOfPages(): number {
        return this.numberOfPages;
    }

    public getNumberOfRows(): number {
        return this.numberOfRows;
    }
    public getRows(): string[] {
        return this.rows;
    }
}