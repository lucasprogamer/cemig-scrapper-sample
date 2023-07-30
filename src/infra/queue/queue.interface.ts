export default interface Queue {
    connect(): Promise<void>;
    on(queueName: string, callback: Function, args?: { prefetch?: number }): Promise<void>;
    publish(queueName: string, data: any): Promise<void>;
}