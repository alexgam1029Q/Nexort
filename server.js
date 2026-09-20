const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 3000);

app.use(express.json());

const apiConfig = {
  appName: process.env.APP_NAME || 'NEXORT',
  rawgApiKey: process.env.RAWG_API_KEY || '',
  clientId: process.env.CLIENT_ID || '',
  clientSecret: process.env.CLIENT_SECRET || '',
  igdbAccessToken: process.env.IGDB_ACCESS_TOKEN || '',
  igdbTokenExpiresAt: Number(process.env.IGDB_TOKEN_EXPIRES_AT || 0),
};

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    app: apiConfig.appName,
    timestamp: new Date().toISOString(),
    config: {
      hasRawgKey: Boolean(apiConfig.rawgApiKey),
      hasClientId: Boolean(apiConfig.clientId),
      hasClientSecret: Boolean(apiConfig.clientSecret),
      hasIgdbToken: Boolean(apiConfig.igdbAccessToken),
      tokenExpiresAt: apiConfig.igdbTokenExpiresAt || null,
    },
  });
});

app.get('/api/config', (_req, res) => {
  res.json({
    appName: apiConfig.appName,
    apiBaseUrl: `http://127.0.0.1:${PORT}`,
    env: {
      hasRawgKey: Boolean(apiConfig.rawgApiKey),
      hasClientId: Boolean(apiConfig.clientId),
      hasClientSecret: Boolean(apiConfig.clientSecret),
      hasIgdbToken: Boolean(apiConfig.igdbAccessToken),
    },
  });
});

app.get('/api/games', async (req, res) => {
  try {
    const fallbackGames = [
      { id: 1, name: 'Cyberpunk 2077', background_image: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1n2g.jpg', source: 'local' },
      { id: 2, name: 'The Witcher 3', background_image: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1t3a.jpg', source: 'local' },
      { id: 3, name: 'Red Dead Redemption 2', background_image: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1qf3.jpg', source: 'local' },
    ];

    const provider = String(req.query.provider || 'rawg').toLowerCase();

    if (provider === 'rawg') {
      if (!apiConfig.rawgApiKey) {
        return res.json({ games: fallbackGames, warning: 'Falta RAWG_API_KEY. Se usa catálogo local temporal.' });
      }

      const rawgUrl = new URL('https://api.rawg.io/api/games');
      rawgUrl.searchParams.set('key', apiConfig.rawgApiKey);
      rawgUrl.searchParams.set('page_size', '20');
      rawgUrl.searchParams.set('ordering', '-released');

      const rawgResponse = await fetch(rawgUrl.toString());

      if (!rawgResponse.ok) {
        throw new Error(`Error consultando RAWG: ${rawgResponse.status}`);
      }

      const rawgData = await rawgResponse.json();
      const games = (rawgData.results || []).map((game) => ({
        id: game.id,
        name: game.name,
        background_image: game.background_image || '',
        website: game.website || '',
        source: 'rawg',
      }));

      return res.json({ games });
    }

    if (!apiConfig.clientId || !apiConfig.clientSecret) {
      return res.json({ games: fallbackGames, warning: 'Faltan CLIENT_ID o CLIENT_SECRET. Se usa catálogo local temporal.' });
    }

    const tokenResponse = await fetch('https://id.twitch.tv/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: apiConfig.clientId,
        client_secret: apiConfig.clientSecret,
        grant_type: 'client_credentials',
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error(`Error obteniendo token de IGDB: ${tokenResponse.status}`);
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    const gamesResponse = await fetch('https://api.igdb.com/v4/games', {
      method: 'POST',
      headers: {
        'Client-ID': apiConfig.clientId,
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: 'fields name, cover.url, first_release_date; limit 10;',
    });

    if (!gamesResponse.ok) {
      throw new Error(`Error consultando IGDB: ${gamesResponse.status}`);
    }

    const games = await gamesResponse.json();
    return res.json({ games });
  } catch (error) {
    console.error('Error en /api/games:', error);
    return res.status(500).json({
      error: 'No se pudo consultar la API externa.',
      fallback: [
        { id: 1, name: 'Cyberpunk 2077', background_image: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1n2g.jpg', source: 'local-fallback' },
        { id: 2, name: 'The Witcher 3', background_image: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1t3a.jpg', source: 'local-fallback' },
        { id: 3, name: 'Red Dead Redemption 2', background_image: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1qf3.jpg', source: 'local-fallback' },
      ],
    });
  }
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`NEXORT API running on http://127.0.0.1:${PORT}`);
  });
}

module.exports = app;
