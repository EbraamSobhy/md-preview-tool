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
  <style>body{max-width:800px;margin:40px auto;padding:0 20px}</style>
</head>
<body class="markdown-body">
  <div id="content">${html}</div>
  <script>
    const ws = new WebSocket('ws://localhost:3000');
    ws.onmessage = e => document.getElementById('content').innerHTML = e.data;
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
