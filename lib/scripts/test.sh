#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

echo -e "\n\033[0;32mtesting built wasm with versa wasm runtime...\033[0m"

# Define the path to your WebAssembly module
BUILD_WASM_PATH="./dist/build.wasm"
WASM_PATH="./dist/versa.wasm"
WASM_URL="https://pub-7ab7c88a9a43431382c12cf40b7a6edf.r2.dev/versa-wasm"

# Check if the JSON input file path is provided as an argument
if [ -z "$1" ]; then
    echo -e "\033[0;31mError: No JSON input file path provided.\033[0m"
    exit 0
fi
INPUT_JSON_PATH="$1"

# Check if the provided JSON input file exists
if [ ! -f "$INPUT_JSON_PATH" ]; then
    echo -e "\033[0;31mError: JSON input file '$INPUT_JSON_PATH' does not exist.\033[0m"
    exit 0
fi

echo -e "\033[0;33mchecking if wasm file exists...\033[0m"
if [ ! -f "$WASM_PATH" ]; then
    echo -e "\033[0;31mWASM file not found. Downloading from $WASM_URL...\033[0m"
    curl -L -o "$WASM_PATH" "$WASM_URL"
else
    echo -e "\033[0;34mWASM file already exists. Skipping download.\033[0m"
fi

chmod +x "$WASM_PATH"

echo -e "\033[0;36mRunning the test using versa-wasm...\033[0m"
TEST_RESULT=$(./dist/versa.wasm execute --wasm "$BUILD_WASM_PATH" --json "$INPUT_JSON_PATH" | jq -r '.success')

echo -e "\n\033[0;33mTest results:\033[0m"

if [ "$TEST_RESULT" == "true" ]; then
    echo -e "\033[0;32mContract method was successful.\033[0m"
    echo -e "\033[0;32mOutput: \033[0m"
    ./dist/versa.wasm execute --wasm "$BUILD_WASM_PATH" --json "$INPUT_JSON_PATH" | jq
else
    echo -e "\033[0;31mContract method was unsuccessful.\033[0m"
fi

echo -e "\033[0;32mTest complete.\033[0m"
