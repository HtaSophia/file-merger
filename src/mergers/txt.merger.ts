import { IFileSystem } from "../core/file-system/file-system.interface.js";
import { IFileMerger } from "./file-merger.interface.js";

export class TxtMerger implements IFileMerger {
    constructor(private readonly fileSystem: IFileSystem) {}

    async merge(files: string[], output: string): Promise<void> {
        const fileContents = await this.readFiles(files);
        await this.fileSystem.writeFile(output, fileContents.join("\n\n"));
    }

    private async readFiles(files: string[]): Promise<string[]> {
        return Promise.all(files.map((file) => this.fileSystem.readFileContent(file)));
    }
}
