import { CommandOptions } from "../utils/types/command-options.js";

export interface IAction {
    handle(options: Partial<CommandOptions>): Promise<void>;
}
