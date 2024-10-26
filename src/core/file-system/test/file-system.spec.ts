import { FILE_SYSTEM_MOCKS } from "./file-system-mocks";

import { afterEach, describe, expect, it, jest } from "@jest/globals";
import { accessSync, existsSync } from "node:fs";
import { readdir, readFile, writeFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";

import { FileExtension } from "../../../utils/types/file-extension";
import { FileSystem } from "../file-system";

jest.mock("node:fs");
jest.mock("node:fs/promises", () => ({
    readdir: jest.fn<() => Promise<string[]>>().mockResolvedValue(FILE_SYSTEM_MOCKS.differentFiles),
    readFile: jest.fn<() => Promise<Buffer>>().mockResolvedValue(FILE_SYSTEM_MOCKS.bufferFile),
    writeFile: jest.fn<() => Promise<void>>().mockResolvedValue(),
}));
jest.mock("node:path");

describe("FileSystem", () => {
    const mockedInfo = FILE_SYSTEM_MOCKS;

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should be defined", () => {
        expect(FileSystem).toBeDefined();
    });

    it("should be an instance of FileSystem", () => {
        const fileSystem = new FileSystem();
        expect(fileSystem).toBeInstanceOf(FileSystem);
    });

    describe("hasFileExtension method", () => {
        it("should return true for a matching file extension", () => {
            jest.mocked(extname).mockReturnValue(".pdf");
            expect(FileSystem.hasFileExtension(mockedInfo.pdfFile, FileExtension.PDF)).toBe(true);
        });

        it("should return false for a non-matching file extension", () => {
            jest.mocked(extname).mockReturnValue(".txt");
            expect(FileSystem.hasFileExtension(mockedInfo.txtFile, FileExtension.PDF)).toBe(false);
        });
    });

    describe("isValidFileName method", () => {
        it("should be valid for a valid file name", () => {
            const result = FileSystem.isValidFileName(mockedInfo.fileName);
            expect(result).toEqual({ valid: true });
        });

        it("should be invalid if file name contains forbidden characters", () => {
            const result = FileSystem.isValidFileName(mockedInfo.forbiddenCharPath);
            expect(result.valid).toBe(false);
            expect(result.reason).toContain("forbidden characters");
        });

        it("should be invalid if file name is too long", () => {
            const result = FileSystem.isValidFileName(mockedInfo.longFilePath);
            expect(result.valid).toBe(false);
            expect(result.reason).toContain("too long");
        });
    });

    describe("isValidPath method", () => {
        it("should return true if path exists and is accessible", () => {
            jest.mocked(accessSync).mockImplementation(() => true);
            expect(FileSystem.isValidPath(mockedInfo.complexPath)).toBe(true);
        });

        it("should return false if path does not exist or is inaccessible", () => {
            jest.mocked(accessSync).mockImplementation(() => {
                throw new Error("Path not accessible");
            });
            expect(FileSystem.isValidPath(mockedInfo.invalidPath)).toBe(false);
        });
    });

    describe("isValidPathAndFileExtension method", () => {
        it("should return true if path is valid and has the correct extension", () => {
            jest.mocked(accessSync).mockImplementation(() => true);
            jest.mocked(extname).mockReturnValue(".pdf");
            expect(FileSystem.isValidPathAndFileExtension(mockedInfo.pdfFile, FileExtension.PDF)).toBe(true);
        });

        it("should return false if path is invalid or does not have the correct extension", () => {
            jest.mocked(accessSync).mockImplementation(() => {
                throw new Error();
            });
            jest.mocked(extname).mockReturnValue(".pdf");
            expect(FileSystem.isValidPathAndFileExtension(mockedInfo.txtFile, FileExtension.PDF)).toBe(false);
        });
    });

    describe("normalizePath method", () => {
        it("should normalize the given path", () => {
            jest.mocked(normalize).mockReturnValue(mockedInfo.path);
            expect(FileSystem.normalizePath(mockedInfo.notNormalizedPath)).toBe(mockedInfo.path);
        });
    });

    describe("getFiles method", () => {
        it("should return list of files if directory exists", async () => {
            jest.mocked(existsSync).mockReturnValue(true);

            const fileSystem = new FileSystem();
            const files = await fileSystem.getFiles(mockedInfo.path);
            expect(files).toEqual(mockedInfo.differentFiles);
        });

        it("should throw an error if directory does not exist", async () => {
            jest.mocked(existsSync).mockReturnValue(false);

            const fileSystem = new FileSystem();
            try {
                await fileSystem.getFiles(mockedInfo.invalidPath);
            } catch (error) {
                expect(error).toEqual(new Error(`Directory path ${mockedInfo.invalidPath} does not exist`));
            }
        });
    });

    describe("getPdfFiles method", () => {
        it("should return only PDF files", async () => {
            jest.mocked(existsSync).mockReturnValue(true);
            jest.mocked(extname)
                .mockImplementationOnce(() => ".pdf")
                .mockImplementationOnce(() => ".txt")
                .mockImplementationOnce(() => ".pdf");

            const pdfFiles = await new FileSystem().getPdfFiles(mockedInfo.path);

            expect(existsSync).toHaveBeenCalledWith(mockedInfo.path);
            expect(readdir).toHaveBeenCalledWith(mockedInfo.path);
            expect(pdfFiles).toEqual(mockedInfo.pdfFiles);
        });
    });

    describe("readFile method", () => {
        it("should return file content if path exists", async () => {
            jest.mocked(existsSync).mockReturnValue(true);
            const result = await new FileSystem().readFile(mockedInfo.pathWithExtension);

            expect(existsSync).toHaveBeenCalledWith(mockedInfo.pathWithExtension);
            expect(readFile).toHaveBeenCalledWith(mockedInfo.pathWithExtension);
            expect(result).toBe(mockedInfo.bufferFile);
        });

        it("should throw an error if file path does not exist", async () => {
            jest.mocked(existsSync).mockReturnValue(false);
            try {
                await new FileSystem().readFile(mockedInfo.invalidPathWithExtension);
            } catch (error) {
                expect(error).toEqual(new Error(`Path ${mockedInfo.invalidPathWithExtension} does not exist`));
            }
        });
    });

    describe("writeFile method", () => {
        it("should write file content to the specified path", async () => {
            await new FileSystem().writeFile(mockedInfo.pathWithExtension, mockedInfo.bufferFile);
            expect(writeFile).toHaveBeenCalledWith(mockedInfo.pathWithExtension, mockedInfo.bufferFile);
        });
    });

    describe("joinPaths method", () => {
        it("should join paths correctly", () => {
            jest.mocked(join).mockReturnValue("/joined/path");
            const result = new FileSystem().joinPaths("/some", "path");

            expect(join).toHaveBeenCalledWith("/some", "path");
            expect(result).toBe("/joined/path");
        });
    });
});
