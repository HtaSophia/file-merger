import { Command } from "commander";

export class RootCommand extends Command {
    public override createCommand(name: string): Command {
        const command = new Command(name);

        command
            .version("1.0.0")
            .description("A CLI tool to merge files")
            .option("-h, --help", "Display help for command");

        command.showSuggestionAfterError();
        command.helpCommand(true);

        return command;
    }
}
