import { Command, createCommand } from "commander";
import { validateFiles } from "../utils/validators/options.validator.js";
import { FileExtension } from "../utils/types/file-extension.js";
import { FileCommand } from "../utils/types/file-command.js";
import { CommandAction } from "../utils/types/command-action.js";

export abstract class AbstractFileCommand implements FileCommand {
    constructor(protected readonly action: CommandAction) {}

    public abstract build(): Command;

    protected create(name: string, description: string, type: FileExtension): Command {
        return createCommand(name)
            .description(description)
            .option<string[]>("-f, --files <files>", "List of comma-separated file paths to merge", (value) =>
                validateFiles(value, type)
            )
            .option<string>("-o, --output <output>", "Output file name", (value) => value.trim(), "mergedFile");
    }
}
