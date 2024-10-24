import { CommandOptions } from "./command-options.js";

export interface CommandAction {
    handle(options: CommandOptions): Promise<void>;
}
