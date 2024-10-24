import { extname, isAbsolute } from "node:path";
import { FileExtension } from "../types/file-extension.js";

export const getFileExtension = (filePath: string): string => {
    return extname(filePath);
};

export const hasExtension = (filePath: string, expectedExtension: FileExtension): boolean => {
    return getFileExtension(filePath) === expectedExtension;
};

export const isValidPath = (filePath: string) => {
    return isAbsolute(filePath);
};
