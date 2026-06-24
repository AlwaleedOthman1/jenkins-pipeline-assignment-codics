const https = require('https');

const requiredEnv = [
  'JIRA_BASE_URL',
  'JIRA_ISSUE',
  'JIRA_COMMENT',
  'JIRA_USER',
  'JIRA_TOKEN'
];

for (const name of requiredEnv) {
  if (!process.env[name]) {
    console.error(`Missing required environment variable: ${name}`);
    process.exit(1);
  }
}

const baseUrl = process.env.JIRA_BASE_URL.replace(/\/$/, '');
const issueKey = process.env.JIRA_ISSUE;
const comment = process.env.JIRA_COMMENT;
const auth = Buffer.from(`${process.env.JIRA_USER}:${process.env.JIRA_TOKEN}`).toString('base64');

const payload = JSON.stringify({
  body: {
    type: 'doc',
    version: 1,
    content: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: comment
          }
        ]
      }
    ]
  }
});

const url = new URL(`${baseUrl}/rest/api/3/issue/${encodeURIComponent(issueKey)}/comment`);

console.log(`Posting Jira comment to ${baseUrl}/browse/${issueKey}`);

const request = https.request(
  url,
  {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(payload)
    }
  },
  (response) => {
    let body = '';

    response.on('data', (chunk) => {
      body += chunk;
    });

    response.on('end', () => {
      if (response.statusCode < 200 || response.statusCode >= 300) {
        console.error(`Jira comment failed with HTTP ${response.statusCode}`);
        console.error(body);
        console.error('Check JIRA_BASE_URL, JIRA_ISSUE, and whether the Jira credential user can browse and comment on this issue.');
        process.exit(1);
      }

      console.log(`Jira comment posted to ${issueKey}`);
    });
  }
);

request.on('error', (error) => {
  console.error(`Jira comment request failed: ${error.message}`);
  process.exit(1);
});

request.write(payload);
request.end();
