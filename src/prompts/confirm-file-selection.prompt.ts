import { confirm, isCancel } from "@clack/prompts";
import { cancelProcess } from "../utils/helpers/clack/cancel-process.js";

export const confirmFileSelection = async (): Promise<boolean> => {
    const selectFromCurrentDirectory = await confirm({
        message: "Do you want to select files in the current directory?",
    });

    if (isCancel(selectFromCurrentDirectory)) {
        cancelProcess();
    }

    return selectFromCurrentDirectory as boolean;
};
