import { CommandOptions } from "../../utils/types/command-options.js";
import { confirmFileSelection } from "../confirm-file-selection.prompt.js";
import { FileExtension } from "../../utils/types/file-extension.js";
import { getFilesFromCurrentDirectory } from "../../utils/helpers/readers/pdf-reader.js";

import { enterFilePaths } from "../enter-file-paths.prompt.js";
import { enterOutputFileName } from "../enter-output-file-name.prompt.js";
import { selectFiles } from "../select-files.prompt.js";

export class PromptOptions {
    public async handleMissingOptions(
        options: Partial<CommandOptions>,
        fileExtension: FileExtension
    ): Promise<CommandOptions> {
        const promptOptions: CommandOptions = {
            files: !options.files?.length ? await this.askForFiles(fileExtension) : options.files,
            outputFileName: !options.outputFileName ? await this.askForOutputFileName() : options.outputFileName,
        };

        return promptOptions;
    }

    private async askForFiles(fileExtension: FileExtension): Promise<string[]> {
        const selectFromCurrentDirectory = await confirmFileSelection();

        if (selectFromCurrentDirectory) {
            const pdfFileNames = await getFilesFromCurrentDirectory(fileExtension);

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
