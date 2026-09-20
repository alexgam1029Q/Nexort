const navItems = document.querySelectorAll('.nav-item');
const viewPanels = document.querySelectorAll('.view-panel');
const sidebar = document.getElementById('sidebar');
const toggleSidebarBtn = document.getElementById('toggleSidebar');
const toastStack = document.getElementById('toastStack');
const searchInput = document.querySelector('.search-shell input');
const apiBridges = [
  (url) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
  (url) => `https://api.cors.lol/?url=${encodeURIComponent(url)}`,
  (url) => `https://proxy.corsfix.com/?${url}`,
];

const fetchRemoteJson = async (url) => {
  for (const createBridgeUrl of apiBridges) {
    try {
      const response = await fetch(createBridgeUrl(url), { cache: 'no-store' });
      if (!response.ok) continue;
      const payload = JSON.parse(await response.text());
      if (payload && typeof payload === 'object') return payload;
    } catch (error) {
      console.info('Puente API no disponible:', error.message);
    }
  }

  throw new Error('No hay una API pública disponible en este momento');
};

/* const gameNames = `
Grand Theft Auto V
Cyberpunk 2077
Baldur's Gate 3
Red Dead Redemption 2
Elden Ring
Hogwarts Legacy
The Witcher 3: Wild Hunt
Minecraft: Java Edition
Forza Horizon 5
Forza Horizon 6
EA Sports FC 27
NBA 2K27
Call of Duty: Black Ops 7
Call of Duty: Modern Warfare III
Call of Duty: Black Ops 6
Battlefield 6
Battlefield V
Battlefield 2042
Assassin's Creed Shadows
Assassin's Creed Valhalla
Assassin's Creed Odyssey
Assassin's Creed Mirage
Far Cry 6
Far Cry 5
Resident Evil 4
Resident Evil Village
Resident Evil 2
Resident Evil 3
Resident Evil Requiem
Monster Hunter Wilds
Monster Hunter Rise
Dying Light 2
Dying Light: The Beast
Dead by Daylight
Rust
Valheim
Palworld
No Man's Sky
Subnautica
Subnautica 2
ARK: Survival Evolved
ARK: Survival Ascended
Project Zomboid
Sons of the Forest
The Forest
7 Days to Die
Terraria
Stardew Valley
RimWorld
Cities: Skylines II
Civilization VII
Total War: Warhammer III
Crusader Kings III
Europa Universalis IV
Mount & Blade II: Bannerlord
Manor Lords
Dune: Awakening
Path of Exile 2
Diablo IV
Final Fantasy VII Rebirth
Final Fantasy VII Remake Intergrade
Final Fantasy XVI
Dragon's Dogma 2
Black Myth: Wukong
Lies of P
Sekiro: Shadows Die Twice
Dark Souls III
Dark Souls Remastered
God of War
God of War Ragnarök
Marvel's Spider-Man Remastered
Marvel's Spider-Man 2
Horizon Zero Dawn Remastered
Horizon Forbidden West
Ghost of Tsushima Director's Cut
The Last of Us Part I
The Last of Us Part II Remastered
Star Wars Jedi: Survivor
Star Wars Jedi: Fallen Order
Starfield
Skyrim Special Edition
Fallout 4
Fallout: New Vegas
DOOM Eternal
DOOM: The Dark Ages
Metro Exodus
S.T.A.L.K.E.R. 2
Borderlands 4
Borderlands 3
Tiny Tina's Wonderlands
Helldivers 2
Ready or Not
Bodycam
Lethal Company
Phasmophobia
Euro Truck Simulator 2
Microsoft Flight Simulator 2024
Need for Speed Unbound
Need for Speed Heat
Need for Speed Payback
Need for Speed Rivals
Need for Speed Hot Pursuit Remastered
Need for Speed Most Wanted
Forza Motorsport
Assetto Corsa
Assetto Corsa Competizione
BeamNG.drive
CarX Drift Racing Online
Wreckfest
The Crew Motorfest
The Crew 2
F1 25
F1 24
DiRT Rally 2.0
SnowRunner
American Truck Simulator
Farming Simulator 25
House Flipper 2
PowerWash Simulator
Gas Station Simulator
PC Building Simulator 2
Satisfactory
Factorio
Oxygen Not Included
Astroneer
Grounded
Enshrouded
V Rising
Conan Exiles
DayZ
SCUM
The Long Dark
Green Hell
Raft
Stranded Deep
Don't Starve Together
Core Keeper
Abiotic Factor
Deep Rock Galactic
Risk of Rain 2
Roboquest
Gunfire Reborn
Remnant II
Remnant: From the Ashes
Warhammer 40,000: Space Marine 2
Warhammer 40,000: Darktide
Vermintide 2
Payday 3
Payday 2
Counter-Strike: Condition Zero
Left 4 Dead 2
Half-Life: Alyx
Half-Life 2
Portal 2
Portal
Garry's Mod
Human: Fall Flat
Gang Beasts
It Takes Two
A Way Out
Split Fiction
Sea of Thieves
LEGO Star Wars: The Skywalker Saga
Batman: Arkham Knight
Batman: Arkham City
Middle-earth: Shadow of Mordor
Middle-earth: Shadow of War
Mad Max
Days Gone
Death Stranding Director's Cut
Death Stranding 2
Control Ultimate Edition
Alan Wake 2
Alan Wake Remastered
Quantum Break
Hitman World of Assassination
Hitman 3
Hitman 2
Hitman
Mafia: Definitive Edition
Mafia II Definitive Edition
Mafia III
L.A. Noire
Sleeping Dogs: Definitive Edition
Watch Dogs
Watch Dogs 2
Watch Dogs: Legion
Just Cause 3
Just Cause 4
Saints Row
Saints Row IV
The Outer Worlds
The Outer Worlds 2
Star Wars Outlaws
Avatar: Frontiers of Pandora
Indiana Jones and the Great Circle
`.trim().split('\n'); */

let games = [];

/*
GTA V
Cyberpunk 2077
Red Dead Redemption 2
Far Cry 6
The Witcher 3
Assassin's Creed Valhalla
Call of Duty
Elden Ring
FIFA 24
Battlefield 2042
Spider-Man Remastered
God of War
Forza Horizon 5
Tom Clancy's Ghost Recon Breakpoint
Borderlands 3
Resident Evil Village
Resident Evil 4 Remake
Death Stranding
Control
Doom Eternal
Rocket League
NBA 2K24
Need for Speed Heat
Cities: Skylines
Prison Architect
Satisfactory
Valheim
Sons of the Forest
The Long Dark
Baldur's Gate 3
Disco Elysium
Divinity: Original Sin 2
Mass Effect Legendary Edition
Starfield
Skyrim
Fallout 4
Fallout New Vegas
Dragon Age: Inquisition
Witcher 2
Dark Souls 3
Sekiro
Bloodborne
Shadow of the Tomb Raider
Rise of the Tomb Raider
Assassin's Creed Odyssey
Assassin's Creed Origins
Watch Dogs Legion
Watch Dogs 2
Prey
Dishonored 2
Hellblade: Senua's Sacrifice
Alan Wake 2
The Last of Us Part I
Uncharted 4
Horizon Forbidden West
Final Fantasy XVI
Monster Hunter Rise
Street Fighter 6
Tekken 8
EA Sports FC 24
WWE 2K24
Need for Speed Unbound
SnowRunner
Farming Simulator 22
House Flipper 2
Bus Simulator 2024
The Sims 4
Cooking Simulator
Planet Coaster
Jurassic World Evolution 2
Two Point Campus
The Escapists
Dead Space
Metro Exodus
Metro Last Light
Quake II
Doom 2016
Wolfenstein: Youngblood
The Evil Within 2
Good of War Ragnarök
Star Wars Jedi: Survivor
Star Wars Jedi: Fallen Order
NBA 2K25
Far Cry 5
Assassin's Creed Syndicate
Assassin's Creed Unity
Ghost of Tsushima
Ghost of Tsushima Director's Cut
Marvel's Spider-Man
The Last of Us Part II
Days Gone
Horizon Zero Dawn
Gran Turismo 7
F1 23
F1 24
Dirt 5
Dirt Rally 2.0
WRC Generations
Outriders
The Division 2
Tom Clancy's The Division
Ghost Recon Wildlands
Crysis 3
Crysis Remastered
Battlefield V
Battlefield 1
Remnant 2
Remnant: From the Ashes
Evil West
Kingdom Come: Deliverance
Kingdom Come: Deliverance 2
Total War: Warhammer 3
Total War: Rome II
Civilization VI
Civilization V
XCOM 2
XCOM: Enemy Unknown
Torchlight III
Diablo IV
Diablo III
Path of Exile 2
Path of Exile
Last Epoch
No Man's Sky
Elite Dangerous
Star Citizen
Subnautica
Subnautica: Below Zero
Atlas
The Ascent
Biomutant
ELEX II
Outward
Dying Light 2
Dying Light
Dead Island 2
Atomic Heart
Sniper Elite 5
Sniper Elite 4
Hitman 3
Hitman 2
The Medium
Amnesia: The Bunker
Amnesia: Rebirth
Little Nightmares II
Little Nightmares I
A Plague Tale: Innocence
A Plague Tale: Requiem
Prince of Persia: The Lost Crown
Prince of Persia: Warrior Within
Kingdom Hearts 3
Final Fantasy VII Remake
Final Fantasy XV
Dragon Ball FighterZ
Persona 5 Royal
Persona 4 Golden
Saints Row
Redfall
Back 4 Blood
Dead Alliance
Deep Rock Galactic
The Elder Scrolls Online
Dragon's Dogma 2
ELEX
Mad Max
Metal Gear Solid V
NieR: Automata
Nioh 2
Nioh
Kena: Bridge of Spirits
Lords of the Fallen
Hellpoint
Human Fall Flat
PowerWash Simulator
Gas Station Simulator
My Summer Car
Satisfactory
The Planet Crafter
Extraction
Frostpunk 2
Frostpunk
Surviving Mars
Planetary Annihilation
*/

const readStoredSet = (key) => {
  try {
    return new Set(JSON.parse(localStorage.getItem(key) || '[]'));
  } catch {
    return new Set();
  }
};

const saveStoredSet = (key, values) => {
  localStorage.setItem(key, JSON.stringify([...values]));
};

const state = {
  activeView: 'home',
  downloads: new Map(),
  favorites: readStoredSet('nexort-favorites'),
  library: readStoredSet('nexort-library'),
};

const profileNameInput = document.getElementById('profileName');
const saveProfileButton = document.getElementById('saveProfile');
const profileHeading = document.getElementById('profileHeading');
const profileStatus = document.getElementById('profileStatus');
const detailsContent = document.getElementById('detailsContent');
const libraryFilter = document.getElementById('libraryFilter');
const libraryEmpty = document.getElementById('libraryEmpty');
const exploreEmpty = document.getElementById('exploreEmpty');
const profileStats = document.getElementById('profileStats');
const coverCache = (() => {
  try {
    return JSON.parse(localStorage.getItem('nexort-cover-cache-v2') || '{}');
  } catch {
    return {};
  }
})();

const saveCoverCache = () => localStorage.setItem('nexort-cover-cache-v2', JSON.stringify(coverCache));

const parseLinksMarkdown = (markdown) => {
  const gamesFromLinks = [];
  const linkPattern = /^##\s+(.+?)\s*\r?\n-\s+(\S+)/gm;
  let match;

  while ((match = linkPattern.exec(markdown)) !== null) {
    const name = match[1].trim();
    if (name.startsWith('*')) continue;
    gamesFromLinks.push({ name, url: match[2] === 'PENDIENTE' ? '' : match[2] });
  }

  return [...new Map(gamesFromLinks.map((game) => [game.name, game])).values()];
};

const parseSourceJson = (payload) => {
  const entries = Array.isArray(payload)
    ? payload
    : payload.games || payload.items || payload.data || payload.entries || [];

  return entries.map((entry) => {
    const links = Array.isArray(entry.links)
      ? entry.links
      : Array.isArray(entry.uris) ? entry.uris : [];
    const firstLink = links[0];
    const url = entry.url || entry.link || entry.download || entry.download_url || entry.downloadUrl
      || (typeof firstLink === 'string' ? firstLink : firstLink?.url);

    return {
      name: entry.name || entry.title || entry.game || entry.game_name,
      url,
      cover: entry.cover || entry.cover_url || entry.image || entry.thumbnail || entry.poster,
      updated: entry.updated === true || entry.update === true || Boolean(
        entry.updated_at || entry.updatedAt || entry.last_updated || entry.lastUpdated
      ),
    };
  }).filter((game) => game.name);
};

const normalizeGameName = (name) => name
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, ' ')
  .trim();

const selectedGameTitles = [
  '7 Days to Die', 'Among Us', 'ARK: Survival Ascended', 'ARK: Survival Evolved',
  "Assassin's Creed 2", "Assassin's Creed Mirage", "Assassin's Creed Shadows",
  "Assassin's Creed Valhalla", "Assassin's Creed III Remastered", "Assassin's Creed IV Black Flag",
  "Assassin's Creed Odyssey", "Assassin's Creed Origins", "Assassin's Creed Rogue",
  "Assassin's Creed Syndicate", "Assassin's Creed Unity", "Assassin's Creed Director's Cut",
  'Avatar: Frontiers of Pandora', 'Battlefield V', 'Black Myth: Wukong',
  'Call of Duty: Black Ops 6', 'Call of Duty: Black Ops II', 'Call of Duty: Black Ops III',
  'Call of Duty: Modern Warfare', 'Call of Duty: Modern Warfare 3', 'Cities: Skylines',
  'Cities: Skylines II', 'Cyberpunk 2077', 'DARK SOULS: REMASTERED', 'Days Gone', 'DayZ',
  'Dead by Daylight', 'Dead Space', 'DOOM', 'DOOM Eternal', 'DOOM: The Dark Ages',
  'DRAGON BALL: Sparking! ZERO', 'ELDEN RING', 'Enshrouded', 'Euro Truck Simulator 2',
  'Fallout 4', 'Far Cry 3', 'Far Cry 4', 'Far Cry 5', 'Far Cry 6', 'Farming Simulator 25',
  "Five Nights at Freddy's: Secret of the Mimic", "Five Nights at Freddy's: Security Breach",
  'Forza Horizon 4', 'Forza Horizon 5', 'Forza Horizon 6', 'Gears 5', 'God of War',
  'God of War Ragnarök', 'Gothic 1 Remake', 'Gothic II: Gold Edition', 'Gothic 3',
  'Grand Theft Auto III - The Definitive Edition', 'Grand Theft Auto IV: The Complete Edition',
  'Grand Theft Auto V', 'Grand Theft Auto: San Andreas - The Definitive Edition',
  'Grand Theft Auto: Vice City - The Definitive Edition', 'Green Hell', 'Halo Infinite',
  'Halo: The Master Chief Collection', 'Hollow Knight', 'Hollow Knight: Silksong', 'Injustice 2',
  "James Cameron's Avatar: The Game", 'Mortal Kombat 1', 'Mortal Kombat X', 'Mortal Kombat 11',
  'Metro Exodus', 'Metro 2033 Redux', 'Metro 2033', 'Metro: Last Light Redux', 'Metro Awakening',
  'Need for Speed: Hot Pursuit', 'Need for Speed: Shift', 'Need for Speed: Undercover',
  'Need for Speed', 'Need for Speed Heat', 'Need for Speed Hot Pursuit Remastered',
  'Need for Speed Most Wanted', 'Need for Speed Payback', 'Need for Speed Rivals',
  'Need for Speed Unbound', 'Night of the Dead', "No Man's Sky", 'Phasmophobia', 'Prince of Persia',
  'Project Zomboid', 'Raft', 'Ready or Not', 'Red Dead Redemption', 'Red Dead Redemption 2',
  'Resident Evil 4', 'Resident Evil 5', 'Resident Evil 6', 'Resident Evil Requiem', 'RoadCraft',
  'Rust', 'SCUM', 'Shadow of the Tomb Raider: Definitive Edition', 'Solo Leveling: ARISE OVERDRIVE',
  'Sons Of The Forest', 'Stranded Deep', 'Subnautica', 'Subnautica 2', 'Subnautica: Below Zero',
  'Subsistence', 'The Forest', 'The Last of Us Part I', 'The Last of Us Part II Remastered',
  'Tomb Raider Game of the Year', 'Valheim'
];

const selectedGameNames = new Set(selectedGameTitles.map(normalizeGameName));

const getLibraryGames = () => {
  const libraryGames = games.filter((game) => state.library.has(game.name));
  if (libraryFilter?.value === 'favorites') return libraryGames.filter((game) => state.favorites.has(game.name));
  if (libraryFilter?.value === 'updates') return libraryGames.filter((game) => game.updated);
  return libraryGames;
};

const applyGames = (nextGames, sourceName) => {
  const catalogPlaceholders = selectedGameTitles.map((name) => ({ name, url: '' }));
  const filteredGames = [...nextGames, ...catalogPlaceholders]
    .filter((game) => selectedGameNames.has(normalizeGameName(game.name)));
  games = [...new Map(filteredGames.map((game) => [normalizeGameName(game.name), game])).values()]
    .sort((first, second) => first.name.localeCompare(second.name, 'es', { sensitivity: 'base' }));
  renderGameCatalog('gameCatalog');
  renderExploreCatalog();
  renderGameCatalog('gameCatalogLibrary', getLibraryGames());
  renderGameCatalog('gameCatalogUpdates', games.filter((game) => game.updated));
  renderFavoritesCatalog();
  updateCatalogEmptyStates();
  updateProfileStats();
  updateSearchVisibility();
  void sourceName;
  loadGameCovers();
};

const loadGamesFromSource = async (sourceUrl) => {
  const payload = /^https?:\/\//i.test(sourceUrl)
    ? await fetchRemoteJson(sourceUrl)
    : await (await fetch(sourceUrl, { cache: 'no-store' })).json();
  const nextGames = parseSourceJson(payload);
  if (!nextGames.length) throw new Error('No se encontraron juegos compatibles');
  applyGames(nextGames, sourceUrl);
};

const loadGamesFromLinks = async () => {
  try {
    const response = await fetch('links.md', { cache: 'no-store' });
    if (!response.ok) throw new Error(`No se pudo cargar links.md (${response.status})`);

    const gamesFromLinks = parseLinksMarkdown(await response.text());
    if (!gamesFromLinks.length) throw new Error('links.md no contiene juegos');

    const linkedNames = new Set(gamesFromLinks.map((game) => normalizeGameName(game.name)));
    const visibleGames = selectedGameTitles
      .filter((name) => !linkedNames.has(normalizeGameName(name)))
      .map((name) => ({ name, url: '' }));

    applyGames([...gamesFromLinks, ...visibleGames], 'catálogo local');
  } catch (error) {
      console.error('No se pudo cargar links.md:', error.message);
  }
};

const renderGameCatalog = (containerId, catalogGames = games) => {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = catalogGames.map((game) => `
    <div class="game-row">
      <div class="game-cover${game.cover ? ' loading' : ''}" aria-label="Portada de ${game.name}">
        ${game.cover
          ? `<img src="${game.cover}" crossorigin="anonymous" data-fallback="${game.fallbackCover || ''}" alt="Portada de ${game.name}" loading="lazy">`
          : `<span>${game.name}</span>`}
      </div>
      <span class="game-name">${game.name}</span>
        <button class="secondary-button icon-button library-toggle" type="button" aria-label="${state.library.has(game.name) ? 'Quitar de biblioteca' : 'Agregar a biblioteca'}" title="${state.library.has(game.name) ? 'Quitar de biblioteca' : 'Agregar a biblioteca'}">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 3.5A2.5 2.5 0 0 1 7.5 1H20v18H7.5A2.5 2.5 0 0 0 5 21.5v-18ZM7.5 3a.5.5 0 0 0-.5.5v12.1c.16-.06.33-.1.5-.1H18V3H7.5Z"/></svg>
        </button>
        <button class="secondary-button icon-button favorite-toggle" type="button" aria-label="${state.favorites.has(game.name) ? 'Quitar favorito' : 'Agregar a favoritos'}" title="${state.favorites.has(game.name) ? 'Quitar favorito' : 'Agregar a favoritos'}">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 21-1.45-1.32C5.4 15.36 2 12.28 2 8.5A4.5 4.5 0 0 1 6.5 4c1.74 0 3.41.81 4.5 2.09A6.05 6.05 0 0 1 15.5 4 4.5 4.5 0 0 1 20 8.5c0 3.78-3.4 6.86-8.55 11.18L12 21Z"/></svg>
        </button>
    </div>
  `).join('');

  container.querySelectorAll('img[data-fallback]').forEach((image) => {
    image.addEventListener('error', () => {
      const fallback = image.dataset.fallback;
      if (fallback && image.src !== fallback) {
        image.src = fallback;
        image.classList.remove('game-logo');
        return;
      }

      const cover = image.closest('.game-cover');
      image.remove();
      if (cover) {
        const fallbackLabel = document.createElement('span');
        fallbackLabel.textContent = cover.getAttribute('aria-label')?.replace('Portada de ', '') || 'Juego';
        cover.appendChild(fallbackLabel);
      }
      cover?.classList.remove('loading');
    }, { once: true });
  });

  container.querySelectorAll('.game-cover img').forEach((image) => {
    image.addEventListener('load', () => image.closest('.game-cover')?.classList.remove('loading'), { once: true });
  });
};

const renderExploreCatalog = () => {
  const query = searchInput.value.trim().toLowerCase();
  const matches = query ? games.filter((game) => game.name.toLowerCase().includes(query)) : [];
  renderGameCatalog('gameCatalogExplore', matches);
  if (exploreEmpty) {
    exploreEmpty.style.display = query && matches.length ? 'none' : '';
    if (query && !matches.length) {
      exploreEmpty.querySelector('h2').textContent = 'Sin resultados';
      exploreEmpty.querySelector('p').textContent = 'No encontramos juegos con ese nombre.';
    } else {
      exploreEmpty.querySelector('h2').textContent = 'Busca un juego';
      exploreEmpty.querySelector('p').textContent = 'Escribe en el buscador para encontrar títulos del catálogo.';
    }
  }
};

const renderFavoritesCatalog = () => {
  const favoriteGames = games.filter((game) => state.favorites.has(game.name));
  renderGameCatalog('gameCatalogFavorites', favoriteGames);

  const emptyState = document.getElementById('favoritesEmpty');
  if (emptyState) emptyState.style.display = favoriteGames.length ? 'none' : '';
};

const updateCatalogEmptyStates = () => {
  const updatesEmpty = document.getElementById('updatesEmpty');
  if (updatesEmpty) updatesEmpty.style.display = games.some((game) => game.updated) ? 'none' : '';
  if (libraryEmpty) libraryEmpty.style.display = getLibraryGames().length ? 'none' : '';
};

const updateProfileStats = () => {
  if (!profileStats) return;
  profileStats.innerHTML = `
    <div><strong>${state.library.size}</strong><span>Biblioteca</span></div>
    <div><strong>${state.favorites.size}</strong><span>Favoritos</span></div>
    <div><strong>${games.filter((game) => game.updated).length}</strong><span>Actualizaciones</span></div>
  `;
};

const showGameDetails = (game) => {
  if (!detailsContent || !game) return;

  detailsContent.innerHTML = `
    <span class="eyebrow">JUEGO</span>
    <h2>${game.name}</h2>
    <p>${game.updated ? 'Tiene una actualización registrada por la fuente.' : 'Disponible en el catálogo de NEXORT.'}</p>
    <div class="source-controls">
      <button class="primary-button detail-library-toggle" type="button" data-game="${game.name}">${state.library.has(game.name) ? 'Quitar de biblioteca' : 'Agregar a biblioteca'}</button>
      <button class="secondary-button detail-favorite-toggle" type="button" data-game="${game.name}">${state.favorites.has(game.name) ? 'Quitar favorito' : 'Agregar a favoritos'}</button>
    </div>
  `;
};

const loadGameCovers = async () => {
  let nextGame = 0;
  const assignedCoverIds = new Set();
  const workers = Array.from({ length: 6 }, async () => {
    while (nextGame < games.length) {
      const game = games[nextGame];
      nextGame += 1;
      const cacheKey = normalizeGameName(game.name);
      const cachedCover = coverCache[cacheKey];
      const cachedAppId = typeof cachedCover === 'object' ? cachedCover.id : cachedCover;
      const cachedFallback = typeof cachedCover === 'object' ? cachedCover.fallback : '';

      if (cachedAppId && !assignedCoverIds.has(String(cachedAppId))) {
        assignedCoverIds.add(String(cachedAppId));
          game.cover = `https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${cachedAppId}/library_600x900_2x.jpg`;
          game.fallbackCover = cachedFallback || `https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${cachedAppId}/capsule_231x87.jpg`;
        renderGameCatalog('gameCatalog');
        renderExploreCatalog();
        renderGameCatalog('gameCatalogLibrary', getLibraryGames());
        continue;
      }

      try {
        const steamUrl = `https://steamcommunity.com/actions/SearchApps/${encodeURIComponent(game.name)}`;
        const result = await fetchRemoteJson(steamUrl);
        const steamItems = Array.isArray(result)
          ? result.map((item) => ({
            id: item.appid,
            name: item.name,
            tiny_image: item.icon || item.logo,
          }))
          : result.items || [];
        const normalizeTitle = normalizeGameName;
        const normalizedName = normalizeTitle(game.name);
        const additionalContent = /dlc|soundtrack|redkit|demo|test server|playtest|texture pack|expansion|editor|tool|mod|ost|beta/i;
        const items = steamItems.filter((item) => item.id && item.name && !additionalContent.test(item.name));
        const exactMatches = items.filter((item) => normalizeTitle(item.name) === normalizedName);
        const titledMatches = items.filter((item) => normalizeTitle(item.name).startsWith(normalizedName));
        const match = [...exactMatches, ...titledMatches]
          .find((item) => !assignedCoverIds.has(String(item.id)));
        if (match?.id) {
          assignedCoverIds.add(String(match.id));
          coverCache[cacheKey] = { id: match.id, fallback: match.tiny_image || '' };
          saveCoverCache();
          game.cover = `https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${match.id}/library_600x900_2x.jpg`;
          game.fallbackCover = `https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${match.id}/capsule_231x87.jpg`;
        }
      } catch (error) {
        console.info(`No se encontró portada para ${game.name}:`, error.message);
      }

      renderGameCatalog('gameCatalog');
      renderExploreCatalog();
      renderGameCatalog('gameCatalogLibrary', getLibraryGames());
      renderGameCatalog('gameCatalogUpdates', games.filter((item) => item.updated));
      renderFavoritesCatalog();
      updateCatalogEmptyStates();
      updateProfileStats();
    }
  });

  await Promise.all(workers);
};

const clearDemoData = () => {
  state.downloads.clear();
  renderGameCatalog('gameCatalog');
  renderExploreCatalog();
  renderGameCatalog('gameCatalogLibrary', getLibraryGames());
  renderGameCatalog('gameCatalogUpdates', games.filter((game) => game.updated));
  renderFavoritesCatalog();
  updateCatalogEmptyStates();
  updateProfileStats();
};

const openView = (viewName) => {
  state.activeView = viewName;

  if (viewName === 'explore') renderExploreCatalog();
  if (viewName === 'library') {
    renderGameCatalog('gameCatalogLibrary', getLibraryGames());
  }
  if (viewName === 'updates') {
    renderGameCatalog('gameCatalogUpdates', games.filter((game) => game.updated));
    updateCatalogEmptyStates();
  }
  if (viewName === 'favorites') renderFavoritesCatalog();

  navItems.forEach((item) => {
    item.classList.toggle('active', item.dataset.view === viewName);
  });

  viewPanels.forEach((panel) => {
    panel.classList.toggle('active', panel.dataset.view === viewName);
  });
};

const showToast = (title, message, type = 'info') => {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span class="indicator"></span>
    <div>
      <strong>${title}</strong>
      <span>${message}</span>
    </div>
  `;

  toastStack.appendChild(toast);
  setTimeout(() => toast.remove(), 2800);
};

const findGameTitle = (element) => {
  if (!element) return 'Juego';

  const gameCard = element.closest('.game-row, .game-card, .catalog-card, .game-mini-card, .download-item, .library-card, .favorite-item, .update-item, .detail-content');
  if (!gameCard) return 'Juego';

  const heading = gameCard.querySelector('h3, h2');
  if (heading) return heading.textContent.trim();
  const rowName = gameCard.querySelector('.game-name');
  return rowName ? rowName.textContent.trim() : 'Juego';
};

const updateSearchVisibility = () => {
  const query = searchInput.value.trim().toLowerCase();

  document.querySelectorAll('.game-row, .game-card, .catalog-card, .game-mini-card, .library-card, .favorite-item, .update-item').forEach((item) => {
    const text = item.textContent.toLowerCase();
    const isMatch = !query || text.includes(query);
    item.style.display = isMatch ? '' : 'none';
  });
};

const updateDownloadsEmpty = () => {
  const emptyState = document.getElementById('downloadsEmpty');
  const downloadList = document.querySelector('.downloads-list');
  if (!emptyState || !downloadList) return;

  emptyState.style.display = downloadList.children.length ? 'none' : '';
};

const toggleSidebar = () => {
  sidebar.classList.toggle('collapsed');
  const collapsed = sidebar.classList.contains('collapsed');
  toggleSidebarBtn.textContent = collapsed ? 'Expandir' : 'Minimizar';
};

const toggleSelectionGroup = (button, groupSelector) => {
  const group = document.querySelectorAll(groupSelector);
  group.forEach((item) => item.classList.toggle('active', item === button));
};

const syncDownloadProgress = () => {
  const downloadList = document.querySelector('.downloads-list');
  if (!downloadList) return;

  downloadList.querySelectorAll('.download-item').forEach((item) => {
    const title = findGameTitle(item);
    const percent = state.downloads.get(title) ?? 0;
    const valueEl = item.querySelector('.download-top span');
    const barEl = item.querySelector('.progress span');
    const statsEl = item.querySelector('.download-stats');

    if (valueEl) valueEl.textContent = `${percent}%`;
    if (barEl) barEl.style.width = `${percent}%`;
    if (statsEl) {
      const text = percent >= 100
        ? 'Listo para jugar'
        : `${percent >= 50 ? 'Descargando' : 'Preparando'} · ${percent}% completado`;
      statsEl.innerHTML = `<span>${text}</span>`;
    }
  });
};

const startDownloadCycle = (title, increment, delay, successMessage) => {
  let progress = state.downloads.get(title) ?? 0;

  const timer = setInterval(() => {
    progress = Math.min(progress + increment, 100);
    state.downloads.set(title, progress);
    syncDownloadProgress();

    if (progress >= 100) {
      clearInterval(timer);
      showToast(successMessage.title, successMessage.message, successMessage.type || 'success');
    }
  }, delay);
};

const installGame = (title) => {
  const downloadList = document.querySelector('.downloads-list');
  if (!downloadList) return;

  const existing = [...downloadList.querySelectorAll('.download-item')].find((item) => findGameTitle(item) === title);

  if (existing) {
    state.downloads.set(title, 0);
    syncDownloadProgress();
    startDownloadCycle(title, 8, 300, {
      title: 'Descarga completada',
      message: `${title} está listo para jugar.`,
      type: 'success',
    });
    return;
  }

  const card = document.createElement('article');
  card.className = 'download-item';
  card.innerHTML = `
    <div class="download-thumb thumb-one"></div>
    <div class="download-details">
      <div class="download-top">
        <h3>${title}</h3>
        <span>0%</span>
      </div>
      <div class="download-stats">
        <span>Iniciando descarga</span>
      </div>
      <div class="progress"><span style="width: 0%"></span></div>
    </div>
    <div class="download-actions">
      <button>Pausar</button>
      <button>Cancelar</button>
      <button class="priority">Prioridad</button>
    </div>
  `;

  downloadList.appendChild(card);
  state.downloads.set(title, 0);
  updateDownloadsEmpty();
  syncDownloadProgress();

  startDownloadCycle(title, 12, 400, {
    title: 'Instalación finalizada',
    message: `${title} ya está disponible en tu biblioteca.`,
    type: 'success',
  });
};

const handlePrimaryAction = (button) => {
  const title = findGameTitle(button);
  const actionText = button.textContent.trim().toLowerCase();

  if (actionText.includes('descargar') || actionText.includes('instalar') || actionText.includes('gratis')) {
    showToast('Descarga iniciada', `${title} está preparándose en NEXORT.`, 'info');
    installGame(title);
    return;
  }

  if (actionText.includes('jugar')) {
    showToast('Abriendo juego', `${title} se está iniciando.`, 'success');
    return;
  }

  if (actionText.includes('actualizar')) {
    showToast('Actualización disponible', `${title} tiene una actualización nueva.`, 'warning');
  }
};

navItems.forEach((button) => {
  button.addEventListener('click', () => openView(button.dataset.view));
});

toggleSidebarBtn.addEventListener('click', toggleSidebar);

const savedProfileName = localStorage.getItem('nexort-profile-name') || '';
if (profileNameInput) profileNameInput.value = savedProfileName;
if (profileHeading) profileHeading.textContent = savedProfileName || 'Tu perfil';

saveProfileButton?.addEventListener('click', () => {
  const name = profileNameInput.value.trim();
  if (!name) return;

  localStorage.setItem('nexort-profile-name', name);
  if (profileHeading) profileHeading.textContent = name;
  if (profileStatus) profileStatus.textContent = 'Perfil guardado correctamente.';
  showToast('Perfil actualizado', `Bienvenido, ${name}.`, 'success');
});

searchInput.addEventListener('input', () => {
  renderExploreCatalog();
  updateSearchVisibility();
});

libraryFilter?.addEventListener('change', () => {
  renderGameCatalog('gameCatalogLibrary', getLibraryGames());
  updateCatalogEmptyStates();
});

document.querySelectorAll('.filter-toggle').forEach((button) => {
  button.addEventListener('click', () => {
    button.classList.toggle('active');
  });
});

document.querySelectorAll('.view-toggle').forEach((button) => {
  button.addEventListener('click', () => {
    toggleSelectionGroup(button, '.view-toggle');
  });
});

document.addEventListener('click', (event) => {
  const downloadLink = event.target.closest('a.download-link');
  if (downloadLink) {
    const title = downloadLink.dataset.game;
    showToast('Descarga iniciada', `${title} se añadió a Descargas.`, 'info');
    installGame(title);
    return;
  }

  const button = event.target.closest('button');
  if (!button) return;

  if (button.dataset.view) {
    openView(button.dataset.view);
  }

  if (button.classList.contains('detail-library-toggle') || button.classList.contains('detail-favorite-toggle')) {
    const game = games.find((item) => item.name === button.dataset.game);
    if (!game) return;

    if (button.classList.contains('detail-library-toggle')) {
      if (state.library.has(game.name)) state.library.delete(game.name);
      else state.library.add(game.name);
      saveStoredSet('nexort-library', state.library);
      renderGameCatalog('gameCatalogLibrary', getLibraryGames());
    } else {
      if (state.favorites.has(game.name)) state.favorites.delete(game.name);
      else state.favorites.add(game.name);
      saveStoredSet('nexort-favorites', state.favorites);
      renderFavoritesCatalog();
    }

    updateCatalogEmptyStates();
    updateProfileStats();
    showGameDetails(game);
    return;
  }

  const row = event.target.closest('.game-row');
  if (row && !event.target.closest('button')) {
    const game = games.find((item) => item.name === row.querySelector('.game-name')?.textContent.trim());
    if (game) {
      showGameDetails(game);
      openView('details');
    }
    return;
  }

  if (button.classList.contains('trigger-download') || button.classList.contains('primary-button') || button.classList.contains('small-primary')) {
    handlePrimaryAction(button);
  }

  if (button.textContent.trim().toLowerCase().includes('ver detalles')) {
    openView('details');
  }

  if (button.classList.contains('favorite-toggle')) {
    const game = findGameTitle(button);
    if (state.favorites.has(game)) {
      state.favorites.delete(game);
      showToast('Favorito removido', `${game} ya no está en favoritos.`, 'warning');
    } else {
      state.favorites.add(game);
      showToast('Favorito agregado', `${game} quedó guardado en favoritos.`, 'success');
    }
    saveStoredSet('nexort-favorites', state.favorites);
    renderFavoritesCatalog();
    updateProfileStats();
  }

  if (button.classList.contains('library-toggle') && !state.library.has(findGameTitle(button))) {
    const game = findGameTitle(button);
    state.library.add(game);
    saveStoredSet('nexort-library', state.library);
    renderGameCatalog('gameCatalogLibrary', getLibraryGames());
    renderGameCatalog('gameCatalog', games);
    renderExploreCatalog();
    updateCatalogEmptyStates();
    updateProfileStats();
    showToast('Biblioteca actualizada', `${game} se añadió a tu biblioteca.`, 'info');
  }

  if (button.classList.contains('library-toggle') && state.library.has(findGameTitle(button))) {
    const game = findGameTitle(button);
    state.library.delete(game);
    saveStoredSet('nexort-library', state.library);
    renderGameCatalog('gameCatalogLibrary', getLibraryGames());
    renderGameCatalog('gameCatalog', games);
    renderExploreCatalog();
    updateCatalogEmptyStates();
    updateProfileStats();
    showToast('Biblioteca actualizada', `${game} se quitó de tu biblioteca.`, 'warning');
  }

  if (button.textContent.trim().toLowerCase().includes('pausar todas')) {
    showToast('Descargas pausadas', 'Todas las descargas quedaron en pausa.', 'warning');
  }

  if (button.closest('.favorite-item') && button.textContent.trim().toLowerCase().includes('ver')) {
    const game = findGameTitle(button);
    showToast('Abriendo juego', `${game} está listo para revisar.`);
  }

  if (button.textContent.trim().toLowerCase().includes('reanudar') || button.textContent.trim().toLowerCase().includes('pausar')) {
    const game = findGameTitle(button);
    showToast('Estado actualizado', `${game} cambió de estado correctamente.`, 'info');
  }

  if (button.textContent.trim().toLowerCase().includes('cancelar')) {
    const game = findGameTitle(button);
    state.downloads.delete(game);
    showToast('Descarga cancelada', `${game} se eliminó de la cola.`, 'warning');
    const item = button.closest('.download-item');
    if (item) item.remove();
    updateDownloadsEmpty();
  }
});

clearDemoData();
loadGamesFromLinks();
