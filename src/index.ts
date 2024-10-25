import { Command } from "commander";
import { RootCommand } from "./commands/root.command.js";

import { FileSystem } from "./core/file-system/file-system.js";
import { OptionPrompter } from "./prompts/option-prompter.js";
import { IOptionPrompter } from "./prompts/option-prompter.interface.js";

import { PdfCommand } from "./commands/pdf.command.js";
import { PdfAction } from "./actions/pdf.action.js";

function main() {
    const program = new RootCommand("file-merger");

    const fileSystem = new FileSystem();
    const promptOptions = new OptionPrompter(fileSystem);

    program.addCommand(buildPdfCommand(promptOptions));
    program.parseAsync(process.argv);
}

const buildPdfCommand = (promptOptions: IOptionPrompter): Command => {
    const pdfAction = new PdfAction(promptOptions);
    const pdfCommand = new PdfCommand(pdfAction);
    return pdfCommand.build();
};

main();
