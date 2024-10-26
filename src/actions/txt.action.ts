import { outro, spinner } from "@clack/prompts";
import { CommandOptions } from "../utils/types/command-options.js";
import { FileExtension } from "../utils/types/file-extension.js";
import { IFileMerger } from "../mergers/file-merger.interface.js";
import { IOptionPrompter } from "../prompts/option-prompter.interface.js";

import { IAction } from "./action.interface.js";

export class TxtAction implements IAction {
    public constructor(private readonly optionPrompter: IOptionPrompter, private readonly txtMerger: IFileMerger) {}

    public async handle(options: Partial<CommandOptions>): Promise<void> {
        const { files, output } = await this.optionPrompter.promptForMissingOptions(options, FileExtension.TXT);

        const actionSpinner = spinner();
        actionSpinner.start("merging TXT files...");

        try {
            await this.txtMerger.merge(files, output);
            actionSpinner.stop("TXT files merged successfully! 🎉");
        } catch (error: Error | any) {
            actionSpinner.stop("Failed to merge TXT files.");
            outro(`${error.message}. Please try again.`);
        }
    }
}
