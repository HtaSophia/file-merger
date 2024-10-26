import { Command, createCommand, InvalidOptionArgumentError } from "commander";
import { FileCommand } from "../utils/types/file-command.js";
import { FileExtension } from "../utils/types/file-extension.js";
import { FileSystem } from "../core/file-system/file-system.js";
import { IAction } from "../actions/action.interface.js";

export abstract class AbstractFileCommand implements FileCommand {
    constructor(protected readonly action: IAction) {}

    public abstract build(): Command;

    protected create(name: string, description: string, fileExtension: FileExtension): Command {
        return createCommand(name)
            .description(description)
            .option("-f, --files [files...]", "list of file paths to merge", (value, previous: string[]) =>
                this.parseFiles(value, fileExtension, previous)
            )
            .option<string>("-o, --output [output]", "output file name", (value) => this.parseOutput(value));
    }

    private parseOutput(output: string): string {
        const fileName = output.trim().split(".")[0];
        const { valid, reason } = FileSystem.isValidFileName(fileName);

        if (!valid) {
            throw new InvalidOptionArgumentError(reason ?? "Invalid output file name.");
        }

        return `${fileName}.pdf`;
    }

    private parseFiles(file: string, extension: FileExtension, previousFiles: string[] = []): string[] {
        if (!FileSystem.isValidPathAndFileExtension(file, extension)) {
            throw new InvalidOptionArgumentError("The file path or extension is invalid.");
        }

        return [...previousFiles, file];
    }
}
