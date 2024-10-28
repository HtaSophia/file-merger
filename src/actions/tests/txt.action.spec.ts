import { outro, spinner } from "@clack/prompts";
import { afterAll, afterEach, beforeEach, describe, expect, it, jest } from "@jest/globals";

import { CommandOptions } from "../../utils/types/command-options";
import { FileExtension } from "../../utils/types/file-extension";
import { IFileMerger } from "../../mergers/file-merger.interface";
import { IOptionPrompter } from "../../prompts/option-prompter.interface";
import { TxtAction } from "../txt.action";

jest.mock("@clack/prompts", () => ({
    spinner: jest.fn().mockReturnValue({
        start: jest.fn(),
        stop: jest.fn(),
    }),
    outro: jest.fn(),
}));
jest.mock("../../prompts/option-prompter");
jest.mock("../../core/file-system/file-system");

const mockOptions: CommandOptions = { files: ["/path/to/file1.txt", "/path/to/file2.txt"], output: "output.txt" };

describe("TxtAction", () => {
    let mockOptionPrompter: jest.Mocked<IOptionPrompter>;
    let mockTxtMerger: jest.Mocked<IFileMerger>;
    let actionSpinner: ReturnType<typeof spinner>;

    beforeEach(() => {
        mockOptionPrompter = {
            promptForMissingOptions: jest.fn<() => Promise<CommandOptions>>().mockResolvedValue(mockOptions),
        };

        mockTxtMerger = {
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
        expect(TxtAction).toBeDefined();
    });

    it("should be an instance of TxtAction", async () => {
        const txtAction = new TxtAction(mockOptionPrompter, mockTxtMerger);
        expect(txtAction).toBeDefined();
    });

    it("should handle missing options", async () => {
        const txtAction = new TxtAction(mockOptionPrompter, mockTxtMerger);
        await txtAction.handle(mockOptions);

        expect(mockOptionPrompter.promptForMissingOptions).toHaveBeenCalledWith(mockOptions, FileExtension.TXT);
        expect(actionSpinner.start).toHaveBeenCalledWith("merging TXT files...");
        expect(mockTxtMerger.merge).toHaveBeenCalledWith(mockOptions.files, mockOptions.output);
        expect(actionSpinner.stop).toHaveBeenCalledWith("TXT files merged successfully! 🎉");
    });

    it("should handle errors during TXT merging", async () => {
        mockTxtMerger.merge.mockRejectedValueOnce(new Error("Mock merge error"));

        const txtAction = new TxtAction(mockOptionPrompter, mockTxtMerger);
        await txtAction.handle({});

        expect(mockOptionPrompter.promptForMissingOptions).toHaveBeenCalledWith({}, FileExtension.TXT);
        expect(actionSpinner.start).toHaveBeenCalledWith("merging TXT files...");
        expect(mockTxtMerger.merge).toHaveBeenCalledWith(mockOptions.files, mockOptions.output);
        expect(actionSpinner.stop).toHaveBeenCalledWith("Failed to merge TXT files.");
        expect(outro).toHaveBeenCalledWith("Mock merge error. Please try again.");
    });
});
