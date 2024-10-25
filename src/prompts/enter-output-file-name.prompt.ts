import { isCancel, text } from "@clack/prompts";
import { cancelProcess } from "../utils/helpers/clack/cancel-process.js";
import { FileSystem } from "../utils/helpers/file-system/file-system.js";

export const enterOutputFileName = async (): Promise<string> => {
    const outputFileName = await text({
        message: "Enter the output file name:",
        placeholder: "mergedFiles",
        validate: (value) => validateOutputFileName(value),
    });

    if (isCancel(outputFileName)) {
        cancelProcess();
    }

    const { fileName, extension } = splitOutputFileName(outputFileName as string);
    return `${fileName}${extension ? `.${extension}` : ""}`;
};

const splitOutputFileName = (outputFileName: string): { fileName: string; extension?: string } => {
    const [fileName, extension] = outputFileName.trim().split(".");
    return { fileName, extension };
};

const validateOutputFileName = (outputFileName: string): string | void => {
    if (!outputFileName) {
        return "Output file name cannot be empty.";
    }

    const { fileName } = splitOutputFileName(outputFileName);
    const { valid, reason } = FileSystem.isValidFileName(fileName);
    if (!valid) return reason;
};
