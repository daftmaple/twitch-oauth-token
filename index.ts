import express from 'express';
import http from 'http';
import appendQuery from 'append-query';
import qs from 'qs';
import fetch from 'node-fetch';
import fs from 'fs';

const config = JSON.parse(fs.readFileSync('./config.json', 'utf-8'));

const port = config.port || '9000';
const scopes = config.scopes || [];

const redirect_uri = `http://localhost:${port}/oauth2/twitch`;

if (!config.clientId || !config.clientSecret) {
  console.error('CLIENT_ID or CLIENT_SECRET is undefined');
  process.exit(1);
}

const getAccessToken = async (exchange: object) => {
  try {
    const r = await fetch(`https://id.twitch.tv/oauth2/token`, {
      method: 'POST',
      body: qs.stringify(exchange),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const j = await r.json();

    console.log(j);

    return j;
  } catch (e) {
    console.error('Exchange error: ' + e);
    return null;
  }
};

const app = express();

app.get('/oauth2/twitch', async (req, res) => {
  const e = {
    client_id: config.clientId,
    client_secret: config.clientSecret,
    code: req.query.code,
    grant_type: 'authorization_code',
    redirect_uri: redirect_uri,
    scope: scopes,
  };

  const r = await getAccessToken(e);
  res.send(r);
});

app.get('/api/verify', async (req, res) => {
  const params: appendQuery.Query = {
    client_id: config.clientId,
    redirect_uri: redirect_uri,
    response_type: 'code',
    scope: scopes.join('+'),
  };

  const twitchOAuthUrl = appendQuery(
    'https://id.twitch.tv/oauth2/authorize',
    params,
    { encodeComponents: false }
  );
  res.redirect(302, twitchOAuthUrl);
});

http.createServer(app).listen(port);
console.log(`Serving page in http://localhost:${port}/api/verify`);
