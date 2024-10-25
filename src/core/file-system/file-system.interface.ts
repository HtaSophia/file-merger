export interface IFileSystem {
    getFiles(directory: string): Promise<string[]>;
    readFile(path: string): Promise<Buffer>;
    writeFile(path: string, content: Uint8Array): Promise<void>;
    getPdfFiles(directory: string): Promise<string[]>;
    joinPaths(...paths: string[]): string;
}
