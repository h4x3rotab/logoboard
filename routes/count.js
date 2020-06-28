var express = require('express');
var router = express.Router();

const storage = require('node-persist');
const fs = require('fs');

async function increment(idx) {
  // increment count
  const numLogos = parseInt(process.env.NUM_LOGOS);
  if (idx < 0 || idx >= numLogos) {
    console.warn(`No such logo ${idx}`);
    return;
  }
  await storage.init({dir: process.env.STORAGE});
  const counts = await storage.get('counts') || new Array(numLogos).fill(0);
  counts[idx]++;
  await storage.set('counts', counts);
  // output string
  const outStr = counts
    .map(x => Math.min(9999, x).toString().padStart(4, '0'))
    .join('');
  const displayFile = process.env.DISPLAY_FILE;
  fs.writeFileSync(displayFile, outStr, {encoding: 'utf-8'});
}

router.get('/:logoId', async function(req, res, next) {
  increment(req.params.logoId);
  res.send({status: 'ok'});
});

module.exports = router;
