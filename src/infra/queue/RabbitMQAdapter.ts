import Queue from "./queue.interface";
import amqp, { Connection } from "amqplib";

export default class RabbitMQAdapter implements Queue {
    private connection!: Connection;

    async connect(): Promise<void> {
        this.connection = await amqp.connect(process.env.RABBIT_URL ?? 'amqp://localhost:5672');
    }

    async on(queueName: string, callback: Function, args?: { prefetch?: number }): Promise<void> {
        const channel = await this.connection.createChannel();
        if (args && args.prefetch) {
            channel.prefetch(1);
        }
        await channel.assertQueue(queueName, { durable: true });
        channel.consume(queueName, async function (msg: any) {
            const input = JSON.parse(msg?.content?.toString());
            await callback(input)
            channel.ack(msg);
        });
    }

    async publish(queueName: string, data: any): Promise<void> {
        const channel = await this.connection.createChannel();
        await channel.assertQueue(queueName, {
            durable: true, arguments: {

            }
        });
        await channel.sendToQueue(queueName, Buffer.from(this.serializeQueueMessage(data)));
    }

    async queueCount(queueName: string): Promise<number> {
        const channel = await this.connection.createChannel();
        await channel.assertQueue(queueName, { durable: true });
        const queueInfo = await channel.checkQueue(queueName);
        channel.close();
        await this.connection.close();
        return queueInfo.messageCount;
    }

    private serializeQueueMessage(data: any): string {
        return JSON.stringify(data, (_, v) => typeof v === 'bigint' ? v.toString() : v)
    }
}