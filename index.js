#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

/** @type {string[]} Directories to exclude from scanning */
const EXCLUDE_DIRS = [
  "node_modules",
  ".next",
  ".out",
  ".dist",
  ".git",
  "build",
  ".cache",
];

/** @type {string[]} File extensions to include in scanning */
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

// Parse command-line arguments
const args = process.argv.slice(2);

/**
 * @typedef {Object} Options
 * @property {string} dir - Directory to scan (defaults to current working directory)
 * @property {('console'|'json'|'csv')} output - Output format
 */

/** @type {Options} */
const options = {
  dir: process.cwd(),
  output: "console",
};

/**
 * Parse command-line arguments
 * @param {string[]} args - Command-line arguments
 * @returns {void}
 */
const parseArguments = (args) => {
  args.forEach((arg, index) => {
    if (arg === "--dir" || arg === "-d") {
      options.dir = args[index + 1] || process.cwd();
    } else if (arg === "--output" || arg === "-o") {
      options.output = args[index + 1] || "console";
    }
  });
};

/**
 * @typedef {Object} CommentResult
 * @property {string} type - Type of comment (TODO or FIXME)
 * @property {string} text - Content of the comment
 * @property {string} file - File path where the comment was found
 * @property {number} line - Line number of the comment
 */

/**
 * Recursively scan directories and look for TODO/FIXME comments
 * @param {string} dir - Directory to scan
 * @returns {CommentResult[]} Array of found TODO/FIXME comments
 */
const scanDirectory = (dir) => {
  const results = [];

  /**
   * Recursive function to scan directories
   * @param {string} currentDir - Current directory being scanned
   */
  const scan = (currentDir) => {
    const files = fs.readdirSync(currentDir);

    files.forEach((file) => {
      const filePath = path.join(currentDir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        if (!EXCLUDE_DIRS.includes(file)) {
          scan(filePath);
        }
      } else if (
        stat.isFile() &&
        INCLUDE_EXTENSIONS.some((ext) => file.endsWith(ext))
      ) {
        const fileResults = scanFileForComments(filePath);
        results.push(...fileResults);
      }
    });
  };

  try {
    scan(dir);
    return results;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

/**
 * Find TODO/FIXME comments in a file
 * @param {string} file - File path to scan
 * @returns {CommentResult[]} Array of found TODO/FIXME comments in the file
 */
const scanFileForComments = (file) => {
  const content = fs.readFileSync(file, "utf-8");
  const lines = content.split("\n");
  const results = [];

  lines.forEach((line, index) => {
    const todoMatch = line.match(/(TODO|FIXME)(?::)?\s*(.*)/);
    if (todoMatch) {
      const [, type, text] = todoMatch;
      results.push({
        type,
        text: text.trim(),
        file,
        line: index + 1,
      });
    }
  });

  return results;
};

/**
 * Output results in the specified format
 * @param {CommentResult[]} results - Array of found TODO/FIXME comments
 * @param {('console'|'json'|'csv')} format - Output format
 */
const outputResults = (results, format) => {
  switch (format) {
    case "json":
      console.log(JSON.stringify(results, null, 2));
      break;
    case "csv":
      console.log("Type,Text,File,Line");
      results.forEach(({ type, text, file, line }) => {
        console.log(`${type},"${text}",${file},${line}`);
      });
      break;
    default:
      results.forEach(({ type, text, file, line }) => {
        // Remove any existing colon from the type and ensure there's only one
        const cleanType = type.replace(/:$/, "");
        console.log(`\n${cleanType}: ${text}\n` + `File: ${file}:${line}\n`);
      });
  }
};

/**
 * Start scanning from the specified directory
 */
const startScan = () => {
  console.log("🔍 Scanning project for TODO/FIXME comments...\n");

  const results = scanDirectory(options.dir);
  outputResults(results, options.output);

  console.log("\n✅ Scan complete.");
};

// Execute the argument parsing
parseArguments(args);

// Execute the scan
startScan();
