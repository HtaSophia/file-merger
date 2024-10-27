# Examples

This folder contains some example files and commands to run them.

## Commands

`help` command:

```bash
file-merger -h
```

### PDF

`pdf` help command:

```bash
file-merger pdf -h
```

`pdf` no options command:

```bash
file-merger pdf
```

_If no files are provided, the CLI will ask for them automatically._

`pdf` merge command:

```bash
file-merger pdf -f ./examples/assets/pdfs/file1.pdf ./examples/assets/pdfs/file2.pdf -o mergedFile
```

### TXT

`txt` help command:

```bash
file-merger txt -h
```

`txt` no options command:

```bash
file-merger txt
```

_If no files are provided, the CLI will ask for them automatically._

`txt` merge command:

```bash
file-merger txt -f ./examples/assets/txts/file1.txt ./examples/assets/txts/file2.txt -o mergedFile
```
