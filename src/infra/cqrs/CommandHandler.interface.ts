export interface CommandHandler<T, Type> {
    handler(input: Type): Promise<T> | T
}