import { Command } from "commander";
import { IFileSystem } from "../core/file-system/file-system.interface.js";
import { IOptionPrompter } from "../prompts/option-prompter.interface.js";

import { PdfAction } from "../actions/pdf.action.js";
import { PdfCommand } from "./pdf.command.js";
import { PdfMerger } from "../mergers/pdf.merger.js";
import { TxtMerger } from "../mergers/txt.merger.js";
import { TxtAction } from "../actions/txt.action.js";
import { TxtCommand } from "./txt.command.js";

export class CommandFactory {
    constructor(private readonly fileSystem: IFileSystem, private readonly promptOptions: IOptionPrompter) {}

    public createPdfCommand(): Command {
        const pdfMerger = new PdfMerger(this.fileSystem);
        const pdfAction = new PdfAction(this.promptOptions, pdfMerger);
        const pdfCommand = new PdfCommand(pdfAction);
        return pdfCommand.build();
    }

    public createTxtCommand(): Command {
        const txtMerger = new TxtMerger(this.fileSystem);
        const txtAction = new TxtAction(this.promptOptions, txtMerger);
        const txtCommand = new TxtCommand(txtAction);
        return txtCommand.build();
    }
}
