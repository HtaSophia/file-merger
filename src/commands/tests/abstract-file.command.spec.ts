import { Command } from "commander";
import { afterEach, beforeEach, describe, expect, it, jest } from "@jest/globals";
import { AbstractFileCommand } from "../abstract-file.command";
import { FileExtension } from "../../utils/types/file-extension";
import { IAction } from "../../actions/action.interface";

class AbstractFileMockCommand extends AbstractFileCommand {
    public create(name: string, description: string, fileExtension: FileExtension): Command {
        return super.create(name, description, fileExtension);
    }

    public build(): Command {
        return new Command("mock");
    }
}

describe("AbstractFileCommand", () => {
    let mockAction: jest.Mocked<IAction>;

    beforeEach(() => {
        mockAction = {
            handle: jest.fn(),
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should be defined", () => {
        expect(AbstractFileMockCommand).toBeDefined();
    });

    it("should be an instance of AbstractFileMockCommand", () => {
        const command = new AbstractFileMockCommand(mockAction);
        expect(command).toBeDefined();
    });

    it("should create the command", () => {
        const command = new AbstractFileMockCommand(mockAction);
        const createdCommand = command.create("mock", "mock desc", FileExtension.PDF);

        expect(createdCommand.name()).toBe("mock");
        expect(createdCommand.description()).toBe("mock desc");
        expect(command.build()).toBeDefined();
    });
});
