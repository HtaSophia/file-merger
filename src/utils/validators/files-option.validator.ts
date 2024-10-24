import { InvalidArgumentError } from "commander";
import { FileExtension } from "../types/file-extension.js";
import { hasExtension, isValidPath } from "./file-path.validator.js";

export const validFilesOption = (filesSeparatedByComma: string, type: FileExtension): string[] => {
    const files = filesSeparatedByComma.trim().split(",");
    const isValid = files.every((filePath) => !!filePath && isValidPath(filePath) && hasExtension(filePath, type));

    if (!isValid) {
        throw new InvalidArgumentError("Invalid file paths");
    }

    return files;
};
