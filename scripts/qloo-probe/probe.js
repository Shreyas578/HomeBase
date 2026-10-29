/**
 * Qloo Probe Script
 * Verifies Qloo API endpoints, headers, entity search, and recommendation parameters.
 * Usage: node probe.js [OPTIONAL_API_KEY]
 */

const https = require('https');

const API_KEY = process.env.QLOO_API_KEY || process.argv[2] || '';
const BASE_HOST = 'hackathon.api.qloo.com';

function requestQloo(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: BASE_HOST,
      path: path,
      method: 'GET',
      headers: {
        'X-Api-Key': API_KEY,
        'Accept': 'application/json',
      },
      timeout: 10000,
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timed out'));
    });
    req.end();
  });
}

async function runProbe() {
  console.log('=== QLOO API PROBE ===');
  console.log(`Base URL: https://${BASE_HOST}`);
  console.log(`API Key Provided: ${API_KEY ? 'YES (length ' + API_KEY.length + ')' : 'NO'}`);

  if (!API_KEY) {
    console.log('\n[NOTICE] No QLOO_API_KEY found in env or argv.');
    console.log('To run live probe once key is set:');
    console.log('  node scripts/qloo-probe/probe.js <YOUR_QLOO_API_KEY>');
    return;
  }

  // Probe 1: Search Entity
  console.log('\n1. Testing /search endpoint (Search for artist "Daft Punk")...');
  try {
    const searchRes = await requestQloo('/search?query=Daft%20Punk&types=urn:entity:artist');
    console.log('Status:', searchRes.status);
    console.log('Response sample:', JSON.stringify(searchRes.data, null, 2).slice(0, 500));
  } catch (err) {
    console.error('Search error:', err.message);
  }

  // Probe 2: Insights API
  console.log('\n2. Testing /v2/insights endpoint (Artist recommendations)...');
  try {
    const insightRes = await requestQloo('/v2/insights?filter.type=urn:entity:artist&signal.interests.tags=electronic');
    console.log('Status:', insightRes.status);
    console.log('Response sample:', JSON.stringify(insightRes.data, null, 2).slice(0, 500));
  } catch (err) {
    console.error('Insights error:', err.message);
  }
}

runProbe();
