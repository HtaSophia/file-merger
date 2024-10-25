import { CommandOptions } from "../utils/types/command-options.js";
import { confirmFileSelection } from "./confirm-file-selection.prompt.js";
import { CURR_DIR } from "../utils/constants/system-info.const.js";
import { FileExtension } from "../utils/types/file-extension.js";
import { IFileSystem } from "../core/file-system/file-system.interface.js";
import { FileSystem } from "../core/file-system/file-system.js";

import { enterFilePaths } from "./enter-file-paths.prompt.js";
import { enterOutputFileName } from "./enter-output-file-name.prompt.js";
import { selectFiles } from "./select-files.prompt.js";
import { IOptionPrompter } from "./option-prompter.interface.js";

export class OptionPrompter implements IOptionPrompter {
    constructor(private readonly fileSystem: IFileSystem) {}

    public async promptForMissingOptions(
        options: Partial<CommandOptions>,
        fileExtension: FileExtension
    ): Promise<CommandOptions> {
        const files = !options.files?.length ? await this.askForFiles(fileExtension) : options.files;
        const output = !options.output ? await this.askForOutputFileName() : options.output;

        const normalizedFiles = files.map((file) => FileSystem.normalizePath(file));
        return { files: normalizedFiles, output };
    }

    private async askForFiles(fileExtension: FileExtension): Promise<string[]> {
        const selectFromCurrentDirectory = await confirmFileSelection();

        if (selectFromCurrentDirectory) {
            const pdfFileNames = await this.fileSystem.getPdfFiles(CURR_DIR);

            if (pdfFileNames.length) {
                return selectFiles(pdfFileNames);
            }
        }

        return enterFilePaths(fileExtension);
    }

    private async askForOutputFileName(): Promise<string> {
        return enterOutputFileName();
    }
}
