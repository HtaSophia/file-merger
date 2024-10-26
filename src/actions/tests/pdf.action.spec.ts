import { outro, spinner } from "@clack/prompts";
import { afterAll, afterEach, beforeEach, describe, expect, it, jest } from "@jest/globals";

import { CommandOptions } from "../../utils/types/command-options";
import { FileExtension } from "../../utils/types/file-extension";
import { IFileMerger } from "../../mergers/file-merger.interface";
import { IOptionPrompter } from "../../prompts/option-prompter.interface";
import { PdfAction } from "../pdf.action";

jest.mock("@clack/prompts", () => ({
    spinner: jest.fn().mockReturnValue({
        start: jest.fn(),
        stop: jest.fn(),
    }),
    outro: jest.fn(),
}));
jest.mock("../../prompts/option-prompter");
jest.mock("../../core/file-system/file-system");

describe("PdfAction", () => {
    const mockOptions: CommandOptions = { files: ["/path/to/file1.pdf", "/path/to/file2.pdf"], output: "output.pdf" };

    let mockOptionPrompter: jest.Mocked<IOptionPrompter>;
    let mockPdfMerger: jest.Mocked<IFileMerger>;
    let actionSpinner: ReturnType<typeof spinner>;

    beforeEach(() => {
        mockOptionPrompter = {
            promptForMissingOptions: jest.fn<() => Promise<CommandOptions>>().mockResolvedValue(mockOptions),
        };

        mockPdfMerger = {
            merge: jest.fn<() => Promise<void>>().mockResolvedValue(undefined),
        };

        actionSpinner = spinner();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    afterAll(() => {
        jest.restoreAllMocks();
    });

    it("should be defined", () => {
        expect(PdfAction).toBeDefined();
    });

    it("should be an instance of PdfAction", async () => {
        const pdfAction = new PdfAction(mockOptionPrompter, mockPdfMerger);
        expect(pdfAction).toBeDefined();
    });

    it("should handle missing options", async () => {
        const pdfAction = new PdfAction(mockOptionPrompter, mockPdfMerger);
        await pdfAction.handle(mockOptions);

        expect(mockOptionPrompter.promptForMissingOptions).toHaveBeenCalledWith(mockOptions, FileExtension.PDF);
        expect(actionSpinner.start).toHaveBeenCalledWith("merging PDF files...");
        expect(mockPdfMerger.merge).toHaveBeenCalledWith(mockOptions.files, mockOptions.output);
        expect(actionSpinner.stop).toHaveBeenCalledWith("PDF files merged successfully! 🎉");
    });

    it("should handle errors during PDF merging", async () => {
        mockPdfMerger.merge.mockRejectedValueOnce(new Error("Mock merge error"));

        const pdfAction = new PdfAction(mockOptionPrompter, mockPdfMerger);
        await pdfAction.handle({});

        expect(mockOptionPrompter.promptForMissingOptions).toHaveBeenCalledWith({}, FileExtension.PDF);
        expect(actionSpinner.start).toHaveBeenCalledWith("merging PDF files...");
        expect(mockPdfMerger.merge).toHaveBeenCalledWith(mockOptions.files, mockOptions.output);
        expect(actionSpinner.stop).toHaveBeenCalledWith("Failed to merge PDF files.");
        expect(outro).toHaveBeenCalledWith("Mock merge error. Please try again.");
    });
});
