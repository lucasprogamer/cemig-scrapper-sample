export interface ScrapperInterface {
    parse(): void;
    getNumberOfPages(): number;
    getNumberOfRows(): number;
    getRows(): string[];
}