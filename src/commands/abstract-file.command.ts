import { Command, createCommand, InvalidArgumentError } from "commander";
import { validFilesOption } from "../utils/validators/files-option.validator.js";
import { FileExtension } from "../utils/types/file-extension.js";
import { FileCommand } from "../utils/types/file-command.js";
import { IAction } from "../actions/action.interface.js";

export abstract class AbstractFileCommand implements FileCommand {
    constructor(protected readonly action: IAction) {}

    public abstract build(): Command;

    protected create(name: string, description: string, type: FileExtension): Command {
        return createCommand(name)
            .description(description)
            .option<string[]>("-f, --files <files>", "list of comma-separated file paths to merge", (value) =>
                this.parseFilesArg(value, type)
            )
            .option<string>("-o, --output <output>", "output file name (without extension)", (value) => value.trim());
    }

    private parseFilesArg(filesSeparatedByComma: string, type: FileExtension): string[] {
        const files = filesSeparatedByComma.split(",");

        if (!validFilesOption(files, type)) {
            throw new InvalidArgumentError("Invalid file paths");
        }

        return files;
    }
}
