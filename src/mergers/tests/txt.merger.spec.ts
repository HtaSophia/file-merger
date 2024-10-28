import { afterAll, afterEach, beforeEach, describe, expect, it, jest } from "@jest/globals";
import { IFileSystem } from "../../core/file-system/file-system.interface";
import { TxtMerger } from "../txt.merger";

describe("TxtMerger", () => {
    let mockFileSystem: jest.Mocked<IFileSystem>;

    beforeEach(() => {
        mockFileSystem = {
            readFile: jest.fn(),
            readFileContent: jest.fn(),
            writeFile: jest.fn(),
            getFiles: jest.fn(),
            getFilesWithExtension: jest.fn(),
            joinPaths: jest.fn(),
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    afterAll(() => {
        jest.restoreAllMocks();
    });

    it("should be defined", () => {
        expect(TxtMerger).toBeDefined();
    });

    it("should be an instance of TxtMerger", () => {
        const txtMerger = new TxtMerger(mockFileSystem);
        expect(txtMerger).toBeDefined();
    });

    it("should merge multiple files and write combined content to output file", async () => {
        const files = ["file1.txt", "file2.txt"];
        const output = "mergedTxt";

        mockFileSystem.readFileContent
            .mockResolvedValueOnce("Content of file1")
            .mockResolvedValueOnce("Content of file2");

        const txtMerger = new TxtMerger(mockFileSystem);
        await txtMerger.merge(files, output);

        expect(mockFileSystem.readFileContent).toHaveBeenCalledTimes(files.length);
        expect(mockFileSystem.readFileContent).toHaveBeenCalledWith("file1.txt");
        expect(mockFileSystem.readFileContent).toHaveBeenCalledWith("file2.txt");
        expect(mockFileSystem.writeFile).toHaveBeenCalledWith(output, "Content of file1\n\nContent of file2");
    });
});
