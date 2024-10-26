import { Command } from "commander";
import { FileExtension } from "../utils/types/file-extension.js";
import { AbstractFileCommand } from "./abstract-file.command.js";

export class PdfCommand extends AbstractFileCommand {
    public build(): Command {
        return this.create("pdf", "merges PDF files", FileExtension.PDF).action(async ({ files, output }) => {
            await this.action.handle({ files, output });
        });
    }
}
