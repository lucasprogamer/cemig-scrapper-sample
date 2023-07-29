import Queue from "./queue.interface";
import amqp from "amqplib";

export default class RabbitMQAdapter implements Queue {
    connection: any;

    async connect(): Promise<void> {
        this.connection = await amqp.connect(process.env.RABBIT_URL ?? 'amqp://rabbitmq:5672');
    }

    async on(queueName: string, callback: Function): Promise<void> {
        const channel = await this.connection.createChannel();
        await channel.assertQueue(queueName, { durable: true });
        channel.consume(queueName, async function (msg: any) {
            const input = JSON.parse(msg?.content?.toString());
            await callback(input)
        });
    }

    async publish(queueName: string, data: any): Promise<void> {
        const channel = await this.connection.createChannel();
        await channel.assertQueue(queueName, { durable: true });
        await channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)));
    }

    async getNext(queueName: string): Promise<string> {
        const channel = await this.connection.createChannel();
        await channel.assertQueue(queueName, { durable: true });
        const { message } = await channel.get(queueName);
        channel.ack(message);
        await channel.close();
        this.connection.close();
        return message.content.toString();
    }

    async queueCount(queueName: string): Promise<number> {
        const channel = await this.connection.createChannel();
        await channel.assertQueue(queueName, { durable: true });
        const queueInfo = await channel.checkQueue(queueName);
        channel.close();
        await this.connection.close();
        return queueInfo.messageCount;
    }
}