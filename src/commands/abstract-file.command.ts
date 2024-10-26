import { Command, createCommand, InvalidArgumentError } from "commander";
import { FileCommand } from "../utils/types/file-command.js";
import { FileExtension } from "../utils/types/file-extension.js";
import { FileSystem } from "../core/file-system/file-system.js";
import { IAction } from "../actions/action.interface.js";

export abstract class AbstractFileCommand implements FileCommand {
    constructor(protected readonly action: IAction) {}

    public abstract build(): Command;

    protected create(name: string, description: string, fileExtension: FileExtension): Command {
        return createCommand(name)
            .hook("preAction", (_thisCommand, actionCommand) => {
                this.validateFiles(actionCommand.args, fileExtension);
            })
            .description(description)
            .argument("[files...]", "list of file paths to merge ")
            .option<string>("-o, --output <output>", "output file name", (value) => this.parseOutput(value));
    }

    private parseOutput(output: string): string {
        const fileName = output.trim().split(".")[0];
        const { valid, reason } = FileSystem.isValidFileName(fileName);

        if (!valid) {
            throw new InvalidArgumentError(reason ?? "Invalid output file name");
        }

        return `${fileName}.pdf`;
    }

    private validateFiles(files: string[], extension: FileExtension): void {
        if (files && !files.every((file) => FileSystem.isValidPathAndFileExtension(file, extension))) {
            throw new InvalidArgumentError("Invalid file paths");
        }
    }
}
