import { CommandHandler } from '../../../infra/cqrs/CommandHandler.interface'
import * as fs from 'fs';
import Queue from '../../../infra/queue/queue.interface';

export default class ScrapperLoad implements CommandHandler<Promise<void>, void> {
    private resource_path: string = 'resources/invoices/'
    private invoice_path: string = __dirname + '/../../../../' + this.resource_path;


    constructor(private readonly queue: Queue) { }

    handler(): Promise<void> {
        return new Promise((resolve, reject) => {
            fs.readdir(this.invoice_path, (err, files) => {
                if (err) {
                    reject(`invoice path errr ${err}`)
                }
                files.forEach((file) => {
                    if (file.split('.')[1] === 'pdf') {
                        this.queue.publish("invoice_files", this.resource_path + file)
                    }
                });
                resolve()
            });
        })
    }
}