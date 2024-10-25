import { InvalidArgumentError } from "commander";
import { existsSync, accessSync, constants } from "node:fs";
import { readFile as fsReadFile, readdir, writeFile as fsWriteFile } from "node:fs/promises";
import { extname, normalize } from "node:path";

import { FileExtension } from "../../types/file-extension.js";
import { IFileSystem } from "./file-system.interface.js";

export class FileSystem implements IFileSystem {
    public static hasFileExtension(filePath: string, expectedExtension: FileExtension): boolean {
        return extname(filePath).toLowerCase() === expectedExtension;
    }

    public static isValidPath(path: string): boolean {
        try {
            accessSync(path, constants.R_OK);
            return true;
        } catch (error) {
            return false;
        }
    }

    public static normalizePath(path: string): string {
        return normalize(path);
    }

    public getFiles(directory: string): Promise<string[]> {
        if (!existsSync(directory)) {
            throw new Error(`Directory path ${directory} does not exist`);
        }

        return readdir(directory);
    }

    public async getPdfFiles(directory: string): Promise<string[]> {
        if (!existsSync(directory)) {
            throw new Error(`Directory path ${directory} does not exist`);
        }

        const files = await this.getFiles(directory);
        return files.filter((file) => FileSystem.hasFileExtension(file, FileExtension.PDF));
    }

    public readFile(path: string): Promise<Buffer> {
        if (!existsSync(path)) {
            throw new InvalidArgumentError(`Path ${path} does not exist`);
        }

        return fsReadFile(path);
    }

    public writeFile(path: string, content: string): Promise<void> {
        if (!existsSync(path)) {
            throw new InvalidArgumentError(`Path ${path} does not exist`);
        }

        return fsWriteFile(path, content);
    }
}
