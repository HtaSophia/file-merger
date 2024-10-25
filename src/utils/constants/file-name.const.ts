const RESERVED_FILE_NAMES = [
    "CON",
    "PRN",
    "AUX",
    "NUL",
    "COM1",
    "COM2",
    "COM3",
    "COM4",
    "COM5",
    "COM6",
    "COM7",
    "COM8",
    "COM9",
    "LPT1",
    "LPT2",
    "LPT3",
    "LPT4",
    "LPT5",
    "LPT6",
    "LPT7",
    "LPT8",
    "LPT9",
];

export const FORBIDDEN_CHARS_REGEX = new RegExp(`[<>:"\/\\|?*\x00-\x1F]`, "g");
export const RESERVED_NAMES_REGEX = new RegExp(`^(${RESERVED_FILE_NAMES.join("|")})$`, "i");
export const MAX_LENGTH = 255;
