import { isCancel, text } from "@clack/prompts";
import { cancelProcess } from "./utils/cancel-process.js";
import { FileExtension } from "../utils/types/file-extension.js";
import { FileSystem } from "../core/file-system/file-system.js";

export const enterOutputFileName = async (extension: FileExtension): Promise<string> => {
    const outputFileName = await text({
        message: "Enter the output file name:",
        placeholder: "mergedFiles",
        validate: (value) => validateOutputFileName(value),
    });

    if (isCancel(outputFileName)) {
        cancelProcess();
    }

    const fileName = parseOutputFileName(outputFileName as string);
    return `${fileName}${extension}`;
};

const parseOutputFileName = (outputFileName: string): string => {
    return outputFileName.trim().split(".")[0];
};

const validateOutputFileName = (outputFileName: string): string | void => {
    if (!outputFileName) {
        return "Output file name cannot be empty.";
    }

    const fileName = parseOutputFileName(outputFileName);
    const { valid, reason } = FileSystem.isValidFileName(fileName);
    if (!valid) return reason;
};
