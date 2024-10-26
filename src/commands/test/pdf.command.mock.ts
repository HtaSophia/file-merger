import { Command } from "commander";
import { PdfCommand } from "../pdf.command";
import { FileExtension } from "../../utils/types/file-extension";

export class PdfCommandMock extends PdfCommand {
    public static readonly NAME = "pdf";
    public static readonly DESCRIPTION = "merges PDF files";

    public create(name: string, description: string, fileExtension: FileExtension): Command {
        return super.create(name, description, fileExtension);
    }
}
