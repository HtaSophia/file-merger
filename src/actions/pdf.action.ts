import { outro, spinner } from "@clack/prompts";
import { CommandOptions } from "../utils/types/command-options.js";
import { FileExtension } from "../utils/types/file-extension.js";
import { IFileMerger } from "../mergers/file-merger.interface.js";
import { IOptionPrompter } from "../prompts/option-prompter.interface.js";

import { IAction } from "./action.interface.js";

export class PdfAction implements IAction {
    public constructor(private readonly optionPrompter: IOptionPrompter, private readonly pdfMerger: IFileMerger) {}

    public async handle(options: Partial<CommandOptions>): Promise<void> {
        const { files, output } = await this.optionPrompter.promptForMissingOptions(options, FileExtension.PDF);

        const actionSpinner = spinner();
        actionSpinner.start("merging PDF files...");

        try {
            await this.pdfMerger.merge(files, output);
            actionSpinner.stop("PDF files merged successfully! 🎉");
        } catch (error: Error | any) {
            actionSpinner.stop("Failed to merge PDF files.");
            outro(`${error.message}. Please try again.`);
        }
    }
}
