import { isCancel, text } from "@clack/prompts";
import { cancelProcess } from "../utils/helpers/clack/cancel-process.js";

export const enterOutputFileName = async (): Promise<string> => {
    const outputFileName = await text({
        message: "Enter the output file name (without extension):",
        placeholder: "mergedFiles",
    });

    if (isCancel(outputFileName)) {
        cancelProcess();
    }

    return outputFileName as string;
};
