import { FileSystem } from "../helpers/file-system/file-system.js";
import { FileExtension } from "../types/file-extension.js";

type Files = string | string[];

/**
 * Validates whether the given files have the specified file extension and are valid paths.
 *
 * @param files - A string or an array of strings representing file paths.
 * @param extension - The expected file extension for the files.
 * @returns A boolean indicating whether all files are valid and have the specified extension.
 */
export const validFilesOption = (files: Files, extension: FileExtension): boolean => {
    const parsedFiles = Array.isArray(files) ? files : files.trim().split(",");
    return parsedFiles.every(
        (filePath) => !!filePath && FileSystem.isValidPath(filePath) && FileSystem.hasFileExtension(filePath, extension)
    );
};
