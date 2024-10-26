#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

// Directories to exclude from scanning
const EXCLUDE_DIRS = [
  "node_modules",
  ".next",
  ".out",
  ".dist",
  ".git",
  "build",
  ".cache",
];

// File extensions to include in scanning
const INCLUDE_EXTENSIONS = [
  ".js",
  ".jsx",
  ".ts",
  ".tsx",
  ".md",
  ".mdx",
  ".html",
  ".css",
  ".json",
  ".yml",
  ".yaml",
  ".scss",
  ".sass",
  ".less",
];

// Function to recursively scan directories and look for TODO/FIXME comments
const scanDirectory = (dir) => {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // Skip excluded directories
      if (!EXCLUDE_DIRS.includes(file)) {
        scanDirectory(filePath);
      }
    } else if (
      stat.isFile() &&
      INCLUDE_EXTENSIONS.some((ext) => file.endsWith(ext))
    ) {
      scanFileForComments(filePath);
    }
  });
};

// Function to find TODO/FIXME comments in a file
const scanFileForComments = (file) => {
  const content = fs.readFileSync(file, "utf-8");
  const lines = content.split("\n");

  lines.forEach((line, index) => {
    const todoMatch = line.match(/(TODO|FIXME):?\s*(.*)/);
    if (todoMatch) {
      const [, type, text] = todoMatch;

      console.log(
        `\n${type}: ${text.trim()}\n` + `File: ${file}:${index + 1}\n`
      );
    }
  });
};

// Start scanning from the current directory
const startScan = () => {
  console.log("🔍 Scanning project for TODO/FIXME comments...\n");
  scanDirectory(process.cwd());
  console.log("\n✅ Scan complete.");
};

// Execute the scan
startScan();
