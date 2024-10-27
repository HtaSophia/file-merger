# File Merger CLI

A command line interface (CLI) to merge multiple files (PDF and TXT) into a single file.

## Table of Contents

-   [Installation](#installation)
-   [Usage](#usage)
-   [Commands](#commands)
-   [Examples](#examples)
-   [Folder Structure](#folder-structure)
-   [License](#license)

## Installation

Ensure you have Node.js v18+ and npm installed on your machine.

1. Clone the repository:

    ```bash
    git clone https://github.com/HtaSophia/file-merger.git
    ```

2. Navigate to the project directory and install the dependencies:

    ```bash
    cd file-merger
    npm install
    ```

3. Build the project:

    ```bash
    npm run build
    ```

4. Link the project globally to make the file-merger command temporarily available on your system:
    ```bash
    npm link
    ```

## Usage

Run the CLI with the following command: `file-merger`

The CLI will display the following help message:

```bash
Usage: file-merger [options] [command]

Options:
  -h, --help                display help for command

Commands:
  pdf [options] [files...]  merges PDF files
  txt [options] [files...]  merges TXT files
  help [options] [command]  display help for command
```

### Commands

#### `pdf`

The files argument and the output option are optional when executing the command. If you don't pass the arguments or options, they will be requested during the process.

```bash
Usage: file-merger pdf [options]

merges PDF files

Options:
  -f, --files [files...]  list of file paths to merge
  -o, --output [output]   output file name
  -h, --help              display help for command
```

#### `txt`

The files argument and the output option are optional when executing the command. If you don't pass the arguments or options, they will be requested during the process.

```bash
Usage: file-merger txt [options]

merges TXT files

Options:
  -f, --files [files...]  list of file paths to merge
  -o, --output [output]   output file name
  -h, --help              display help for command
```

#### Example

To merge PDF files:

```bash
file-merger pdf -f C://path/to/file1.pdf ./file2.pdf -o mergedFile
```

## Examples

You can find some examples in the [`examples`](examples) folder.

## Folder Structure

```
/src
├── /actions        # Contains command actions
├── /commands       # Contains command classes
├── /core
|   └── /file-system    # File system operations
├── /mergers        # File merging logic
├── /prompts        # User input prompts
├── /utils          # Utility functions and types
├── package.json
├── jest.config.js
├── tsconfig.json
├── tsconfig.test.json
└── README.md

/examples
├── assets
|   ├── pdfs        # PDF files
|   └── txts        # TXT files
└── README.md
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
