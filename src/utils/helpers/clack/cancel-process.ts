import { cancel } from "@clack/prompts";

export const cancelProcess = (): void => {
    cancel("Operation cancelled");
    process.exit(0);
};
