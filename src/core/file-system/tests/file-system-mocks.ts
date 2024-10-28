export const FILE_SYSTEM_MOCKS = {
    bufferFile: Buffer.from("File content"),
    complexPath: "C:/valid/path/file1.pdf",
    differentFiles: ["file1.pdf", "file1.txt", "file2.pdf"],
    fileName: "mergedFiles",
    forbiddenCharPath: "invalid|file.pdf",
    invalidPath: "/invalid/path",
    invalidPathWithExtension: "/invalid/path.pdf",
    longFilePath: `a${"b".repeat(300)}.pdf`,
    notNormalizedPath: "/valid//path",
    path: "/valid/path",
    pathWithExtension: "/valid/path.pdf",
    pdfFile: "file1.pdf",
    pdfFiles: ["file1.pdf", "file2.pdf"],
    txtFile: "file1.txt",
};
