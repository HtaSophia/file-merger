import { Command } from "commander";
import { RootCommand } from "./commands/root.command.js";

import { FileSystem } from "./core/file-system/file-system.js";
import { OptionPrompter } from "./prompts/option-prompter.js";
import { CommandFactory } from "./commands/command-factory.js";

function main() {
    const program = new RootCommand("file-merger");

    const fileSystem = new FileSystem();
    const promptOptions = new OptionPrompter(fileSystem);
    const commandFactory = new CommandFactory(fileSystem, promptOptions);

    program.addCommand(commandFactory.createPdfCommand());
    program.parseAsync(process.argv);
}

main();
