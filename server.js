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

app.get('/api/discover', async (req, res) => {
  const limit = Math.min(Math.max(Number(req.query.limit) || 8, 1), 20);

  if (!apiConfig.rawgApiKey) {
    return res.json({ games: [], warning: 'Falta RAWG_API_KEY para cargar novedades.' });
  }

  try {
    const today = new Date();
    const sixMonthsFromNow = new Date(today);
    sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);
    const isTrendsMode = String(req.query.mode || '') === 'trends';
    const fetchGames = async (ordering, startDate, endDate, pageSize) => {
      const rawgUrl = new URL('https://api.rawg.io/api/games');
      rawgUrl.searchParams.set('key', apiConfig.rawgApiKey);
      rawgUrl.searchParams.set('page_size', String(pageSize));
      rawgUrl.searchParams.set('ordering', ordering);
      rawgUrl.searchParams.set('dates', `${startDate.toISOString().slice(0, 10)},${endDate.toISOString().slice(0, 10)}`);
      const rawgResponse = await fetch(rawgUrl.toString());
      if (!rawgResponse.ok) throw new Error(`Error consultando juegos: ${rawgResponse.status}`);
      const rawgData = await rawgResponse.json();
      return rawgData.results || [];
    };
    const upcomingGames = await fetchGames('released', today, sixMonthsFromNow, isTrendsMode ? Math.ceil(limit / 2) : limit);
    const popularStart = new Date(today);
    popularStart.setFullYear(popularStart.getFullYear() - 5);
    const popularGames = isTrendsMode
      ? await fetchGames('-rating', popularStart, sixMonthsFromNow, Math.floor(limit / 2))
      : [];
    const games = [...new Map([...upcomingGames, ...popularGames].map((game) => [game.id, game])).values()]
      .slice(0, limit)
      .map((game) => ({
      id: game.id,
      name: game.name,
      background_image: game.background_image || '',
      background_image_additional: game.background_image_additional || '',
      released: game.released || '',
      rating: Number(game.rating) || 0,
      ratings_count: Number(game.ratings_count) || 0,
      genres: Array.isArray(game.genres) ? game.genres.map((genre) => genre.name).filter(Boolean) : [],
      platforms: Array.isArray(game.platforms) ? game.platforms.map((item) => item.platform?.name).filter(Boolean) : [],
      source: 'rawg',
      }));

    const gamesWithVideos = await Promise.all(games.map(async (game) => {
      try {
        const moviesUrl = new URL(`https://api.rawg.io/api/games/${game.id}/movies`);
        moviesUrl.searchParams.set('key', apiConfig.rawgApiKey);
        const moviesResponse = await fetch(moviesUrl.toString());
        if (!moviesResponse.ok) return game;
        const moviesData = await moviesResponse.json();
        const movie = moviesData.results?.[0];
        return movie?.data?.max || movie?.data?.['480']
          ? { ...game, video: movie.data.max || movie.data['480'], videoPreview: movie.preview || '' }
          : game;
      } catch {
        return game;
      }
    }));

    return res.json({ games: gamesWithVideos });
  } catch (error) {
    console.error('Error en /api/discover:', error);
    return res.status(502).json({ games: [], error: 'No se pudieron cargar las novedades.' });
  }
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`NEXORT API running on http://127.0.0.1:${PORT}`);
  });
}

module.exports = app;
