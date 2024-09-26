# mth-cli

**mth-cli** is a command-line tool that converts Markdown files to HTML. It supports custom HTML templates, batch conversion of files, and a watch mode to automatically update HTML when Markdown files are modified.

## Features

- Convert single or multiple Markdown files to HTML.
- Use custom HTML templates.
- Watch mode for real-time file conversion on changes.
- Batch conversion of all Markdown files in a directory.
- Custom CSS support.

## Installation

First, install the package globally using npm:

```bash
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

| Option       | Alias | Description                           | Default                     |
| ------------ | ----- | ------------------------------------- | --------------------------- |
| `--single`   | `-s`  | Convert a single Markdown file        | `false`                     |
| `--template` | `-t`  | Path to a custom HTML template        | `src/template/default.html` |
| `--css`      | `-c`  | Path to a custom CSS file             | `""`                        |
| `--watch`    | `-w`  | Watch the input directory for changes | `false`                     |
| `--live`     | `-l`  | Enable live server functionality      | `false`                     |
| `--port`     | `-p`  | Port number for the live server       | `8080`                      |
| `--help`     |       | Show help                             |                             |
| `--version`  |       | Show version number                   |                             |

## Using a Configuration File - mthclirc.json

To simplify the command line usage, you can use the configuration file (mthclirc.json) instead of using flags:

```js
{
    "watch": true,
    "single": false,
    "template":"path/to/template.html",
    "css": [
        "./styles.css"
    ],
    "live": true,
    "port": 8080
}
```

The CLI requires atleast two argumnents: `inputDir` and `outputDir`.

## Examples

### 1. Convert a Single Markdown File

**Convert a single file named `README.md` into HTML:**

```bash
mth-cli -s README.md output/
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

**NOTE:** In your template, use `{{title}}`, `{{content}}` and `{{script}}` , as a placeholders for the converted Markdown content:

```html
<html>
  <head>
    <title>{{title}}</title>
  </head>
  <body>
    <h1>Markdown Output</h1>
    <div id="content">{{content}}</div>
    <script>{{script}}</script>
  </body>
</html>
```

### 4. Watching for File Changes

**To automatically convert files when changes are detected, use the `--watch` option:**

```bash
mth-cli docs/ output/ --watch
```

Any time a Markdown file in the docs/ directory is modified, the corresponding HTML file will be regenerated in the output/ directory.

### 5. Using Live Server

**To start a live server for real-time viewing, use the --live and --port (default is 8080) options:**

```bash
mth-cli docs/ output/ --live --watch
```

This will start a live server at http://localhost:8080 where you can view the converted HTML files. The page will automatically refresh when changes are detected.

**NOTE:** The live server will only work if the `--watch` option is also set.

### 6. Adding CSS Styles

**You can enhance the appearance of your generated HTML files by including CSS stylesheets. To do this, simply provide the paths to your CSS files when running the CLI tool.**

```bash
mth-cli --input ./path/to/markdown --output ./path/to/html --css ./path/to/styles.css
```

#### In this example:

Replace your-cli-tool with the actual name of your CLI tool.

- input specifies the path to your Markdown files.
- output specifies the directory where you want the generated HTML files to be saved.
- css allows you to specify one or more CSS files to include in the generated HTML.

#### Multiple CSS Files

You can also provide multiple CSS files like this in the configuration file:

```json
{
  "css": ["tmp/style-1.css", "tmp/style-2.css", "tmp/dir/style-3.css"]
}
```

This will include both styles1.css and styles2.css in your HTML files. Also this works only the current directories, i.e. `tmp` and `tmp/dir` will have different CSS files.

### 7. Command Help

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
