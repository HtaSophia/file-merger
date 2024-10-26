export interface IFileSystem {
    getFiles(directory: string): Promise<string[]>;
    readFile(path: string): Promise<Buffer>;
    writeFile(path: string, content: Uint8Array): Promise<void>;
    getFilesWithExtension(directory: string, extension: string): Promise<string[]>;
    joinPaths(...paths: string[]): string;
}
