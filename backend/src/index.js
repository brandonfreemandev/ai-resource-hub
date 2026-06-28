const fs = require('node:fs');
const path = require('node:path');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const { SOURCES } = require('./sources');

const app = express();
const PORT = process.env.PORT || 5000;
const CONTENT_DIR = path.join(__dirname, '..', '..', 'content');

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Basic route
app.get('/', (req, res) => {
  res.send('AI Resource Hub Backend is running!');
});

// The Heartbeat Log — last ingest-cycle status (frontend reads /content/heartbeat.json directly; this
// endpoint is for tooling / a future admin view).
app.get('/api/heartbeat', (req, res) => {
  try {
    const raw = fs.readFileSync(path.join(CONTENT_DIR, 'heartbeat.json'), 'utf8');
    res.json(JSON.parse(raw));
  } catch {
    res.json({ lastRun: null, itemsScanned: 0, itemsPublished: 0, itemsFlagged: 0, ok: false });
  }
});

// What the Engine is configured to watch.
app.get('/api/status', (req, res) => {
  res.json({ ok: true, sources: SOURCES.map((s) => ({ id: s.id, name: s.name, kind: s.kind })) });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Backend server listening on port ${PORT}`);
});
