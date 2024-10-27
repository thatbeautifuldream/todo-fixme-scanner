# todo-fixme-scanner

A command-line tool to scan your project for TODO and FIXME comments, helping you keep track of pending tasks and issues in your codebase.

## Features

- Recursively scans directories for TODO and FIXME comments
- Supports multiple file types including JavaScript, TypeScript, Markdown, HTML, CSS, and more
- Excludes common directories like node_modules, .git, and build folders
- Flexible output formats: console, JSON, and CSV
- Easy to use with customizable options

## Installation

Install the package globally using npm:

```bash
npm install -g todo-fixme-scanner
```

Or use it directly with npx:

```bash
npx todo-fixme-scanner@latest
```

## Usage

### Basic Usage

To scan the current directory and display results in the console:

```bash
todo-fixme-scanner
```

### Custom Directory

To scan a specific directory:

```bash
todo-fixme-scanner --dir /path/to/your/project
```

### Output Formats

Choose between console (default), JSON, or CSV output:

```bash
todo-fixme-scanner --output console
todo-fixme-scanner --output json
todo-fixme-scanner --output csv
```

### Command-line Options

- `--dir`, `-d`: Specify the directory to scan (default: current working directory)
- `--output`, `-o`: Specify the output format: 'console', 'json', or 'csv' (default: console)

## Example Output

### Console Output

```
🔍 Scanning project for TODO/FIXME comments...

TODO: Implement user authentication
File: /path/to/your/project/src/auth.js:15

FIXME: Optimize database query for better performance
File: /path/to/your/project/src/database.js:42

✅ Scan complete.
```

### JSON Output

```json
[
  {
    "type": "TODO",
    "text": "Implement user authentication",
    "file": "/path/to/your/project/src/auth.js",
    "line": 15
  },
  {
    "type": "FIXME",
    "text": "Optimize database query for better performance",
    "file": "/path/to/your/project/src/database.js",
    "line": 42
  }
]
```

### CSV Output

```csv
Type,Text,File,Line
TODO,"Implement user authentication",/path/to/your/project/src/auth.js,15
FIXME,"Optimize database query for better performance",/path/to/your/project/src/database.js,42
```

## Supported File Types

The scanner supports the following file extensions:

- JavaScript: .js, .jsx
- TypeScript: .ts, .tsx
- Markdown: .md, .mdx
- HTML: .html
- CSS: .css
- JSON: .json
- YAML: .yml, .yaml
- SCSS/SASS: .scss, .sass
- LESS: .less

## Excluded Directories

The following directories are automatically excluded from scanning:

- node_modules
- .next
- .out
- .dist
- .git
- build
- .cache

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
