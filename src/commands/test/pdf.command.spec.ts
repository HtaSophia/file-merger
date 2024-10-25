import { Command } from "commander";
import { describe, expect, it, jest } from "@jest/globals";
import { CommandAction } from "../../utils/types/command-action.js";
import { PdfCommand } from "../pdf.command";

describe("PdfCommand", () => {
    const pdfActionMock: jest.Mocked<CommandAction> = {
        handle: jest.fn(),
    };

    it("should be defined", () => {
        expect(PdfCommand).toBeDefined();
    });

    it("should be an instance of PdfCommand", () => {
        const pdfCommand = new PdfCommand(pdfActionMock);
        expect(pdfCommand).toBeDefined();
    });

    it("should create the PDF command", async () => {
        const pdfCommand = new PdfCommand(pdfActionMock);
        const command = pdfCommand.build();

        expect(command).toBeInstanceOf(Command);
        expect(command.name()).toBe("pdf");
    });

    it("should handle the PDF command", async () => {
        const pdfCommand = new PdfCommand(pdfActionMock);
        const options = { filesString: "/file1.pdf", files: ["/file1.pdf"], output: "outputFile" };

        const command = pdfCommand.build();
        await command.parseAsync(["-f", options.filesString, "-o", options.output], { from: "user" });

        expect(pdfActionMock.handle).toBeCalledWith({ files: options.files, output: options.output });
    });
});
