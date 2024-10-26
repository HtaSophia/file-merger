import { isCancel, text } from "@clack/prompts";
import { cancelProcess } from "./utils/cancel-process.js";
import { FileExtension } from "../utils/types/file-extension.js";
import { FileSystem } from "../core/file-system/file-system.js";

export const enterFilePaths = async (fileExtension: FileExtension): Promise<string[]> => {
    const filePaths = await text({
        message: "Enter the file paths (separated by comma):",
        placeholder: "C://path/to/file.pdf, ./file.pdf",
        validate: (value) => validateFilePaths(value, fileExtension),
    });

    if (isCancel(filePaths)) {
        cancelProcess();
    }

    return splitFilePaths(filePaths as string);
};

const splitFilePaths = (filePaths: string): string[] => filePaths.split(",").map((path) => path.trim());

const validateFilePaths = (filePaths: string, fileExtension: FileExtension): string | void => {
    const paths = splitFilePaths(filePaths);

    if (!paths.every((path) => FileSystem.isValidPathAndFileExtension(path, fileExtension))) {
        return `Invalid file paths. Please provide valid file paths.`;
    }
};
