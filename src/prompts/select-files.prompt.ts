import { join } from "node:path";
import { isCancel, multiselect } from "@clack/prompts";
import { CURR_DIR } from "../utils/constants/system-info.const.js";
import { cancelProcess } from "./utils/cancel-process.js";

export const selectFiles = async (fileNames: string[]): Promise<string[]> => {
    const selectedFiles = await multiselect({
        message: "Select the files to merge:",
        options: fileNames.map((fileName) => ({
            value: fileName,
            label: fileName,
        })),
    });

    if (isCancel(selectedFiles)) {
        cancelProcess();
    }

    return (selectedFiles as string[]).map((fileName) => join(CURR_DIR, fileName));
};
