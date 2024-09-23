# mth-cli
**mth-cli** is a command-line tool that converts Markdown files to HTML. It supports custom HTML templates, batch conversion of files, and a watch mode to automatically update HTML when Markdown files are modified.

## Features
 - Convert single or multiple Markdown files to HTML.
 - Use custom HTML templates.
 - Watch mode for real-time file conversion on changes.
 - Batch conversion of all Markdown files in a directory.

## Installation
First, install the package globally using npm:

``` bash
npm install -g my-mth-cli
```
This will install the mth-cli command globally on your system.

## Usage
### Basic Command
```bash
mth-cli <inputDir> <outputDir> [options]
```
- <inputDir>: The directory containing Markdown files or a single Markdown file.
- <outputDir>: The directory where the converted HTML files will be saved.


## Options

| Option          | Alias | Description                                   | Default                  |
|-----------------|-------|-----------------------------------------------|--------------------------|
| `--template`    | `-t`  | Path to a custom HTML template                | `"<html><body>{{content}}</body></html>"` |
| `--watch`       | `-w`  | Watch the input directory for changes         | `false`                  |
| `--single`      | `-s`  | Convert a single Markdown file                | `false`                  |
| `--help`        |       | Show help                                     |                          |
| `--version`     |       | Show version number                           |                          |


## Examples
### 1. Convert a Single Markdown File  
**Convert a single file named `README.md` into HTML:**

```bash
mth-cli README.md output/
```
This will create `output/README.html`.

### 2. Convert Multiple Markdown Files
**Convert all .md files in the docs directory to HTML files in the output directory:**

```bash
mth-cli docs/ output/
```
This will convert all the Markdown files in docs and output the corresponding `.html` files to the `output/` directory.

### 3. Using a Custom HTML Template
**To specify a custom template, use the `--template` option. For example, if you have a custom template file `template.html`, run:**

```bash
mth-cli docs/ output/ --template template.html
```
In your template, use `{{content}}` as a placeholder for the converted Markdown content:

```html
<html>
  <head>
    <title>Custom Template</title>
  </head>
  <body>
    <h1>Markdown Output</h1>
    {{content}}
  </body>
</html>
```

### 4. Watching for File Changes
**To automatically convert files when changes are detected, use the `--watch` option:**

```bash
mth-cli docs/ output/ --watch
```
Any time a Markdown file in the docs/ directory is modified, the corresponding HTML file will be regenerated in the output/ directory.

### 5. Command Help
**Run the following command to see all available options:**

```bash
mth-cli --help
```

## Development
If you want to work on the tool locally:

### 1. Clone this repository:

```bash
git clone https://github.com/satyammattoo/mth-cli.git
```

### 2. Install dependencies:

```bash
npm install
```

### 3. Link the project:

```bash
npm link
```

### 3. Build and run the project:

```bash
npm run dev
```

### 4. Run the tool locally:

```bash
mth-cli <inputDir> <outputDir> [options]
```

## Contributing
Feel free to open issues or submit pull requests for bug fixes, improvements, or new features. Contributions are welcome!

## Author
Satyam Mattoo