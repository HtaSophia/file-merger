import { isCancel, text } from "@clack/prompts";
import { cancelProcess } from "../utils/helpers/clack/cancel-process.js";
import { FileExtension } from "../utils/types/file-extension.js";
import { validFilesOption } from "../utils/validators/files-option.validator.js";

export const enterFilePaths = async (fileExtension: FileExtension): Promise<string[]> => {
    const filePaths = await text({
        message: "Enter the file paths (separated by comma):",
        placeholder: "/path/to/file.pdf, /file.pdf",
        validate(value) {
            if (validFilesOption(value, fileExtension)) {
                return;
            }

            return `⚠️ Invalid file paths. Please provide valid file paths.`;
        },
    });

    if (isCancel(filePaths)) {
        cancelProcess();
    }

    return (filePaths as string).split(",");
};
