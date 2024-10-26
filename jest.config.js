/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
    preset: "ts-jest",
    testEnvironment: "node",
    rootDir: "./src",
    displayName: "unit-tests",
    extensionsToTreatAsEsm: [".ts"],
    transform: {
        "^.+\\.(ts)$": [
            "ts-jest",
            {
                useESM: true,
                tsconfig: "tsconfig.test.json",
                diagnostics: {
                    ignoreCodes: ["TS151001"],
                },
            },
        ],
    },
    moduleNameMapper: {
        "^(\\.{1,2}/.*)\\.js$": "$1",
    },
    testMatch: ["**/tests/**/?(*.)+(spec).[tj]s?(x)"],
    clearMocks: true,
};
