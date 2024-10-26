import { afterAll, afterEach, beforeEach, describe, expect, it, jest } from "@jest/globals";

import { CommandOptions } from "../../utils/types/command-options";
import { confirmFileSelection } from "../confirm-file-selection.prompt";
import { CURR_DIR } from "../../utils/constants/system-info.const";
import { enterFilePaths } from "../enter-file-paths.prompt";
import { enterOutputFileName } from "../enter-output-file-name.prompt";
import { FileExtension } from "../../utils/types/file-extension";
import { FileSystem } from "../../core/file-system/file-system";
import { IFileSystem } from "../../core/file-system/file-system.interface";
import { OptionPrompter } from "../option-prompter";
import { selectFiles } from "../select-files.prompt";

jest.mock("../../core/file-system/file-system");
jest.mock("../confirm-file-selection.prompt");
jest.mock("../enter-file-paths.prompt");
jest.mock("../enter-output-file-name.prompt");
jest.mock("../select-files.prompt");

describe("OptionPrompter", () => {
    let mockFileSystem: jest.Mocked<IFileSystem>;

    beforeEach(() => {
        mockFileSystem = {
            getFiles: jest.fn(),
            getPdfFiles: jest.fn(),
            readFile: jest.fn(),
            writeFile: jest.fn(),
            joinPaths: jest.fn(),
        };

        jest.mocked(FileSystem.normalizePath).mockImplementation((path) => `/normalized/${path}`);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    afterAll(() => {
        jest.restoreAllMocks();
    });

    it("should be defined", () => {
        expect(OptionPrompter).toBeDefined();
    });

    it("should be an instance of OptionPrompter", () => {
        const optionPrompter = new OptionPrompter(mockFileSystem);
        expect(optionPrompter).toBeInstanceOf(OptionPrompter);
    });

    describe("promptForMissingOptions method", () => {
        it("should not prompt any options if both files and output are given", async () => {
            const options: Partial<CommandOptions> = {
                files: ["file1.pdf", "file2.pdf"],
                output: "output.pdf",
            };
            const optionPrompter = new OptionPrompter(mockFileSystem);
            const result = await optionPrompter.promptForMissingOptions(options, FileExtension.PDF);

            expect(result).toEqual({
                files: options.files?.map((file) => `/normalized/${file}`),
                output: options.output,
            });
            expect(confirmFileSelection).not.toHaveBeenCalled();
            expect(enterOutputFileName).not.toHaveBeenCalled();
        });

        it("should ask to enter the output file name if output option is missing", async () => {
            const options: Partial<CommandOptions> = { files: ["file1.pdf"] };
            jest.mocked(enterOutputFileName).mockResolvedValue("output.pdf");

            const optionPrompter = new OptionPrompter(mockFileSystem);
            const result = await optionPrompter.promptForMissingOptions(options, FileExtension.PDF);

            expect(enterOutputFileName).toHaveBeenCalled();
            expect(result.files).toEqual(["/normalized/file1.pdf"]);
            expect(result.output).toEqual("output.pdf");
        });

        describe("files option is missing", () => {
            it("should ask to select files if confirmFileSelection returns true", async () => {
                const options: Partial<CommandOptions> = { output: "output.pdf" };
                const files = ["file1.pdf", "file2.pdf"];
                const selectedFile = "file1.pdf";

                jest.mocked(confirmFileSelection).mockResolvedValue(true);
                mockFileSystem.getPdfFiles.mockResolvedValue(files);
                jest.mocked(selectFiles).mockResolvedValue([selectedFile]);

                const optionPrompter = new OptionPrompter(mockFileSystem);
                const result = await optionPrompter.promptForMissingOptions(options, FileExtension.PDF);

                expect(confirmFileSelection).toHaveBeenCalled();
                expect(selectFiles).toHaveBeenCalledWith(files);
                expect(mockFileSystem.getPdfFiles).toHaveBeenCalledWith(CURR_DIR);
                expect(result.files).toEqual([`/normalized/${selectedFile}`]);
                expect(result.output).toEqual(options.output);
            });

            it("should ask to enter file paths if confirmFileSelection returns false", async () => {
                const options: Partial<CommandOptions> = { output: "output.pdf" };

                jest.mocked(confirmFileSelection).mockResolvedValue(false);
                jest.mocked(enterFilePaths).mockResolvedValue(["manualFile1.pdf", "manualFile2.pdf"]);

                const optionPrompter = new OptionPrompter(mockFileSystem);
                const result = await optionPrompter.promptForMissingOptions(options, FileExtension.PDF);

                expect(confirmFileSelection).toHaveBeenCalled();
                expect(enterFilePaths).toHaveBeenCalledWith(FileExtension.PDF);
                expect(result.files).toEqual(["/normalized/manualFile1.pdf", "/normalized/manualFile2.pdf"]);
                expect(result.output).toEqual("output.pdf");
            });
        });
    });
});
