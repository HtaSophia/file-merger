import { readdir } from "node:fs/promises";
import { CURR_DIR } from "../../constants/system-info.const.js";
import { FileExtension } from "../../types/file-extension.js";
import { hasExtension } from "../../validators/file-path.validator.js";

export const getFilesFromCurrentDirectory = async (extension: FileExtension): Promise<string[]> => {
    const files = await readdir(CURR_DIR, "utf-8");
    return files.filter((file) => hasExtension(file, extension));
};
