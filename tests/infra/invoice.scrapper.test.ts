import Client from "../../src/domain/entity/client";
import Invoice from "../../src/domain/entity/invoice";
import Item from "../../src/domain/entity/invoice-item";
import { InvoiceScrapper } from "../../src/infra/scrapper/InvoiceScrapper";


test("should be read total from invoice", async () => {
    const scrapper = new InvoiceScrapper(__dirname + '/../contents/sample.pdf');
    await scrapper.parse();
    expect(scrapper.extractTotalInvoice()).toEqual(158.17);
});


test("should be read the barcode from invoice", async () => {
    const scrapper = new InvoiceScrapper(__dirname + '/../contents/sample.pdf');
    await scrapper.parse();
    expect(scrapper.extractBarCode()).toEqual('83610000001-4 58170138009-8 71075192433-7 08118741548-4');
})

test("should be create items from pdf file", async () => {
    const scrapper = new InvoiceScrapper(__dirname + '/../contents/sample.pdf');
    await scrapper.parse();
    const items = scrapper.extractItems();
    expect(items.length).toBeGreaterThan(0);
    expect(items[0] instanceof Item).toBe(true)
});


test("should be create Invoice from pdf file", async () => {
    const scrapper = new InvoiceScrapper(__dirname + '/../contents/sample.pdf');
    await scrapper.parse();
    const invoice = scrapper.extractInvoice();
    expect(invoice instanceof Invoice).toBe(true)
});

test("should be create Client from pdf file", async () => {
    const scrapper = new InvoiceScrapper(__dirname + '/../contents/sample.pdf');
    await scrapper.parse();
    const client = scrapper.extractClient();
    expect(client instanceof Client).toBe(true)
});