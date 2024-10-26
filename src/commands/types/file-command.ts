import { Command } from "commander";

export interface FileCommand {
    build(): Command;
}
