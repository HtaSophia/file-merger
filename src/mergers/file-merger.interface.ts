export interface IFileMerger {
    merge(files: string[], output: string): Promise<void>;
}
