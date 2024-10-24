import { Command } from "commander";

export class RootCommand extends Command {
    public override createCommand(name: string): Command {
        const command = new Command(name);

        command.version("1.0.0").description("CLI tool to merge files");
        command.showSuggestionAfterError();
        command.helpCommand(true);

        return command;
    }
}
