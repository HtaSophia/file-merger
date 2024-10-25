import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { CommandOptions } from "../../utils/types/command-options";
import { FileExtension } from "../../utils/types/file-extension";
import { PromptOptions } from "../../prompts/helpers/prompt-options";
import { PdfAction } from "../pdf.action";

jest.mock<PromptOptions>("../../prompts/helpers/prompt-options");

describe("PdfAction", () => {
    let promptOptions: jest.Mocked<PromptOptions>;

    beforeEach(() => {
        promptOptions = new PromptOptions() as jest.Mocked<PromptOptions>;
    });

    it("should be defined", () => {
        expect(PdfAction).toBeDefined();
    });

    it("should be an instance of PdfAction", async () => {
        const pdfAction = new PdfAction(promptOptions);
        expect(pdfAction).toBeDefined();
    });

    it("should handle missing options", async () => {
        const pdfAction = new PdfAction(promptOptions);
        const options: CommandOptions = { files: [], output: "" };

        promptOptions.handleMissingOptions.mockResolvedValue(options);
        await pdfAction.handle(options);

        expect(promptOptions.handleMissingOptions).toHaveBeenCalledWith(options, FileExtension.PDF);
    });
});
