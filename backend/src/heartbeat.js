const fs = require('node:fs');
const path = require('node:path');

const CONTENT_DIR = path.join(__dirname, '..', '..', 'content');

/**
 * The General's mandated "Heartbeat Log": write the last successful ingest-cycle status so a stale site
 * (failed cron / rate-limited scraper) is visibly obvious in the frontend footer rather than silent.
 */
function writeHeartbeat({ itemsScanned, itemsPublished, itemsFlagged, ok = true }) {
  const payload = {
    lastRun: new Date().toISOString(),
    itemsScanned,
    itemsPublished,
    itemsFlagged,
    ok,
  };
  fs.mkdirSync(CONTENT_DIR, { recursive: true });
  fs.writeFileSync(path.join(CONTENT_DIR, 'heartbeat.json'), JSON.stringify(payload, null, 2) + '\n');
  return payload;
}

module.exports = { writeHeartbeat };
