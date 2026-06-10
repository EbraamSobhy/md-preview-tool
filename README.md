# Markdown Preview Tool (mdpreview)

A lightweight, real-time Markdown previewer for your terminal. Instantly visualize your Markdown files in the browser with GitHub-inspired styling as you type.

![Real-time Preview](https://img.shields.io/badge/Preview-Real--time-brightgreen)
![License](https://img.shields.io/badge/License-ISC-blue)

## Features

- **Instant Real-time Updates:** Uses WebSockets to refresh the preview immediately as you save your changes.
- **GitHub-style Rendering:** Uses `github-markdown-css` for a familiar, clean look.
- **Minimalistic & Fast:** Powered by Express, Marked, and Chokidar for a seamless experience.
- **Simple CLI:** Start previewing with a single command.

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v14.x or higher recommended)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)

## Installation

You can install the tool globally via npm:

```bash
# Clone the repository
git clone https://github.com/EbraamSobhy/md-preview-tool.git

# Navigate to the directory
cd md-preview-tool

# Install globally
npm install -g .
```

## Usage

To start previewing a Markdown file, simply run:

```bash
mdpreview your-file.md
```

Once started, open your browser and navigate to:
[http://localhost:3000](http://localhost:3000)

## How it Works

1.  **CLI Entry:** The `mdpreview` command points to `server.js`.
2.  **Server:** A local Express server starts on port 3000.
3.  **Watching:** `chokidar` monitors the specified Markdown file for any changes.
4.  **Syncing:** When a change is detected, the updated HTML is sent via WebSockets to the browser.

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests to improve the tool.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License - see the [package.json](package.json) file for details.
