export interface IFileSystem {
    getFiles(directory: string): Promise<string[]>;
    readFile(path: string): Promise<Buffer>;
    readFileContent(path: string): Promise<string>;
    writeFile(path: string, content: Uint8Array | string): Promise<void>;
    getFilesWithExtension(directory: string, extension: string): Promise<string[]>;
    joinPaths(...paths: string[]): string;
}
