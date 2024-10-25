import { CommandOptions } from "../utils/types/command-options.js";
import { FileExtension } from "../utils/types/file-extension.js";

export interface IOptionPrompter {
    promptForMissingOptions(options: Partial<CommandOptions>, fileExtension: FileExtension): Promise<CommandOptions>;
}
