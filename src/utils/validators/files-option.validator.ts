import { FileExtension } from "../types/file-extension.js";
import { hasExtension, isValidPath } from "./file-path.validator.js";

type Files = string | string[];

/**
 * Validates whether the given files have the specified file extension and are valid paths.
 *
 * @param files - A string or an array of strings representing file paths.
 * @param type - The expected file extension for the files.
 * @returns A boolean indicating whether all files are valid and have the specified extension.
 */
export const validFilesOption = (files: Files, type: FileExtension): boolean => {
    const parsedFiles = Array.isArray(files) ? files : files.trim().split(",");
    return parsedFiles.every((filePath) => !!filePath && isValidPath(filePath) && hasExtension(filePath, type));
};
