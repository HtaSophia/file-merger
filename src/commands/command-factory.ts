import { Command } from "commander";
import { IFileSystem } from "../core/file-system/file-system.interface.js";
import { IOptionPrompter } from "../prompts/option-prompter.interface.js";

import { PdfAction } from "../actions/pdf.action.js";
import { PdfCommand } from "./pdf.command.js";
import { PdfMerger } from "../mergers/pdf-merger.js";

export class CommandFactory {
    constructor(private readonly fileSystem: IFileSystem, private readonly promptOptions: IOptionPrompter) {}

    public createPdfCommand(): Command {
        const pdfMerger = new PdfMerger(this.fileSystem);
        const pdfAction = new PdfAction(this.promptOptions, pdfMerger);
        const pdfCommand = new PdfCommand(pdfAction);
        return pdfCommand.build();
    }
}
