#!/usr/bin/env node

const express = require('express');
const { marked } = require('marked');
const chokidar = require('chokidar');
const { WebSocketServer } = require('ws');
const fs = require('fs');
const path = require('path');
const http = require('http');

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const filePath = process.argv[2];
if (!filePath) { console.error('Usage: node server.js <file.md>'); process.exit(1); }
const absPath = path.resolve(filePath);

app.get('/', (req, res) => {
    const content = fs.readFileSync(absPath, 'utf-8');
    const html = marked(content);
    res.send(`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>MD Preview</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.5.0/github-markdown.min.css">
<link rel="stylesheet"
 href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/styles/github-dark.min.css">

<script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/highlight.min.js"></script>

<!-- Common programming languages -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/javascript.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/python.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/bash.min.js"></script>
  <style>
html, body {
    background-color: #000 !important;
    min-height: 100%;
}

body {
    max-width: 800px;
    margin: 40px auto;
    padding: 0 20px;
}

.markdown-body {
    background-color: #000 !important;
    color: #fff;
}

.markdown-body h1,
.markdown-body h2,
.markdown-body h3,
.markdown-body p,
.markdown-body li,
.markdown-body blockquote {
    color: #fff;
}
.markdown-body pre,
.markdown-body pre code,
.markdown-body code {
    background-color: #000 !important;
    color: #fff !important;
}

.markdown-body pre {
    border: 1px solid #333;
    border-radius: 6px;
    padding: 16px;
}

.markdown-body code {
    border-radius: 4px;
}
/* Markdown tables */
.markdown-body table {
    display: block;
    width: 100%;
    overflow-x: auto;
    border-collapse: collapse;
    border-spacing: 0;
    background: #000 !important;
    border: 1px solid #333 !important;
    border-radius: 8px;
    margin: 20px 0;
}

/* Table header */
.markdown-body table th {
    background: #161616 !important;
    color: #fff !important;
    font-weight: 600;
    padding: 12px 16px;
    border: 1px solid #333 !important;
    text-align: left;
}

/* Table cells */
.markdown-body table td {
    background: #000 !important;
    color: #ddd !important;
    padding: 12px 16px;
    border: 1px solid #333 !important;
}

/* Hover effect */
.markdown-body table tr:hover td {
    background: #111 !important;
}

/* Bold text inside tables */
.markdown-body table strong {
    color: #fff;
}

/* Links inside tables */
.markdown-body table a {
    color: #58a6ff;
}

/* Inline code inside tables */
.markdown-body table code {
    background: #1a1a1a !important;
    color: #c792ea !important;
    padding: 3px 6px;
    border-radius: 4px;
}
</style>
</head>
<body class="markdown-body">
  <div id="content">${html}</div>
<script>
    const ws = new WebSocket('ws://localhost:3000');

    function highlightCode() {
        document.querySelectorAll('#content pre code').forEach(block => {
            hljs.highlightElement(block);
        });
    }

    // Highlight initial content
    highlightCode();

    // Update and highlight whenever Markdown changes
    ws.onmessage = e => {
        document.getElementById('content').innerHTML = e.data;
        highlightCode();
    };
</script>

</body>
</html>`);
});

wss.on('connection', ws => {
    chokidar.watch(absPath).on('change', () => {
        const updated = marked(fs.readFileSync(absPath, 'utf-8'));
        ws.send(updated);
    });
});

server.listen(3000, () => {
    console.log(`Preview running at http://localhost:3000`);
});
