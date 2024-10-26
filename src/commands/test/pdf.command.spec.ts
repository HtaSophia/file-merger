import { afterAll, afterEach, beforeEach, describe, expect, it, jest } from "@jest/globals";
import { IAction } from "../../actions/action.interface";
import { PdfCommandMock } from "./pdf.command.mock";
import { FileExtension } from "../../utils/types/file-extension";
import { FileSystem } from "../../core/file-system/file-system";

jest.mock("../../core/file-system/file-system");

describe("PdfCommand", () => {
    let pdfActionMock: jest.Mocked<IAction>;

    beforeEach(() => {
        pdfActionMock = {
            handle: jest.fn(),
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    afterAll(() => {
        jest.restoreAllMocks();
    });

    it("should be defined", () => {
        expect(PdfCommandMock).toBeDefined();
    });

    it("should be an instance of PdfCommandMock", () => {
        const pdfCommand = new PdfCommandMock(pdfActionMock);
        expect(pdfCommand).toBeDefined();
    });

    it("should create a command with the correct name, description and options", () => {
        const pdfCommand = new PdfCommandMock(pdfActionMock);
        const command = pdfCommand.create(PdfCommandMock.NAME, PdfCommandMock.DESCRIPTION, FileExtension.PDF);

        expect(command.name()).toBe(PdfCommandMock.NAME);
        expect(command.description()).toBe(PdfCommandMock.DESCRIPTION);
        expect(command.options).toHaveLength(2);
        expect(command.options[0].flags).toBe("-f, --files [files...]");
        expect(command.options[1].flags).toBe("-o, --output [output]");
    });

    describe("parseFiles and parseOutput methods", () => {
        const validFile = "validFile.pdf";
        const invalidFile = "invalidFile.txt";

        afterEach(() => {
            jest.clearAllMocks();
        });

        it("should call isValidPathAndFileExtension with correct arguments for files", async () => {
            (FileSystem.isValidPathAndFileExtension as jest.Mock).mockReturnValueOnce(true);

            const pdfCommand = new PdfCommandMock(pdfActionMock);
            const command = pdfCommand.build();
            await command.parseAsync(["-f", validFile], { from: "user" });

            expect(FileSystem.isValidPathAndFileExtension).toHaveBeenCalledWith(validFile, FileExtension.PDF);
        });

        it("should throw an error when an invalid file is provided", async () => {
            (FileSystem.isValidPathAndFileExtension as jest.Mock).mockReturnValueOnce(false);
            const processSpy = jest.spyOn(process, "exit").mockImplementation((code) => {
                throw new Error(`process.exit: ${code}`);
            });

            const pdfCommand = new PdfCommandMock(pdfActionMock);
            const command = pdfCommand.build();

            try {
                await command.parseAsync(["-f", invalidFile], { from: "user" });
            } catch (error: any) {
                expect(error).toBeInstanceOf(Error);
                expect(error?.message).toContain("process.exit: 1");
            } finally {
                processSpy.mockRestore();
            }
        });

        it("should call isValidFileName and append .pdf for output", async () => {
            (FileSystem.isValidFileName as jest.Mock).mockReturnValueOnce({ valid: true });

            const pdfCommand = new PdfCommandMock(pdfActionMock);
            const command = pdfCommand.build();

            const outputFileName = "mergedOutput";
            const resultCommand = await command.parseAsync(["-o", outputFileName], { from: "user" });

            expect(FileSystem.isValidFileName).toHaveBeenCalledWith(outputFileName);
            expect(resultCommand.opts().output).toBe(`${outputFileName}.pdf`);
        });

        it("should throw an error if an invalid output name is provided", async () => {
            (FileSystem.isValidFileName as jest.Mock).mockReturnValueOnce({ valid: false, reason: "Invalid name." });
            const processSpy = jest.spyOn(process, "exit").mockImplementation((code) => {
                throw new Error(`process.exit: ${code}`);
            });

            const pdfCommand = new PdfCommandMock(pdfActionMock);
            const command = pdfCommand.build();

            try {
                await command.parseAsync(["-o", "invalid-name"], { from: "user" });
            } catch (error: any) {
                expect(error).toBeInstanceOf(Error);
                expect(error?.message).toContain("process.exit: 1");
            } finally {
                processSpy.mockRestore();
            }
        });
    });

    it("should call the action handler with provided options when action is executed", async () => {
        const mockOptions = {
            files: ["file1.pdf", "file2.pdf"],
            output: "mergedPdf",
        };

        jest.mocked(FileSystem.isValidPathAndFileExtension).mockReturnValue(true);
        jest.mocked(FileSystem.isValidFileName).mockReturnValueOnce({ valid: true });

        const pdfCommand = new PdfCommandMock(pdfActionMock);
        const command = pdfCommand.build();
        await command.parseAsync(["-f", mockOptions.files[0], "-f", mockOptions.files[1], "-o", mockOptions.output], {
            from: "user",
        });

        expect(pdfActionMock.handle).toHaveBeenCalledWith({
            files: mockOptions.files,
            output: `${mockOptions.output}.pdf`,
        });
    });
});
