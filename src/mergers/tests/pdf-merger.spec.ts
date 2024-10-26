import { PDFDocument, PDFPage } from "pdf-lib";
import { afterAll, afterEach, beforeEach, describe, expect, it, jest } from "@jest/globals";

import { CURR_DIR } from "../../utils/constants/system-info.const";
import { IFileSystem } from "../../core/file-system/file-system.interface";
import { PdfMerger } from "../pdf.merger";

jest.mock("pdf-lib");

const mockOptions = {
    files: ["file1.pdf", "file2.pdf"],
    output: "merged.pdf",
    outputPath: `${CURR_DIR}/merged.pdf`,
    pdfBytes: new Uint8Array([1, 2, 3]),
    pdfBuffer: Buffer.from("pdf buffer data"),
};

describe("PdfMerger", () => {
    let mockFileSystem: jest.Mocked<IFileSystem>;

    beforeEach(() => {
        mockFileSystem = {
            readFile: jest.fn(),
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

    describe("merge", () => {
        it("should be defined", () => {
            expect(PdfMerger).toBeDefined();
        });

        it("should be an instance of PdfMerger", () => {
            const pdfMerger = new PdfMerger(mockFileSystem);
            expect(pdfMerger).toBeDefined();
        });

        it("should merge PDF files and write to the output file", async () => {
            mockFileSystem.joinPaths.mockReturnValue(mockOptions.outputPath);
            mockFileSystem.readFile.mockResolvedValue(mockOptions.pdfBuffer);

            const mockPdfDocument = {
                addPage: jest.fn(),
                save: jest.fn<() => Promise<Uint8Array>>().mockResolvedValue(mockOptions.pdfBytes),
                copyPages: jest.fn<() => Promise<PDFPage[]>>().mockResolvedValue([{} as PDFPage]),
            } as unknown as PDFDocument;

            const mockLoadedDoc = {
                getPageIndices: jest.fn().mockReturnValue([0, 1]),
            } as unknown as PDFDocument;

            jest.mocked(PDFDocument.create).mockResolvedValue(mockPdfDocument);
            jest.mocked(PDFDocument.load).mockResolvedValue(mockLoadedDoc);

            const pdfMerger = new PdfMerger(mockFileSystem);
            await pdfMerger.merge(mockOptions.files, mockOptions.output);

            expect(PDFDocument.create).toHaveBeenCalled();
            expect(mockPdfDocument.save).toHaveBeenCalled();
            expect(mockFileSystem.readFile).toHaveBeenCalledTimes(mockOptions.files.length);
            expect(mockFileSystem.joinPaths).toHaveBeenCalledWith(CURR_DIR, mockOptions.output);
            expect(mockFileSystem.writeFile).toHaveBeenCalledWith(mockOptions.outputPath, mockOptions.pdfBytes);
        });

        it("should load PDFs from file paths", async () => {
            mockFileSystem.readFile.mockResolvedValue(mockOptions.pdfBuffer);

            const mockLoadedPdf = { getPageIndices: jest.fn().mockReturnValue([0]) } as unknown as PDFDocument;
            jest.mocked(PDFDocument.load).mockResolvedValue(mockLoadedPdf);

            const pdfMerger = new PdfMerger(mockFileSystem);
            const loadedPdfs = await pdfMerger["loadPdfs"](mockOptions.files);

            expect(PDFDocument.load).toHaveBeenCalledWith(mockOptions.pdfBuffer);
            expect(loadedPdfs).toHaveLength(mockOptions.files.length);
            expect(mockFileSystem.readFile).toHaveBeenCalledTimes(mockOptions.files.length);
        });

        it("should copy pages from loaded PDFs to merged document", async () => {
            const mockMergedDoc = {
                copyPages: jest.fn<() => Promise<PDFPage[]>>().mockResolvedValue([{} as PDFPage]),
            } as unknown as PDFDocument;

            const mockPdfDocuments = [
                { getPageIndices: jest.fn().mockReturnValue([0]) } as unknown as PDFDocument,
                { getPageIndices: jest.fn().mockReturnValue([0]) } as unknown as PDFDocument,
            ];

            const pdfMerger = new PdfMerger(mockFileSystem);
            const copiedPages = await pdfMerger["copyPages"](mockMergedDoc, mockPdfDocuments);

            expect(mockMergedDoc.copyPages).toHaveBeenCalledTimes(mockPdfDocuments.length);
            expect(copiedPages).toHaveLength(2);
        });
    });
});
