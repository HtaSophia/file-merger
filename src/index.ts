import { RootCommand } from "./commands/root.command.js";
import { PdfCommand } from "./commands/pdf.command.js";
import { PdfAction } from "./actions/pdf.action.js";
import { PromptOptions } from "./prompts/helpers/prompt-options.js";

function main() {
    const program = new RootCommand("file-merger");
    const promptOptions = new PromptOptions();
    program.addCommand(new PdfCommand(new PdfAction(promptOptions)).build());
    program.parse(process.argv);
}

main();
