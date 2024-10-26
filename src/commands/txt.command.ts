import { Command } from "commander";
import { FileExtension } from "../utils/types/file-extension.js";
import { AbstractFileCommand } from "./abstract-file.command.js";

export class TxtCommand extends AbstractFileCommand {
    public build(): Command {
        return this.create("txt", "merges TXT files", FileExtension.TXT).action(async ({ files, output }) => {
            await this.action.handle({ files, output });
        });
    }
}
