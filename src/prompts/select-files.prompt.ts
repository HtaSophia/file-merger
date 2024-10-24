import { join } from "node:path";
import { isCancel, multiselect } from "@clack/prompts";
import { CURR_DIR } from "../utils/constants/system-info.const.js";
import { cancelProcess } from "../utils/helpers/clack/cancel-process.js";

export const selectFiles = async (fileNames: string[]): Promise<string[]> => {
    const selectedFiles = await multiselect({
        message: "Select the PDF files to merge:",
        options: fileNames.map((fileName) => ({
            value: fileName,
            label: fileName,
        })),
    });

    if (isCancel(selectFiles)) {
        cancelProcess();
    }

    return (selectedFiles as string[]).map((fileName) => join(CURR_DIR, fileName));
};
