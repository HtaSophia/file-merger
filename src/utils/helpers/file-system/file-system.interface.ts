export interface IFileSystem {
    getFiles(directory: string): Promise<string[]>;
    readFile(path: string): Promise<Buffer>;
    writeFile(path: string, content: string): Promise<void>;
    getPdfFiles(directory: string): Promise<string[]>;
}
