import { existsSync, accessSync, constants } from "node:fs";
import { readFile as fsReadFile, readdir, writeFile as fsWriteFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";

import { FileExtension } from "../../utils/types/file-extension.js";
import { FORBIDDEN_CHARS_REGEX, RESERVED_NAMES_REGEX, MAX_LENGTH } from "../../utils/constants/file-name.const.js";
import { IFileSystem } from "./file-system.interface.js";

export class FileSystem implements IFileSystem {
    public static hasFileExtension(filePath: string, expectedExtension: FileExtension): boolean {
        return extname(filePath).toLowerCase() === expectedExtension;
    }

    public static isValidFileName(fileName: string): { valid: boolean; reason?: string } {
        if (FORBIDDEN_CHARS_REGEX.test(fileName) || RESERVED_NAMES_REGEX.test(fileName)) {
            return {
                valid: false,
                reason: `File name ${fileName} contains forbidden characters`,
            };
        }

        if (fileName.length > MAX_LENGTH) {
            return {
                valid: false,
                reason: `File name ${fileName} is too long`,
            };
        }

        if (fileName.endsWith(" ") || fileName.endsWith(".")) {
            return {
                valid: false,
                reason: `File name ${fileName} cannot end with a space or a period`,
            };
        }

        return { valid: true };
    }

    public static isValidPath(path: string): boolean {
        try {
            const normalizedPath = FileSystem.normalizePath(path);
            accessSync(normalizedPath, constants.R_OK);
            return true;
        } catch (error) {
            return false;
        }
    }

    public static isValidPathAndFileExtension(path: string, expectedExtension: FileExtension): boolean {
        return FileSystem.isValidPath(path) && FileSystem.hasFileExtension(path, expectedExtension);
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

    public async getFilesWithExtension(directory: string, extension: FileExtension): Promise<string[]> {
        if (!existsSync(directory)) {
            throw new Error(`Directory path ${directory} does not exist`);
        }

        const files = await this.getFiles(directory);
        return files.filter((file) => FileSystem.hasFileExtension(file, extension));
    }

    public readFile(path: string): Promise<Buffer> {
        if (!existsSync(path)) {
            throw new Error(`Path ${path} does not exist`);
        }

        return fsReadFile(path);
    }

    public readFileContent(path: string): Promise<string> {
        if (!existsSync(path)) {
            throw new Error(`Path ${path} does not exist`);
        }

        return fsReadFile(path, "utf-8");
    }

    public writeFile(path: string, content: Uint8Array | string): Promise<void> {
        return fsWriteFile(path, content);
    }

    public joinPaths(...paths: string[]): string {
        return join(...paths);
    }
}
