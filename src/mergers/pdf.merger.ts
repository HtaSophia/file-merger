import { PDFDocument, PDFPage } from "pdf-lib";
import { CURR_DIR } from "../utils/constants/system-info.const.js";
import { IFileSystem } from "../core/file-system/file-system.interface.js";
import { IFileMerger } from "./file-merger.interface.js";

export class PdfMerger implements IFileMerger {
    constructor(private readonly fileSystem: IFileSystem) {}

    async merge(files: string[], output: string): Promise<void> {
        const mergedPdfDocument = await PDFDocument.create();
        const pdfDocuments = await this.loadPdfs(files);
        const copiedPages = await this.copyPages(mergedPdfDocument, pdfDocuments);

        copiedPages.forEach((page) => mergedPdfDocument.addPage(page));

        const mergedPdfBytes = await mergedPdfDocument.save();
        const outputPath = this.fileSystem.joinPaths(CURR_DIR, output);
        await this.fileSystem.writeFile(outputPath, mergedPdfBytes);
    }

    private async loadPdfs(files: string[]): Promise<PDFDocument[]> {
        const pdfBuffers = await this.readFiles(files);
        return Promise.all(pdfBuffers.map((pdfBuffer) => PDFDocument.load(pdfBuffer)));
    }

    private async readFiles(files: string[]): Promise<Buffer[]> {
        return Promise.all(files.map((file) => this.fileSystem.readFile(file)));
    }

    private async copyPages(mergedDoc: PDFDocument, pdfs: PDFDocument[]): Promise<PDFPage[]> {
        const copiedPages = await Promise.all(pdfs.map((pdf) => mergedDoc.copyPages(pdf, pdf.getPageIndices())));
        return copiedPages.flat();
    }
}
