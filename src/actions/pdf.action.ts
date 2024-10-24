import { PromptOptions } from "../prompts/helpers/prompt-options.js";
import { FileExtension } from "../utils/types/file-extension.js";
import { CommandOptions } from "../utils/types/command-options.js";
import { CommandAction } from "../utils/types/command-action.js";

export class PdfAction implements CommandAction {
    public constructor(private readonly promptOptions: PromptOptions) {}

    public async handle(options: CommandOptions): Promise<void> {
        const { files, output } = await this.promptOptions.handleMissingOptions(options, FileExtension.PDF);

        console.log("files", files, "outputFileName", output);
    }
}
