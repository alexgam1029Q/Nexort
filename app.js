const navItems = document.querySelectorAll('.nav-item');
const viewPanels = document.querySelectorAll('.view-panel');
const sidebar = document.getElementById('sidebar');
const toggleSidebarBtn = document.getElementById('toggleSidebar');
const toastStack = document.getElementById('toastStack');
const searchInput = document.querySelector('.search-shell input');
const genreFilter = document.getElementById('genreFilter');
// Agrega tu clave real de RAWG aquí antes de usar la API en producción.
// Puedes conseguir una gratuita en https://rawg.io/apidocs
const RAWG_CREDENTIALS = {
  apiKey: 'c8b54807a02248b1802a5383fd713919',
};

const API_CONFIG = {
  provider: 'rawg',
  baseUrl: 'http://127.0.0.1:3000/api',
  apiKey: RAWG_CREDENTIALS.apiKey,
  useFallback: true,
  allowLocalProxy: false,
};

let localApiAvailable = false;

const checkLocalApiAvailability = async () => {
  if (!API_CONFIG.allowLocalProxy) return false;
  if (localApiAvailable !== null) return localApiAvailable;

  try {
    const response = await fetch(`${API_CONFIG.baseUrl}/health`, { cache: 'no-store' });
    localApiAvailable = response.ok;
    return localApiAvailable;
  } catch {
    localApiAvailable = false;
    return false;
  }
};

const LOCAL_LINKS_MARKDOWN = '';
const PUBLIC_API_BASE_URL = '';

const RAWG_TITLE_ALIASES = {
  'Among Us': ['Among Us'],
  'ARK: Survival Ascended': ['ARK: Survival Ascended', 'Ark: Survival Ascended'],
  'ARK: Survival Evolved': ['ARK: Survival Evolved', 'Ark: Survival Evolved'],
  'Assassin\'s Creed II': ['Assassin\'s Creed II', 'Assassin\'s Creed 2'],
  "Assassin's Creed Black Flag Resynced": ['Assassin\'s Creed IV: Black Flag', 'Assassin\'s Creed IV Black Flag', 'Assassin\'s Creed Black Flag Resynced'],
  "Assassin's Creed Director's Cut": ['Assassin\'s Creed: Director\'s Cut', 'Assassin\'s Creed Director\'s Cut'],
  "Assassin's Creed Freedom Cry": ['Assassin\'s Creed Freedom Cry', 'Assassin\'s Creed IV: Freedom Cry'],
  "Assassin's Creed Bloodlines": ['Assassin\'s Creed Bloodlines'],
  "Assassin's Creed Brotherhood": ['Assassin\'s Creed Brotherhood', 'Assassin\'s Creed: Brotherhood'],
  "Assassin's Creed Liberation HD": ['Assassin\'s Creed Liberation HD', 'Assassin\'s Creed Liberation'],
  "Assassin's Creed Revelations": ['Assassin\'s Creed Revelations', 'Assassin\'s Creed: Revelations'],
  "Assassin's Creed Rogue": ['Assassin\'s Creed Rogue', 'Assassin\'s Creed: Rogue'],
  "Assassin's Creed III": ['Assassin\'s Creed III', 'Assassin\'s Creed 3', 'Assassin\'s Creed: III'],
  "Assassin's Creed II – Deluxe Edition": ['Assassin\'s Creed II Deluxe Edition', 'Assassin\'s Creed 2 Deluxe Edition', 'Assassin\'s Creed II – Deluxe Edition'],
  "Assassin's Creed IV: Black Flag – Jackdaw Edition": ['Assassin\'s Creed IV: Black Flag Jackdaw Edition', 'Assassin\'s Creed IV Black Flag Jackdaw Edition', 'Assassin\'s Creed IV: Black Flag – Jackdaw Edition'],
  "Assassin's Creed Syndicate – Gold Edition": ['Assassin\'s Creed Syndicate Gold Edition', 'Assassin\'s Creed Syndicate – Gold Edition'],
  "Assassin's Creed Odyssey – Ultimate Edition": ['Assassin\'s Creed Odyssey Ultimate Edition', 'Assassin\'s Creed Odyssey – Ultimate Edition'],
  "Assassin's Creed Valhalla – Ultimate Edition": ['Assassin\'s Creed Valhalla Ultimate Edition', 'Assassin\'s Creed Valhalla – Ultimate Edition'],
  'Battlefield V': ['Battlefield V', 'Battlefield 5'],
  'Black Myth: Wukong': ['Black Myth: Wukong', 'Black Myth Wukong'],
  'Call of Duty: Black Ops 6': ['Call of Duty: Black Ops 6', 'Call of Duty Black Ops 6'],
  'Call of Duty: Black Ops II': ['Call of Duty: Black Ops 2', 'Call of Duty: Black Ops II'],
  'Call of Duty: Black Ops III': ['Call of Duty: Black Ops 3', 'Call of Duty: Black Ops III'],
  'Call of Duty: Modern Warfare': ['Call of Duty: Modern Warfare', 'Call of Duty Modern Warfare'],
  'Call of Duty: Modern Warfare III': ['Call of Duty: Modern Warfare 3', 'Call of Duty: Modern Warfare III'],
  'Cities: Skylines': ['Cities: Skylines', 'Cities Skylines'],
  'Cities: Skylines II': ['Cities: Skylines 2', 'Cities: Skylines II'],
  'Dark Souls: Remastered': ['Dark Souls: Remastered', 'Dark Souls Remastered', 'Dark Souls 3'],
  'Dark Souls II': ['Dark Souls II', 'Dark Souls 2', 'Dark Souls 2 Scholar of the First Sin'],
  'Dark Souls II: Scholar of the First Sin': ['Dark Souls II: Scholar of the First Sin', 'Dark Souls II Scholar of the First Sin', 'Dark Souls 2 Scholar of the First Sin'],
  'Dark Souls III': ['Dark Souls III', 'Dark Souls 3', 'Dark Souls 3 Remastered'],
  'DOOM': ['DOOM', 'Doom'],
  'DOOM Eternal': ['DOOM Eternal', 'Doom Eternal'],
  'Dead Space': ['Dead Space', 'Dead Space Remake'],
  'ELDEN RING': ['Elden Ring', 'ELDEN RING'],
  'Enshrouded': ['Enshrouded'],
  'Far Cry 3': ['Far Cry 3'],
  'Far Cry 4': ['Far Cry 4'],
  'Far Cry 5': ['Far Cry 5'],
  'Far Cry 6': ['Far Cry 6'],
  'Forza Horizon 4': ['Forza Horizon 4'],
  'Forza Horizon 5': ['Forza Horizon 5'],
  'God of War': ['God of War'],
  'God of War Ragnarök': ['God of War Ragnarök', 'God of War Ragnarok'],
  'Grand Theft Auto V': ['Grand Theft Auto V', 'GTA V'],
  'Grand Theft Auto IV: The Complete Edition': ['Grand Theft Auto IV', 'GTA IV'],
  'Grand Theft Auto: San Andreas - The Definitive Edition': ['Grand Theft Auto: San Andreas', 'Grand Theft Auto San Andreas'],
  'Grand Theft Auto: Vice City - The Definitive Edition': ['Grand Theft Auto: Vice City', 'Grand Theft Auto Vice City'],
  'Halo: The Master Chief Collection': ['Halo: The Master Chief Collection', 'Halo MCC'],
  'Hollow Knight: Silksong': ['Hollow Knight: Silksong', 'Hollow Knight Silksong'],
  'Need for Speed Heat': ['Need for Speed Heat'],
  'Need for Speed Unbound': ['Need for Speed Unbound'],
  'No Man\'s Sky': ['No Man\'s Sky', 'No Mans Sky'],
  'Phasmophobia': ['Phasmophobia'],
  'Project Zomboid': ['Project Zomboid'],
  'Ready or Not': ['Ready or Not'],
  'Red Dead Redemption 2': ['Red Dead Redemption 2', 'RDR2'],
  'Resident Evil 4': ['Resident Evil 4', 'Resident Evil 4 Remake'],
  'Resident Evil 5': ['Resident Evil 5'],
  'Resident Evil 6': ['Resident Evil 6'],
  'Resident Evil Requiem': ['Resident Evil Requiem'],
  'Rust': ['Rust'],
  'SCUM': ['SCUM'],
  'Sons Of The Forest': ['Sons of the Forest', 'Sons Of The Forest'],
  'Stranded Deep': ['Stranded Deep'],
  'Subnautica': ['Subnautica'],
  'Subnautica 2': ['Subnautica 2'],
  'Subnautica: Below Zero': ['Subnautica: Below Zero', 'Subnautica Below Zero'],
  'The Forest': ['The Forest'],
  'The Last of Us Part I': ['The Last of Us Part I', 'The Last of Us: Part I'],
  'The Last of Us Part II Remastered': ['The Last of Us Part II Remastered', 'The Last of Us Part II'],
  'Tomb Raider Game of the Year': ['Tomb Raider', 'Tomb Raider: Game of the Year Edition'],
  'Subsistence': ['Subsistence'],
  'Solo Leveling: ARISE OVERDRIVE': ['Solo Leveling: ARISE OVERDRIVE', 'Solo Leveling ARISE OVERDRIVE'],
  'Valheim': ['Valheim'],
};

const RAWG_BATCH_SIZE = 18;
const RAWG_CACHE_KEY = 'nexort-rawg-search-cache-v1';
const MAX_RENDERED_GAMES = 80;
const SEARCH_DEBOUNCE_MS = 260;
const translationCache = new Map();

const rawgSearchCache = (() => {
  try {
    return JSON.parse(localStorage.getItem(RAWG_CACHE_KEY) || '{}');
  } catch {
    return {};
  }
})();

const saveRawgSearchCache = () => {
  try {
    localStorage.setItem(RAWG_CACHE_KEY, JSON.stringify(rawgSearchCache));
  } catch {
    // La caché no debe impedir que cargue el catálogo.
  }
};

const getRawgSearchVariants = (title) => {
  const cleanTitle = title
    .replace(/[':]/g, '')
    .replace(/[-–—]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const variants = new Set([
    title,
    ...(RAWG_TITLE_ALIASES[title] || []),
    cleanTitle,
    title.replace(/:/g, ''),
    title.replace(/'/g, ''),
    title.replace(/:/g, ' '),
    title.replace(/'/g, ' '),
    title.toLowerCase(),
    cleanTitle.toLowerCase(),
  ]);

  return [...variants].filter(Boolean);
};

const fetchRawgGames = async () => {
  const apiKey = (RAWG_CREDENTIALS.apiKey || '').trim();
  if (!apiKey || apiKey === 'TU_RAWG_API_KEY') {
    throw new Error('Falta la API key de RAWG');
  }

  const targetTitles = selectedGameTitles.slice(0, RAWG_MAX_TITLES);
  const results = [];

  for (let index = 0; index < targetTitles.length; index += RAWG_BATCH_SIZE) {
    const batch = targetTitles.slice(index, index + RAWG_BATCH_SIZE);
    const batchResults = await Promise.all(batch.map(async (title) => {
      const aliasList = getRawgSearchVariants(title);

      if (rawgSearchCache[title]) return rawgSearchCache[title];

      for (const variant of aliasList) {
        try {
          const searchUrl = `https://api.rawg.io/api/games?key=${encodeURIComponent(apiKey)}&search=${encodeURIComponent(variant)}&page_size=1`;
          const response = await fetch(searchUrl, { cache: 'force-cache' });
          if (!response.ok) continue;

          const data = await response.json();
          const game = Array.isArray(data.results) ? data.results[0] : null;
          if (game) {
            const result = { ...game, name: title, rawgName: game.name || title };
            rawgSearchCache[title] = result;
            saveRawgSearchCache();
            return result;
          }
        } catch {
          // intenta con la siguiente variante
        }
      }

      return null;
    }));

    results.push(...batchResults.filter(Boolean));
  }

  return results;
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
let nintendoGames = [];
let phoneGames = [];
let xboxGames = [];
let playStationGames = [];

const LOCAL_COVER_MAP = {
  'solo leveling arise overdrive': 'https://images.g2a.com/323x433/1x1x1/solo-leveling-arise-overdrive-p10000512586/107e85f7f5e64160804a17fe',
};

const LOCAL_BACKGROUND_MAP = {
  'solo leveling arise overdrive': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRynN_jKFSeoi8oVFE-74p1p9WdQv4VQIlHZQpsmS_aFw&s=10',
};

const LOCAL_SCREENSHOTS_MAP = {
  'solo leveling arise overdrive': [
    'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2373990/6e2f1aa804ce7e85757117e976c22ca0e7f90036/ss_6e2f1aa804ce7e85757117e976c22ca0e7f90036.1920x1080.jpg?t=1781758887',
    'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2373990/eeb045f2d753939f780fd0ac5f162bc6c93d36ea/ss_eeb045f2d753939f780fd0ac5f162bc6c93d36ea.1920x1080.jpg?t=1781758887',
    'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2373990/9122156e9ce4eb2ddbfe9b5f23e4058885eb154c/ss_9122156e9ce4eb2ddbfe9b5f23e4058885eb154c.1920x1080.jpg?t=1781758887',
    'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2373990/4d8fabc0435dda2245f7d2c4b653b35bd8514c65/ss_4d8fabc0435dda2245f7d2c4b653b35bd8514c65.1920x1080.jpg?t=1781758887',
    'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2373990/32a7ab88d959fad2e26374f16e2e769135468588/ss_32a7ab88d959fad2e26374f16e2e769135468588.1920x1080.jpg?t=1781758887',
    'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2373990/a830e6794df0358da283be9f07240bd2c38ff457/ss_a830e6794df0358da283be9f07240bd2c38ff457.1920x1080.jpg?t=1781758887',
  ],
};

const LOCAL_DESCRIPTION_MAP = {
  'solo leveling arise overdrive': 'Solo Leveling: ARISE OVERDRIVE es una aventura de acción inspirada en el universo de Solo Leveling, centrada en el ascenso de Sung Jinwoo desde un cazador aparentemente débil hasta una fuerza capaz de cambiar el equilibrio del mundo. Explora escenarios llenos de amenazas, supera combates cada vez más exigentes y aprovecha las habilidades de tu ejército de sombras para abrirte paso frente a enemigos poderosos. La progresión combina enfrentamientos dinámicos, mejoras constantes y una sensación de crecimiento muy marcada: cada victoria desbloquea nuevas posibilidades y hace que el protagonista se sienta más fuerte. Su propuesta busca trasladar la energía del anime a una experiencia accesible, espectacular y con suficiente variedad para mantener el ritmo durante toda la aventura.',
};

const buildFallbackCatalog = () => selectedGameTitles.map((name) => ({
  name,
  url: '',
  cover: buildGeneratedCoverDataUrl(name),
  fallbackCover: buildGeneratedCoverDataUrl(name),
  updated: false,
}));

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

const state = window.NexortState;
const persistStoredSet = window.NexortStorage.saveStoredSet;
const storageSaveValue = window.NexortStorage.saveStoredValue;
const storageReadValue = window.NexortStorage.readStoredValue;
const storageRemoveValue = window.NexortStorage.removeStoredValue;

const profileNameInput = document.getElementById('profileName');
const saveProfileButton = document.getElementById('saveProfile');
const profileForm = document.getElementById('profileForm');
const profileHeading = document.getElementById('profileHeading');
const profileStatus = document.getElementById('profileStatus');
const profileAvatar = document.getElementById('profileAvatar');
const profileAvatarInitial = document.getElementById('profileAvatarInitial');
const profileAvatarInput = document.getElementById('profileAvatarInput');
const profileActivity = document.getElementById('profileActivity');
const clearProfileDataButton = document.getElementById('clearProfileData');
const detailsContent = document.getElementById('detailsContent');
const libraryFilter = document.getElementById('libraryFilter');
const libraryEmpty = document.getElementById('libraryEmpty');
const exploreEmpty = document.getElementById('exploreEmpty');
const profileStats = document.getElementById('profileStats');
const catalogStatus = document.getElementById('catalogStatus');
const summaryGrid = document.getElementById('summaryGrid');
const recentStrip = document.getElementById('recentStrip');
const discoverGrid = document.getElementById('discoverGrid');
const discoverStatus = document.getElementById('discoverStatus');
const trendsGrid = document.getElementById('trendsGrid');
const trendsStatus = document.getElementById('trendsStatus');
const DISCOVER_REFRESH_MS = 6 * 60 * 60 * 1000;
let lastDiscoverRefresh = 0;
const coverCache = (() => {
  try {
    return JSON.parse(localStorage.getItem('nexort-cover-cache-v2') || '{}');
  } catch {
    return {};
  }
})();

const saveCoverCache = () => {
  try {
    localStorage.setItem('nexort-cover-cache-v2', JSON.stringify(coverCache));
  } catch {
    // La caché es opcional y no debe bloquear el catálogo.
  }
};
const parseLinksMarkdown = (markdown) => {
  const gamesFromLinks = [];
  const lines = markdown.split(/\r?\n/);

  for (let index = 0; index < lines.length; index += 1) {
    const headingMatch = lines[index].match(/^##\s+(.+?)\s*$/);
    if (!headingMatch) continue;

    const name = headingMatch[1].trim();
    if (!name || name.startsWith('*')) continue;

    const fields = {};
    for (let fieldIndex = index + 1; fieldIndex < lines.length && !/^##\s+/.test(lines[fieldIndex]); fieldIndex += 1) {
      const fieldMatch = lines[fieldIndex].trim().match(/^[-]\s*(Descarga|Actualización|Información|Versión|Notas):\s*(.*)$/i);
      if (fieldMatch) fields[fieldMatch[1].toLowerCase()] = fieldMatch[2].trim();
      else if (!fields.descarga && /^[-]\s+/.test(lines[fieldIndex].trim())) fields.descarga = lines[fieldIndex].trim().replace(/^[-]\s*/, '').trim();
    }

    const rawUrl = (fields.descarga || '').trim();
    const updateUrl = fields['actualización'] && fields['actualización'] !== 'PENDIENTE' ? fields['actualización'] : '';
    const info = fields.información || fields['versión'] || fields.notas || '';
    gamesFromLinks.push({
      name,
      url: /^PENDIENTE$/i.test(rawUrl) ? '' : rawUrl,
      updateUrl,
      updateInfo: info,
      updated: Boolean(updateUrl || info),
    });
  }

  return [...new Map(gamesFromLinks.map((game) => [normalizeGameName(game.name), { ...game, name: game.name }])).values()];
};

const mergeCatalogEntries = (...groups) => {
  const merged = new Map();

  for (const group of groups) {
    for (const game of group || []) {
      const key = normalizeGameName(game?.name || '');
      if (!key) continue;
      const existing = merged.get(key) || {};
      merged.set(key, {
        ...existing,
        ...game,
        name: game?.name || existing.name,
        url: game?.url || existing.url || '',
        cover: game?.cover || existing.cover || '',
        fallbackCover: game?.fallbackCover || existing.fallbackCover || game?.cover || existing.cover || '',
        updateUrl: game?.updateUrl || existing.updateUrl || '',
        updateInfo: game?.updateInfo || existing.updateInfo || '',
        updated: Boolean(game?.updated || existing.updated),
      });
    }
  }

  return [...merged.values()];
};

const readLinksCatalog = async () => {
  try {
    const response = await fetch('Links/Links PC.md', { cache: 'no-store' });
    if (!response.ok) return [];
    const markdown = await response.text();
    return parseLinksMarkdown(markdown);
  } catch {
    return [];
  }
};

const readNintendoLinksCatalog = async () => {
  try {
    const response = await fetch('Links/Links Nintendo.md', { cache: 'no-store' });
    if (!response.ok) return [];
    const markdown = await response.text();
    const amiiboCover = 'https://assets.nintendo.eu/image/upload/f_auto,c_limit,w_400,q_auto:eco:sensitive/MNS/Content%20Pages%20Assets/Category-List%20Pages/Merchandise/16.9_HeaderBanner_amiibo_NOE';
    const entries = [];
    const nintendoCoverMap = {
      'the legend of zelda tears of the kingdom': 'https://media.rawg.io/media/games/556/55684bfd048706f4266d331d70050b37.jpg',
      'the legend of zelda breath of the wild': 'https://media.rawg.io/media/games/cc1/cc196a5ad763955d6532cdba236f730c.jpg',
    };
    const lines = markdown.split(/\r?\n/);
    let currentSection = 'games';
    let currentEmulatorStatus = '';
    let currentEmulatorPlatform = '';

    for (let index = 0; index < lines.length; index += 1) {
      const line = lines[index].trim();
      if (/^##\s+Emuladores\s*$/i.test(line)) {
        currentSection = 'emulators';
        currentEmulatorStatus = '';
        currentEmulatorPlatform = 'Nintendo Switch';
        continue;
      }
      if (/^##\s+Amiibo(?:s)?\s*$/i.test(line)) {
        currentSection = 'amiibos';
        currentEmulatorStatus = '';
        currentEmulatorPlatform = '';
        continue;
      }
      if (/^##\s+Juegos\s*$/i.test(line)) {
        currentSection = 'games';
        currentEmulatorStatus = '';
        currentEmulatorPlatform = '';
        continue;
      }
      if (currentSection === 'emulators' && /^###\s+🎮\s+Emuladores de Nintendo Switch\s*$/i.test(line)) {
        currentEmulatorPlatform = 'Nintendo Switch';
        currentEmulatorStatus = '';
        continue;
      }
      if (currentSection === 'emulators' && /^###\s+🟢\s+Activos\s*$/i.test(line)) {
        currentEmulatorStatus = 'Activos';
        continue;
      }
      if (currentSection === 'emulators' && /^###\s+🔴\s+Descontinuados\s*$/i.test(line)) {
        currentEmulatorStatus = 'Descontinuados';
        continue;
      }
      if (currentSection === 'emulators' && /^###\s+🎮\s+Emuladores de Wii U para PC\s*$/i.test(line)) {
        currentEmulatorPlatform = 'Wii U';
        currentEmulatorStatus = 'Emuladores de Wii U para PC';
        continue;
      }

      const entryMatch = line.match(/^(?:###|####)\s+(.+?)\s*$/);
      if (!entryMatch) continue;

      const name = entryMatch[1].trim();
      const fields = {};
      let fieldIndex = index + 1;
      while (fieldIndex < lines.length && /^-\s*/.test(lines[fieldIndex].trim())) {
        const fieldMatch = lines[fieldIndex].trim().match(/^[-]\s*(Descarga|Actualización|DLC|Keys and Firmware|USB Helper|Keys|Firmware):\s*(.*)$/i);
        if (fieldMatch) {
          const fieldName = fieldMatch[1].toLowerCase();
          fields[fieldName] = fieldMatch[2].trim();
          if (fieldName === 'keys and firmware') {
            fields.keys = fieldMatch[2].trim();
            fields.firmware = fieldMatch[2].trim();
          }
        }
        fieldIndex += 1;
      }
      const plainValue = (lines[index + 1] || '').replace(/^[-]\s*/, '').trim();
      const rawValue = fields.descarga || (plainValue.includes(': ') ? '' : plainValue);
      const normalizedName = normalizeGameName(name);
      const isEdenEntry = normalizedName === 'eden';
      const isCemuEntry = normalizedName === 'cemu';
      const isAmiiboEntry = currentSection === 'amiibos';
      entries.push({
        name,
        url: rawValue === 'PENDIENTE' || !rawValue ? '' : rawValue,
        updatesUrl: fields['actualización'] && fields['actualización'] !== 'PENDIENTE' ? fields['actualización'] : '',
        dlcUrl: fields.dlc && fields.dlc !== 'PENDIENTE' ? fields.dlc : '',
        keysUrl: isEdenEntry && fields.keys && fields.keys !== 'PENDIENTE' ? fields.keys : '',
        firmwareUrl: isEdenEntry && fields.firmware && fields.firmware !== 'PENDIENTE' ? fields.firmware : '',
        usbHelperUrl: isCemuEntry && fields['usb helper'] && fields['usb helper'] !== 'PENDIENTE' ? fields['usb helper'] : '',
        cover: currentSection === 'amiibos'
          ? amiiboCover
          : NINTENDO_EMULATOR_LOGOS[normalizedName]
          || nintendoCoverMap[normalizedName]
          || buildGeneratedCoverDataUrl(name),
        fallbackCover: currentSection === 'amiibos' ? amiiboCover : buildGeneratedCoverDataUrl(name),
        platforms: isAmiiboEntry ? ['Nintendo Switch', 'Wii U', 'Nintendo 3DS', 'Nintendo 2DS'] : ['Nintendo'],
        category: currentSection,
        emulatorStatus: currentEmulatorStatus,
        emulatorPlatform: currentEmulatorPlatform,
        genres: isAmiiboEntry ? ['Coleccionables interactivos / accesorios para videojuegos'] : [],
        developers: isAmiiboEntry ? ['Nintendo'] : [],
        released: isAmiiboEntry ? '2014-11-21' : '',
        description: isAmiiboEntry
          ? 'amiibo es una línea de figuras y tarjetas coleccionables interactivas de Nintendo que incorporan tecnología NFC. Al acercar un amiibo al lector NFC de una consola compatible, puede interactuar con determinados videojuegos para desbloquear personajes, objetos, trajes, recompensas, funciones especiales y otro contenido. Algunos juegos también permiten guardar datos directamente en el amiibo, permitiendo utilizarlo posteriormente en otras consolas compatibles.'
          : currentSection === 'emulators'
          ? NINTENDO_EMULATOR_DESCRIPTIONS[normalizedName] || `${name} es un emulador de Nintendo.`
          : '',
        descriptionEs: isAmiiboEntry
          ? 'amiibo es una línea de figuras y tarjetas coleccionables interactivas de Nintendo que incorporan tecnología NFC. Al acercar un amiibo al lector NFC de una consola compatible, puede interactuar con determinados videojuegos para desbloquear personajes, objetos, trajes, recompensas, funciones especiales y otro contenido. Algunos juegos también permiten guardar datos directamente en el amiibo, permitiendo utilizarlo posteriormente en otras consolas compatibles.'
          : currentSection === 'emulators'
          ? NINTENDO_EMULATOR_DESCRIPTIONS[normalizedName] || `${name} es un emulador de Nintendo.`
          : '',
      });
    }

    return entries;
  } catch {
    return [];
  }
};

const PHONE_EMULATOR_LOGO_MAP = {
  bluestacks: 'https://www.google.com/s2/favicons?sz=256&domain=bluestacks.com',
  ldplayer: 'https://www.google.com/s2/favicons?sz=256&domain=ldplayer.net',
  memuplay: 'https://www.google.com/s2/favicons?sz=256&domain=memuplay.com',
  'memu play': 'https://www.google.com/s2/favicons?sz=256&domain=memuplay.com',
  noxplayer: 'https://www.bignox.com/favicon.ico',
  mumuplayer: 'https://www.mumuglobal.com/favicon.ico',
  'mumu player': 'https://www.mumuglobal.com/favicon.ico',
  gameloop: 'https://www.gameloop.com/favicon.ico',
  'android studio emulator': 'https://www.google.com/s2/favicons?sz=256&domain=developer.android.com',
  genymotion: 'https://www.genymotion.com/favicon.ico',
  waydroid: 'https://www.google.com/s2/favicons?sz=256&domain=waydro.id',
  primeos: 'https://www.google.com/s2/favicons?sz=256&domain=primeos.in',
  'playstation emulators': 'https://www.google.com/s2/favicons?sz=256&domain=playstation.com',
  'xbox emulators': 'https://www.google.com/s2/favicons?sz=256&domain=xbox.com',
};

const getReliableLogoUrl = (logoUrl) => {
  const domain = String(logoUrl || '').match(/[?&]domain=([^&]+)/i)?.[1];
  return domain
    ? `https://icons.duckduckgo.com/ip3/${domain}.ico`
    : logoUrl;
};

const PLAYSTATION_EMULATOR_DESCRIPTIONS = {
  duckstation: 'Emulador de PlayStation 1 enfocado en precisión, rendimiento y facilidad de configuración, con mejoras gráficas y múltiples opciones de personalización.',
  pcsx2: 'Emulador de PlayStation 2 de código abierto que ofrece mejoras de resolución, gráficos, guardados rápidos y numerosas opciones de configuración.',
  rpcs3: 'Emulador de PlayStation 3 de código abierto para PC, con compatibilidad con numerosos juegos y opciones avanzadas de configuración.',
  shadps4: 'Emulador experimental de PlayStation 4 para PC, actualmente en desarrollo y con compatibilidad creciente para diferentes juegos.',
  kyty: 'Proyecto experimental relacionado con la emulación de PlayStation 4 y PlayStation 5, con compatibilidad limitada y desarrollo activo.',
};

const XBOX_EMULATOR_DESCRIPTIONS = {
  xemu: 'Emulador de Xbox original para PC enfocado en ofrecer una experiencia precisa y compatible, con soporte para numerosos juegos y diferentes opciones de configuración.',
  xenia: 'Emulador de Xbox 360 de código abierto para PC, diseñado para ejecutar juegos de la consola con mejoras de rendimiento y compatibilidad en constante desarrollo.',
  'cxbx reloaded': 'Emulador de Xbox original de código abierto para Windows, capaz de ejecutar determinados juegos mediante emulación y recompilación del código de la consola.',
};

const NINTENDO_EMULATOR_DESCRIPTIONS = {
  eden: 'Desarrollo activo; tiene versiones recientes para Windows, Linux y macOS.',
  'kenji nx': 'Desarrollo activo; sus repositorios muestran actividad durante septiembre de 2026.',
  ryubing: 'Fork de Ryujinx con repositorios y proyectos comunitarios actualmente mantenidos.',
  ryujinx: 'El proyecto original fue descontinuado.',
  yuzu: 'Desarrollo original descontinuado.',
  sudachi: 'Desarrollo discontinuado.',
  citron: 'Desarrollo discontinuado.',
  suyu: 'Proyecto discontinuado.',
  torzu: 'Proyecto derivado de Yuzu cuyo desarrollo ya no se considera activo.',
  strato: 'Proyecto experimental cuyo desarrollo fue abandonado.',
  cemu: 'Emulador de Wii U para Windows, Linux y macOS, con desarrollo activo y capacidad para ejecutar gran parte del catálogo de Wii U.',
  decaf: 'Emulador de Wii U de código abierto orientado principalmente a investigación y desarrollo; cuenta con builds para Windows y Linux, aunque sigue siendo experimental.',
};

const NINTENDO_EMULATOR_LOGOS = {
  eden: 'https://eden-emu.dev/assets/logos/named_logo.png',
  'kenji nx': 'https://www.google.com/s2/favicons?sz=256&domain=github.com',
  ryubing: 'https://www.google.com/s2/favicons?sz=256&domain=github.com',
  ryujinx: 'https://www.google.com/s2/favicons?sz=256&domain=github.com',
  yuzu: 'https://www.google.com/s2/favicons?sz=256&domain=yuzu-emu.org',
  sudachi: 'https://www.google.com/s2/favicons?sz=256&domain=github.com',
  citron: 'https://www.google.com/s2/favicons?sz=256&domain=github.com',
  suyu: 'https://www.google.com/s2/favicons?sz=256&domain=github.com',
  torzu: 'https://www.google.com/s2/favicons?sz=256&domain=github.com',
  strato: 'https://www.google.com/s2/favicons?sz=256&domain=github.com',
  cemu: 'https://www.google.com/s2/favicons?sz=256&domain=cemu.info',
  decaf: 'https://www.google.com/s2/favicons?sz=256&domain=github.com',
};

const readPlatformSpecificCatalog = async (fileName, platformName, categoryName, customLogoMap = {}) => {
  try {
    const response = await fetch(fileName, { cache: 'no-store' });
    if (!response.ok) return [];
    const markdown = await response.text();
    const entries = [];
    const lines = markdown.split(/\r?\n/);
    let currentPlatformGroup = '';
    let currentCategory = categoryName;

    for (let index = 0; index < lines.length; index += 1) {
      const line = lines[index].trim();
      const sectionMatch = line.match(/^###\s+🎮\s*(.+?)\s*$/);
      if (sectionMatch) {
        currentPlatformGroup = sectionMatch[1].trim();
        currentCategory = currentPlatformGroup.toLowerCase().startsWith('juegos') ? 'games' : categoryName;
        continue;
      }

      const entryMatch = line.match(/^(?:###|####)\s+(?!🎮)(.+?)\s*$/);
      if (!entryMatch) continue;

      const name = entryMatch[1].trim();
      const entryLines = lines.slice(index + 1, index + 10);
      const firstLink = entryLines.find((line) => /^-\s*https?:\/\//i.test(line.trim()));
      const plainValue = firstLink ? firstLink.trim().replace(/^[-]\s*/, '').trim() : '';
      const mappedLogo = getReliableLogoUrl(customLogoMap[normalizeGameName(name)] || PHONE_EMULATOR_LOGO_MAP[normalizeGameName(name)] || '');
      const normalizedName = normalizeGameName(name);
      const descriptionMap = platformName === 'PlayStation'
        ? PLAYSTATION_EMULATOR_DESCRIPTIONS
        : platformName === 'Xbox'
          ? XBOX_EMULATOR_DESCRIPTIONS
          : {};
      const description = descriptionMap[normalizedName] || '';
      const isGameEntry = currentCategory === 'games';

      entries.push({
        name,
        url: plainValue && plainValue !== 'PENDIENTE' ? plainValue : '',
        cover: mappedLogo || buildGeneratedCoverDataUrl(name),
        fallbackCover: buildGeneratedCoverDataUrl(name),
        platforms: [platformName],
        platformGroup: currentPlatformGroup,
        category: currentCategory,
        description: isGameEntry ? `${name} es un juego de ${platformName}.` : description || `${name} es un emulador compatible con ${platformName}, pensado para ejecutar juegos y contenido de esa plataforma.`,
        descriptionEs: isGameEntry ? `${name} es un juego de ${platformName}.` : description || `${name} es un emulador compatible con ${platformName}, pensado para ejecutar juegos y contenido de esa plataforma.`,
        genres: isGameEntry ? ['Juego'] : ['Emulador'],
        developers: isGameEntry ? [] : [name],
        released: isGameEntry ? '' : '2024-01-01',
      });
    }

    return entries;
  } catch {
    return [];
  }
};

const readPhoneLinksCatalog = async () => {
  try {
    const response = await fetch('Links/Links Telefono.md', { cache: 'no-store' });
    if (!response.ok) return [];
    const markdown = await response.text();
    const entries = [];
    const lines = markdown.split(/\r?\n/);

    for (let index = 0; index < lines.length; index += 1) {
      const entryMatch = lines[index].trim().match(/^###\s+(.+?)\s*$/);
      if (!entryMatch) continue;

      const name = entryMatch[1].trim();
      const plainValue = (lines[index + 1] || '').replace(/^[-]\s*/, '').trim();
      const keysLine = (lines[index + 2] || '').trim().match(/^[-]\s*Keys and Firmware:\s*(.*)$/i);
      const keysUrl = keysLine?.[1] && keysLine[1] !== 'PENDIENTE' ? keysLine[1] : '';
      const versionFiveLine = lines.slice(index + 1, index + 5).find((line) => /^[-]\s*BlueStacks 5:/i.test(line.trim()));
      const versionTenLine = lines.slice(index + 1, index + 5).find((line) => /^[-]\s*BlueStacks 10:/i.test(line.trim()));
      const versionFiveValue = versionFiveLine?.trim().replace(/^[-]\s*BlueStacks 5:\s*/i, '') || '';
      const versionTenValue = versionTenLine?.trim().replace(/^[-]\s*BlueStacks 10:\s*/i, '') || '';
      const mappedLogo = getReliableLogoUrl(PHONE_EMULATOR_LOGO_MAP[normalizeGameName(name)] || '');
      const isEdenEntry = normalizeGameName(name) === 'eden';

      const isPhoneEmulator = true;
      const phoneDescriptions = {
        bluestacks: 'BlueStacks — Emulador de Android para PC enfocado en ejecutar juegos y aplicaciones móviles con buen rendimiento y numerosas opciones de configuración.',
        ldplayer: 'LDPlayer — Emulador ligero de Android diseñado principalmente para gaming, con controles personalizables, múltiples instancias y optimizaciones de rendimiento.',
        memuplay: 'MEmu Play — Emulador de Android para Windows que permite ejecutar juegos y aplicaciones con controles configurables, múltiples instancias y diferentes versiones de Android.',
        noxplayer: 'NoxPlayer — Emulador de Android para PC que ofrece controles de teclado y mouse, grabación de macros, múltiples instancias y compatibilidad con numerosas aplicaciones.',
        mumuplayer: 'MuMu Player — Emulador de Android orientado a juegos móviles, con soporte para controles, ajustes de rendimiento y funciones para jugar en una pantalla grande.',
        gameloop: 'GameLoop — Emulador desarrollado principalmente para juegos móviles competitivos, con controles optimizados para teclado y mouse y herramientas específicas para gaming.',
        'android studio emulator': 'Android Studio Emulator — Emulador oficial incluido en Android Studio, pensado principalmente para desarrolladores que necesitan probar aplicaciones en diferentes dispositivos y versiones de Android.',
        genymotion: 'Genymotion — Plataforma de emulación de Android orientada principalmente al desarrollo y las pruebas, con diferentes dispositivos virtuales y configuraciones del sistema.',
        waydroid: 'Waydroid — Solución que permite ejecutar aplicaciones Android en Linux integrándolas con el escritorio, utilizando un contenedor en lugar de una máquina virtual tradicional.',
        primeos: 'PrimeOS — Sistema operativo basado en Android diseñado para instalarse en PC, ofreciendo una experiencia similar a un escritorio y soporte para aplicaciones y juegos Android.',
      };
      const defaultPhoneDescription = phoneDescriptions[normalizeGameName(name)] || `${name} es un emulador para Android que permite ejecutar juegos y apps móviles con mejor rendimiento, compatibilidad y acceso rápido a modos de juego.`;

      entries.push({
        name,
        url: plainValue && !plainValue.includes(': ') && plainValue !== 'PENDIENTE' ? plainValue : '',
        keysUrl,
        versionFiveUrl: versionFiveValue !== 'PENDIENTE' ? versionFiveValue : '',
        versionTenUrl: versionTenValue !== 'PENDIENTE' ? versionTenValue : '',
        cover: mappedLogo || buildGeneratedCoverDataUrl(name),
        fallbackCover: buildGeneratedCoverDataUrl(name),
        platforms: ['Telefono'],
        category: 'phone-emulators',
        description: isEdenEntry ? 'Eden — Emulador de Nintendo Switch de código abierto para PC, enfocado en ejecutar juegos de Switch mediante una arquitectura de emulación compatible con diferentes sistemas de escritorio.' : defaultPhoneDescription,
        descriptionEs: isEdenEntry ? 'Eden — Emulador de Nintendo Switch de código abierto para PC, enfocado en ejecutar juegos de Switch mediante una arquitectura de emulación compatible con diferentes sistemas de escritorio.' : defaultPhoneDescription,
        genres: isEdenEntry ? ['Emulador', 'Nintendo'] : ['Emulador', 'Android'],
        developers: isEdenEntry ? ['Eden Emulators'] : [name],
        released: isEdenEntry ? '2022-03-11' : '2024-01-01',
        background: mappedLogo || buildGeneratedCoverDataUrl(name),
      });
    }

    return entries;
  } catch {
    return [];
  }
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

const getCoverFallbackText = (title = 'Juego') => {
  const text = title.trim();
  if (!text) return 'J';
  const initials = text
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
  return initials || 'J';
};

const steamAppIds = {
  '7 days to die': 251570,
  'among us': 945360,
  'ark survival ascended': 2399830,
  'ark survival evolved': 346110,
  'assassins creed 2': 33230,
  'assassins creed mirage': 2198900,
  'assassins creed shadows': 2516860,
  'assassins creed valhalla': 2208920,
  'assassins creed iii remastered': 208480,
  'assassins creed iv black flag': 242050,
  'assassins creed odyssey': 812140,
  'assassins creed origins': 582160,
  'assassins creed rogue': 271590,
  'assassins creed syndicate': 368500,
  'assassins creed unity': 289650,
  'avatar frontiers of pandora': 2028250,
  'battlefield v': 1238840,
  'black myth wukong': 2358720,
  'call of duty black ops 6': 0,
  'call of duty black ops ii': 202970,
  'call of duty black ops iii': 311210,
  'call of duty modern warfare': 1938090,
  'call of duty modern warfare 3': 1938090,
  'cities skylines': 255710,
  'cities skylines ii': 949230,
  'cyberpunk 2077': 1091500,
  'days gone': 1241960,
  'dayz': 221100,
  'dead by daylight': 381210,
  'dead space': 1693980,
  'doom': 9050,
  'doom eternal': 782330,
  'doom the dark ages': 0,
  'elden ring': 1245620,
  'enshrouded': 0,
  'euro truck simulator 2': 227300,
  'fallout 4': 377160,
  'far cry 3': 220240,
  'far cry 4': 298110,
  'far cry 5': 552520,
  'far cry 6': 2369390,
  'farming simulator 25': 2559280,
  'forza horizon 4': 1297590,
  'forza horizon 5': 1551360,
  'forza horizon 6': 0,
  'gears 5': 0,
  'god of war': 2322010,
  'god of war ragnarok': 2322010,
  'grand theft auto v': 271590,
  'green hell': 815370,
  'halo infinite': 1240440,
  'halo the master chief collection': 976730,
  'hollow knight': 367520,
  'injustice 2': 627270,
  'mortal kombat 1': 1971870,
  'mortal kombat x': 201710,
  'mortal kombat 11': 202970,
  'metro exodus': 412020,
  'metro 2033 redux': 287390,
  'metro 2033': 286690,
  'metro awakening': 0,
  'metro last light redux': 287390,
  'need for speed': 0,
  'need for speed hot pursuit': 0,
  'need for speed shift': 0,
  'need for speed undercover': 0,
  'need for speed heat': 1151640,
  'need for speed hot pursuit remastered': 0,
  'need for speed most wanted': 0,
  'need for speed payback': 0,
  'need for speed rivals': 0,
  'need for speed unbound': 1846380,
  'night of the dead': 0,
  'no mans sky': 275850,
  'phasmophobia': 739630,
  'project zomboid': 108600,
  'raft': 648800,
  'ready or not': 1144200,
  'red dead redemption': 0,
  'red dead redemption 2': 1174180,
  'resident evil 4': 254700,
  'resident evil 5': 21690,
  'resident evil 6': 221040,
  'resident evil requiem': 0,
  'roadcraft': 0,
  'rust': 252490,
  'scum': 513710,
  'shadow of the tomb raider definitive edition': 0,
  'solo leveling arise overdrive': 0,
  'sons of the forest': 1326470,
  'stranded deep': 1102210,
  'subnautica': 264710,
  'subnautica 2': 0,
  'subnautica below zero': 848450,
  'subsistence': 0,
  'the forest': 242760,
  'the last of us part i': 1888930,
  'the last of us part ii remastered': 1888930,
  'tomb raider game of the year': 0,
  'valheim': 892970,
};

const normalizeForSteamMatch = (value = '') => normalizeGameName(value)
  .replace(/\bthe\b|\bof\b|\band\b|\bfor\b|\bto\b|\bwith\b/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

const getSteamAssetUrl = (appId, asset) => `https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${appId}/${asset}`;

const getSteamLogoUrl = (gameName) => {
  const normalized = normalizeGameName(gameName);
  const appId = steamAppIds[normalized];
  if (!appId || appId === 0) return '';
  return getSteamAssetUrl(appId, 'logo.png');
};

const getSteamCoverUrl = (gameName) => {
  const normalized = normalizeGameName(gameName);
  const appId = steamAppIds[normalized];
  if (!appId || appId === 0) return '';
  return getSteamAssetUrl(appId, 'library_600x900_2x.jpg');
};

const findBestSteamSearchResult = async (gameName) => {
  const term = encodeURIComponent(gameName);
  try {
    const response = await fetch(`https://store.steampowered.com/api/storesearch/?term=${term}&l=spanish&cc=us&snr=1`);
    if (!response.ok) return null;

    const data = await response.json();
    const items = (data.items || []).filter((entry) =>
      (entry.type === 'game' || entry.type === 'app' || !entry.type) && Number(entry.id) > 0
    );

    if (!items.length) return null;

    const target = normalizeForSteamMatch(gameName);
    const ranked = [...items].sort((a, b) => {
      const scoreA = getSteamSearchMatchScore(a.name || a.title || '', target);
      const scoreB = getSteamSearchMatchScore(b.name || b.title || '', target);
      return scoreB - scoreA;
    });

    return ranked[0] || null;
  } catch {
    return null;
  }
};

const getSteamSearchMatchScore = (candidateName, targetName) => {
  if (!candidateName || !targetName) return 0;

  const normalizedCandidate = normalizeForSteamMatch(candidateName);
  const normalizedTarget = normalizeForSteamMatch(targetName);
  let score = 0;

  if (normalizedCandidate === normalizedTarget) score += 100;
  if (normalizedCandidate.includes(normalizedTarget)) score += 35;
  if (normalizedTarget.includes(normalizedCandidate)) score += 25;

  const targetTokens = new Set(normalizedTarget.split(' '));
  const candidateTokens = new Set(normalizedCandidate.split(' '));
  const overlap = [...targetTokens].filter((token) => candidateTokens.has(token)).length;
  score += overlap * 8;

  return score;
};

const getSteamSearchLogoUrl = async (gameName) => {
  const item = await findBestSteamSearchResult(gameName);
  if (!item || !item.id) return '';
  return getSteamAssetUrl(item.id, 'logo.png');
};

const getSteamSearchCoverUrl = async (gameName) => {
  const item = await findBestSteamSearchResult(gameName);
  if (!item || !item.id) return '';
  return getSteamAssetUrl(item.id, 'library_600x900_2x.jpg');
};

const buildGeneratedCoverDataUrl = (name) => {
  const rawName = String(name || 'NEXORT').trim();
  const title = rawName
    .replace(/[:()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const displayText = title.length > 18
    ? title.split(' ').slice(0, 2).join(' ').slice(0, 18)
    : title;
  const palette = [
    ['#0f172a', '#2563eb'],
    ['#111827', '#7c3aed'],
    ['#0b1120', '#22c55e'],
    ['#1f2937', '#f59e0b'],
    ['#111827', '#ef4444'],
    ['#0f172a', '#14b8a6'],
    ['#111827', '#f97316'],
    ['#0f172a', '#ec4899'],
  ];
  const index = [...rawName].reduce((sum, char) => sum + char.charCodeAt(0), 0) % palette.length;
  const [start, end] = palette[index];

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 560">
      <defs>
        <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="${start}"/>
          <stop offset="100%" stop-color="${end}"/>
        </linearGradient>
      </defs>
      <rect width="400" height="560" fill="url(#g)"/>
      <circle cx="320" cy="70" r="80" fill="rgba(255,255,255,0.08)"/>
      <circle cx="100" cy="520" r="130" fill="rgba(255,255,255,0.05)"/>
      <text x="50%" y="36%" text-anchor="middle" fill="rgba(255,255,255,0.8)" font-size="18" font-weight="700" font-family="Arial, Helvetica, sans-serif" letter-spacing="4">NEXORT</text>
      <text x="50%" y="58%" text-anchor="middle" fill="white" font-size="40" font-weight="800" font-family="Arial, Helvetica, sans-serif">${escapeHtml(displayText.toUpperCase())}</text>
      <text x="50%" y="78%" text-anchor="middle" fill="rgba(255,255,255,0.75)" font-size="16" font-family="Arial, Helvetica, sans-serif">JUEGO</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

const resolveCoverImage = (game, fallbackName = '') => {
  const title = fallbackName || game?.name || 'NEXORT';
  const candidates = [
    game?.cover,
    game?.background,
    game?.background_image,
    game?.background_image_additional,
    game?.image,
    game?.artwork,
    game?.poster,
  ];

  const valid = candidates.find((value) => typeof value === 'string' && value.trim().length > 0);
  return valid || buildGeneratedCoverDataUrl(title);
};

const selectedGameTitles = [
  '7 Days to Die', 'Among Us', 'ARK: Survival Ascended', 'ARK: Survival Evolved',
  "Assassin's Creed II", "Assassin's Creed III", "Assassin's Creed III Remastered",
  "Assassin's Creed IV: Black Flag – Jackdaw Edition", "Assassin's Creed Black Flag Resynced",
  "Assassin's Creed Bloodlines", "Assassin's Creed Brotherhood", "Assassin's Creed Freedom Cry",
  "Assassin's Creed Liberation HD", "Assassin's Creed Mirage",
  "Assassin's Creed Odyssey – Ultimate Edition", "Assassin's Creed Origins", "Assassin's Creed Revelations",
  "Assassin's Creed Rogue",
  "Assassin's Creed Syndicate – Gold Edition", "Assassin's Creed Valhalla – Ultimate Edition",
  'Avatar: Frontiers of Pandora', 'Battlefield V', 'Black Myth: Wukong',
  'Call of Duty: Black Ops 6', 'Call of Duty: Black Ops II', 'Call of Duty: Black Ops III',
  'Call of Duty: Modern Warfare', 'Cities: Skylines',
  'Cities: Skylines II', 'Cyberpunk 2077', 'Dark Souls: Remastered', 'Dark Souls II', 'Dark Souls II: Scholar of the First Sin', 'Dark Souls III', 'Days Gone', 'DayZ',
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
  'Need for Speed: Most Wanted', 'Need for Speed Payback', 'Need for Speed Rivals',
  'Need for Speed Unbound', 'Night of the Dead', "No Man's Sky", 'Phasmophobia', 'Prince of Persia',
  'Project Zomboid', 'Raft', 'Ready or Not', 'Red Dead Redemption', 'Red Dead Redemption 2',
  'Resident Evil 4', 'Resident Evil 5', 'Resident Evil 6', 'Resident Evil Requiem', 'RoadCraft',
  'Rust', 'SCUM', 'Shadow of the Tomb Raider: Definitive Edition', 'Solo Leveling: ARISE OVERDRIVE',
  'Sons Of The Forest', 'Stranded Deep', 'Subnautica', 'Subnautica 2', 'Subnautica: Below Zero',
  'Subsistence', 'The Forest', 'The Last of Us Part I', 'The Last of Us Part II Remastered',
  'Tomb Raider Game of the Year', 'Valheim'
];

const selectedGameNames = new Set(selectedGameTitles.map(normalizeGameName));

const RAWG_MAX_TITLES = selectedGameTitles.length;

const getAllCatalogGames = () => [...new Map(
  [...games, ...nintendoGames, ...phoneGames, ...xboxGames, ...playStationGames]
    .map((game) => [normalizeGameName(game.name), game])
).values()];

const getLibraryGames = () => {
  const libraryGames = getAllCatalogGames().filter((game) => state.library.has(game.name));
  if (libraryFilter?.value === 'favorites') return libraryGames.filter((game) => state.favorites.has(game.name));
  if (libraryFilter?.value === 'updates') return libraryGames.filter((game) => game.updated);
  return libraryGames;
};

const GENRE_CATEGORY_MAP = {
  action: 'Acción',
  adventure: 'Aventura',
  arcade: 'Arcade',
  casual: 'Casual',
  esports: 'Esports',
  family: 'Familiar',
  fighting: 'Lucha',
  indie: 'Indie',
  'massively multiplayer': 'MMO',
  platformer: 'Plataformas',
  puzzle: 'Puzles',
  racing: 'Carreras',
  rpg: 'RPG',
  shooter: 'Shooter',
  simulation: 'Simulación',
  sports: 'Deportes',
  strategy: 'Estrategia',
  horror: 'Terror',
};

const getGameCategories = (game) => [...new Set((Array.isArray(game?.genres) ? game.genres : [])
  .map((genre) => GENRE_CATEGORY_MAP[String(genre).trim().toLowerCase()] || String(genre).trim())
  .filter(Boolean))];

const getGameGenres = () => [...new Set(games
  .flatMap((game) => getGameCategories(game))
  .filter(Boolean))].sort((first, second) => first.localeCompare(second, 'es'));

const updateGenreFilter = () => {
  if (!genreFilter) return;
  const currentValue = genreFilter.value || 'all';
  const options = getGameGenres();
  genreFilter.innerHTML = '<option value="all">Todas las categorías</option>'
    + options.map((genre) => `<option value="${escapeHtml(genre)}">${escapeHtml(genre)}</option>`).join('');
  genreFilter.value = options.includes(currentValue) ? currentValue : 'all';
};

const setCatalogLoading = (isLoading, message = 'Catálogo listo') => {
  state.isLoading = isLoading;
  if (catalogStatus) {
    catalogStatus.textContent = message;
    catalogStatus.classList.toggle('is-loading', isLoading);
  }
  const catalog = document.getElementById('gameCatalog');
  if (isLoading && catalog && !catalog.children.length) {
    catalog.innerHTML = Array.from({ length: 6 }, () => '<div class="catalog-skeleton" aria-hidden="true"><span></span><i></i><b></b></div>').join('');
  }
};

const renderHomeSummary = () => {
  if (!summaryGrid || !recentStrip) return;

  const updatedCount = games.filter((game) => game.updated).length;
  const summaryItems = [
    ['Biblioteca', state.library.size, 'juegos guardados'],
    ['Favoritos', state.favorites.size, 'títulos marcados'],
    ['Novedades', updatedCount, 'actualizaciones'],
  ];
  summaryGrid.innerHTML = summaryItems.map(([label, value, caption]) => `
    <div class="summary-stat"><strong>${value}</strong><span>${label}</span><small>${caption}</small></div>
  `).join('');

  const recentGames = state.recentGames
    .map((name) => getAllCatalogGames().find((game) => game.name === name))
    .filter(Boolean)
    .slice(0, 3);
  const recommended = games.filter((game) => !state.recentGames.includes(game.name)).slice(0, 3);
  const stripGames = recentGames.length ? recentGames : recommended;
  recentStrip.innerHTML = `
    <div class="recent-heading"><span class="eyebrow">${recentGames.length ? 'RECIENTE' : 'RECOMENDADOS'}</span><span>${stripGames.length} títulos</span></div>
    <div class="recent-items">${stripGames.map((game) => `
      <button class="recent-game" type="button" data-recent-game="${escapeHtml(game.name)}">
        <img src="${escapeHtml(getSafeAssetUrl(game.cover, buildGeneratedCoverDataUrl(game.name)))}" alt="" loading="lazy">
        <span>${escapeHtml(game.name)}</span>
      </button>
    `).join('')}</div>
  `;
};

const renderLoadingDiscoverCards = (targetGrid) => {
  if (!targetGrid) return;

  const loadingMarkup = Array.from({ length: 4 }, (_, index) => `
    <div class="discover-card loading-card" aria-label="Cargando tendencia ${index + 1}" aria-busy="true">
      <div class="loading-card-art"></div>
      <div class="loading-card-body">
        <span class="loading-line loading-line-title"></span>
        <span class="loading-line loading-line-meta"></span>
      </div>
    </div>
  `).join('');

  targetGrid.innerHTML = loadingMarkup;
};

const renderDiscoverGames = (discoverGames, targetGrid = discoverGrid) => {
  if (!targetGrid) return;

  if (!discoverGames.length) {
    renderLoadingDiscoverCards(targetGrid);
    return;
  }

  targetGrid.innerHTML = discoverGames.map((game) => {
    const image = getSafeAssetUrl(resolveCoverImage(game, game?.name), buildGeneratedCoverDataUrl(game?.name));
    const release = game.released ? formatReleaseDate(game.released) : 'Próximamente';
    const rating = game.rating ? `★ ${game.rating.toFixed(1)}` : 'Sin valoración';
    const mediaMarkup = game.video
      ? `<video src="${escapeHtml(getSafeExternalUrl(game.video))}" poster="${escapeHtml(getSafeAssetUrl(game.videoPreview, image))}" autoplay muted loop playsinline preload="metadata" aria-label="Tráiler de ${escapeHtml(game.name)}"></video><span class="discover-play" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="m8 5 11 7-11 7V5Z"/></svg> Tráiler</span>`
      : `<img src="${escapeHtml(image)}" alt="" loading="lazy">`;
    return `
      <button class="discover-card" type="button" data-discover-game="${escapeHtml(game.name)}">
        ${mediaMarkup}
        <span class="discover-card-shade"></span>
        <span class="discover-card-content">
          <strong>${escapeHtml(game.name)}</strong>
          <small>${escapeHtml(release)} · ${escapeHtml(rating)}</small>
        </span>
      </button>
    `;
  }).join('');

  targetGrid.querySelectorAll('[data-discover-game]').forEach((card) => {
    card.addEventListener('click', () => {
      const game = discoverGames.find((item) => item.name === card.dataset.discoverGame);
      if (!game) return;
      const existingGame = games.find((item) => normalizeGameName(item.name) === normalizeGameName(game.name));
      showGameDetails(existingGame || game);
      openView('details');
    });
  });
};

const curatedTrendNames = [
  'Grand Theft Auto VI',
  'Resident Evil Requiem',
  'Marvel\'s Wolverine',
  'The Legend of Zelda: Ocarina of Time remake',
  'Forza Horizon 6',
  'The Duskbloods',
  'Nioh 3',
  'Fable',
  'Pragmata',
  'Control: Resonant',
  'Pokémon Pokopia',
  '007: First Light'
];

const knownReleasedGameNames = new Set([
  'forza horizon 6',
  'forza horizon 5',
  'forza horizon 4'
]);

const isAlreadyReleasedGame = (gameOrName) => {
  if (!gameOrName) return false;

  const rawName = typeof gameOrName === 'string' ? gameOrName : (gameOrName.name || '');
  const normalizedName = normalizeGameName(rawName);
  if (knownReleasedGameNames.has(normalizedName)) return true;

  const releaseValue = typeof gameOrName === 'string' ? '' : (gameOrName.released || gameOrName.released_at || gameOrName.first_release_date || '');
  if (!releaseValue) return false;

  const releaseDate = new Date(releaseValue);
  if (Number.isNaN(releaseDate.getTime())) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return releaseDate <= today;
};

const curatedUpcomingLaunchTitles = [
  { name: 'The Elder Scrolls VI', released: '2026-11-18', rating: 4.8 },
  { name: 'Grand Theft Auto VI', released: '2026-09-21', rating: 4.9 },
  { name: 'Resident Evil Requiem', released: '2026-09-24', rating: 4.7 },
  { name: 'Prince of Persia: The Sands of Time Remake', released: '2026-09-18', rating: 4.6 },
  { name: 'Marvel\'s Wolverine', released: '2026-10-02', rating: 4.8 },
  { name: '007: First Light', released: '2026-10-08', rating: 4.5 },
  { name: 'Nioh 3', released: '2026-10-19', rating: 4.6 },
  { name: 'Pragmata', released: '2026-11-03', rating: 4.5 },
  { name: 'Fable', released: '2026-11-15', rating: 4.4 },
  { name: 'The Duskbloods', released: '2026-11-25', rating: 4.4 },
  { name: 'Control: Resonant', released: '2026-12-02', rating: 4.3 }
];

const buildCuratedTrendGames = () => curatedTrendNames.map((name) => ({
  id: `curated-${normalizeGameName(name)}`,
  name,
  background: buildGeneratedCoverDataUrl(name),
  cover: buildGeneratedCoverDataUrl(name),
  released: '',
  rating: 4.7,
  source: 'curated',
  video: '',
  videoPreview: '',
}));

const enrichRawgGameDetails = async (game, apiKey) => {
  if (!game || !apiKey || apiKey === 'TU_RAWG_API_KEY') return game;

  const lookupName = String(game.name || '').trim();
  if (!lookupName) return game;

  try {
    const searchUrl = `https://api.rawg.io/api/games?key=${encodeURIComponent(apiKey)}&search=${encodeURIComponent(lookupName)}&page_size=1`;
    const searchResponse = await fetch(searchUrl, { cache: 'no-store' });
    if (searchResponse.ok) {
      const searchData = await searchResponse.json();
      const matchedGame = Array.isArray(searchData.results) ? searchData.results[0] : null;
      if (matchedGame) {
        game = { ...game, ...matchedGame };
      }
    }

    const gameId = game.id || game.rawgId;
    if (!gameId) return game;

    const detailsResponse = await fetch(`https://api.rawg.io/api/games/${encodeURIComponent(gameId)}?key=${encodeURIComponent(apiKey)}`, { cache: 'no-store' });
    if (detailsResponse.ok) {
      const details = await detailsResponse.json();
      game = {
        ...game,
        description: details.description_raw || details.description || game.description || '',
        background: details.background_image_additional || details.background_image || game.background || '',
        background_image: details.background_image || game.background_image || '',
        cover: details.background_image || game.cover || '',
        genres: Array.isArray(details.genres) ? details.genres.map((item) => item.name).filter(Boolean) : game.genres || [],
        developers: Array.isArray(details.developers) ? details.developers.map((item) => item.name).filter(Boolean) : game.developers || [],
        platforms: Array.isArray(details.platforms) ? details.platforms.map((item) => item.platform?.name).filter(Boolean) : game.platforms || [],
        released: details.released || game.released || '',
      };
    }

    const moviesResponse = await fetch(`https://api.rawg.io/api/games/${encodeURIComponent(gameId)}/movies?key=${encodeURIComponent(apiKey)}`, { cache: 'no-store' });
    if (moviesResponse.ok) {
      const moviesData = await moviesResponse.json();
      const movie = moviesData.results?.[0];
      const movieUrl = movie?.data?.max || movie?.data?.['480'] || movie?.data?.['720'];
      if (movieUrl) {
        game = { ...game, video: movieUrl, videoPreview: movie.preview || game.background || '' };
      }
    }

    return {
      ...game,
      background: resolveCoverImage(game, lookupName),
      cover: resolveCoverImage(game, lookupName),
      background_image: game.background_image || resolveCoverImage(game, lookupName),
    };
  } catch {
    return game;
  }
};

const fetchCuratedRawgTrendGames = async () => {
  const apiKey = (RAWG_CREDENTIALS.apiKey || '').trim();
  if (!apiKey || apiKey === 'TU_RAWG_API_KEY') return [];

  const results = [];

  for (const title of curatedTrendNames) {
    const variants = getRawgSearchVariants(title);
    for (const variant of variants) {
      try {
        const searchUrl = `https://api.rawg.io/api/games?key=${encodeURIComponent(apiKey)}&search=${encodeURIComponent(variant)}&page_size=1`;
        const response = await fetch(searchUrl, { cache: 'no-store' });
        if (!response.ok) continue;

        const data = await response.json();
        const game = Array.isArray(data.results) ? data.results[0] : null;
        if (!game) continue;

        results.push({
          ...game,
          name: title,
          background: resolveCoverImage(game, title),
          cover: resolveCoverImage(game, title),
          rawgId: game.id || 0,
          source: 'rawg-curated',
        });
        break;
      } catch {
        // intenta la siguiente variante si la búsqueda falla
      }
    }
  }

  return results.slice(0, 12);
};

const loadTrendGames = async () => {
  if (!trendsGrid) return;

  renderLoadingDiscoverCards(trendsGrid);

  if (trendsStatus) {
    trendsStatus.textContent = 'Cargando tendencias...';
    trendsStatus.classList.add('is-loading');
  }

  try {
    let trendGames = [];

    if (await checkLocalApiAvailability()) {
      try {
        const response = await fetch(`${API_CONFIG.baseUrl}/discover?mode=trends&limit=24`, { cache: 'no-store' });
        if (response.ok) {
          const data = await response.json();
          trendGames = (data.games || []).map((game) => ({
            ...game,
            background: game.background_image || '',
            cover: game.background_image || '',
            rawgId: game.id || 0,
          }));
        }
      } catch {
        localApiAvailable = false;
        trendGames = [];
      }
    }

    if (!trendGames.length) {
      trendGames = await fetchCuratedRawgTrendGames();
    }

    if (!trendGames.length) {
      trendGames = (await fetchRawgDiscoverGames()).map((game) => ({
        ...game,
        background: resolveCoverImage(game, game?.name),
        cover: resolveCoverImage(game, game?.name),
        rawgId: game.id || 0,
      }));
    }

    const priorityNames = new Map(curatedTrendNames.map((name, index) => [normalizeGameName(name), index]));
    const existingNames = new Set(trendGames.map((game) => normalizeGameName(game.name)));
    const missingCurated = curatedTrendNames
      .filter((name) => !existingNames.has(normalizeGameName(name)))
      .map((name) => ({
        id: `curated-${normalizeGameName(name)}`,
        name,
        background: buildGeneratedCoverDataUrl(name),
        cover: buildGeneratedCoverDataUrl(name),
        released: '',
        rating: 4.7,
        source: 'curated',
      }));

    trendGames = [...trendGames, ...missingCurated]
      .filter((game, index, array) => array.findIndex((item) => normalizeGameName(item.name) === normalizeGameName(game.name)) === index)
      .sort((first, second) => {
        const firstPriority = priorityNames.get(normalizeGameName(first.name));
        const secondPriority = priorityNames.get(normalizeGameName(second.name));
        const firstScore = firstPriority === undefined ? Number.MAX_SAFE_INTEGER : firstPriority;
        const secondScore = secondPriority === undefined ? Number.MAX_SAFE_INTEGER : secondPriority;
        return firstScore - secondScore;
      })
      .slice(0, 12)
      .map((game) => ({
        ...game,
        background: resolveCoverImage(game, game?.name),
        cover: resolveCoverImage(game, game?.name),
      }));

    trendGames = await Promise.all(trendGames.map(async (game) => {
      if (game.video) return game;
      const steamVideos = await getSteamVideos(game.name);
      const firstVideo = steamVideos[0];
      return firstVideo ? { ...game, video: firstVideo.url, videoPreview: firstVideo.preview } : game;
    }));

    renderDiscoverGames(trendGames, trendsGrid);
    if (trendsStatus) {
      trendsStatus.textContent = `${trendGames.length} títulos actualizados`;
      trendsStatus.classList.remove('is-loading');
    }
  } catch {
    renderLoadingDiscoverCards(trendsGrid);
    if (trendsStatus) {
      trendsStatus.textContent = 'Tendencias no disponibles';
      trendsStatus.classList.remove('is-loading');
    }
  }
};

const fetchRawgDiscoverGames = async () => {
  const apiKey = (RAWG_CREDENTIALS.apiKey || '').trim();
  if (!apiKey || apiKey === 'TU_RAWG_API_KEY') return [];

  const today = new Date();
  const sixMonthsFromNow = new Date(today);
  sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);
  const rawgUrl = new URL('https://api.rawg.io/api/games');
  rawgUrl.searchParams.set('key', apiKey);
  rawgUrl.searchParams.set('page_size', '12');
  rawgUrl.searchParams.set('ordering', 'released');
  rawgUrl.searchParams.set('dates', `${today.toISOString().slice(0, 10)},${sixMonthsFromNow.toISOString().slice(0, 10)}`);
  const rawgResponse = await fetch(rawgUrl.toString(), { cache: 'no-store' });
  if (!rawgResponse.ok) throw new Error('RAWG no respondió');
  const rawgData = await rawgResponse.json();
  const games = (rawgData.results || []).filter((game) => !isAlreadyReleasedGame(game));
  return Promise.all(games.map(async (game) => enrichRawgGameDetails(game, apiKey)));
};

const buildCuratedUpcomingLaunchGames = async () => {
  const apiKey = (RAWG_CREDENTIALS.apiKey || '').trim();
  const items = curatedUpcomingLaunchTitles
    .filter((game) => !isAlreadyReleasedGame(game))
    .map((game) => ({
      id: `launch-${normalizeGameName(game.name)}`,
      name: game.name,
      released: game.released,
      rating: game.rating,
      background: buildGeneratedCoverDataUrl(game.name),
      cover: buildGeneratedCoverDataUrl(game.name),
      source: 'curated-launch',
      video: '',
      videoPreview: '',
    }));

  if (!apiKey || apiKey === 'TU_RAWG_API_KEY') return items;

  return Promise.all(items.map(async (item) => enrichRawgGameDetails(item, apiKey)));
};

const loadDiscoverGames = async () => {
  if (!discoverGrid) return;

  renderLoadingDiscoverCards(discoverGrid);

  if (discoverStatus) {
    discoverStatus.textContent = 'Cargando novedades...';
    discoverStatus.classList.add('is-loading');
  }

  try {
    let discoverGames = [];
    if (await checkLocalApiAvailability()) {
      try {
        const response = await fetch(`${API_CONFIG.baseUrl}/discover?limit=12`, { cache: 'no-store' });
        if (response.ok) {
          const data = await response.json();
          discoverGames = data.games || [];
        }
      } catch {
        localApiAvailable = false;
        // Usa RAWG directamente si el proxy local todavía no está iniciado.
      }
    }

    if (!discoverGames.length) discoverGames = await fetchRawgDiscoverGames();

    discoverGames = discoverGames
      .filter((game) => !isAlreadyReleasedGame(game))
      .map((game) => ({
        ...game,
        background: resolveCoverImage(game, game?.name),
        cover: resolveCoverImage(game, game?.name),
        rawgId: game.id || 0,
      }));

    const localCuratedGames = await buildCuratedUpcomingLaunchGames();
    const mergedGames = [...discoverGames, ...localCuratedGames]
      .filter((game, index, array) => array.findIndex((item) => normalizeGameName(item.name) === normalizeGameName(game.name)) === index)
      .filter((game) => !isAlreadyReleasedGame(game))
      .map((game) => ({
        ...game,
        background: resolveCoverImage(game, game?.name),
        cover: resolveCoverImage(game, game?.name),
      }))
      .sort((first, second) => {
        const firstDate = new Date(first.released || '2100-01-01').getTime();
        const secondDate = new Date(second.released || '2100-01-01').getTime();
        return firstDate - secondDate;
      }).slice(0, 12);

    renderDiscoverGames(mergedGames);
    lastDiscoverRefresh = Date.now();
    if (discoverStatus) {
      discoverStatus.textContent = `${mergedGames.length} títulos actualizados`;
      discoverStatus.classList.remove('is-loading');
    }
  } catch {
    const localCuratedGames = await buildCuratedUpcomingLaunchGames();
    const fallbackGames = localCuratedGames
      .filter((game, index, array) => array.findIndex((item) => normalizeGameName(item.name) === normalizeGameName(game.name)) === index)
      .map((game) => ({
        ...game,
        background: resolveCoverImage(game, game?.name),
        cover: resolveCoverImage(game, game?.name),
      }));
    renderDiscoverGames(fallbackGames);
    if (discoverStatus) {
      discoverStatus.textContent = 'Novedades no disponibles';
      discoverStatus.classList.remove('is-loading');
    }
  }
};

const applyGames = (nextGames, sourceName) => {
  const safeNextGames = Array.isArray(nextGames) && nextGames.length ? nextGames : buildFallbackCatalog();
  const seenNames = new Set(safeNextGames.map((game) => normalizeGameName(game.name)));
  const catalogPlaceholders = selectedGameTitles
    .filter((name) => !seenNames.has(normalizeGameName(name)))
    .map((name) => ({
      name,
      url: game.website || '',
      cover: buildGeneratedCoverDataUrl(name),
      fallbackCover: buildGeneratedCoverDataUrl(name),
      rating: getGameRating({ name }),
      review: getGameReviewText({ name, platforms: ['PC'] }),
    }));

  const filteredGames = [...safeNextGames, ...catalogPlaceholders]
    .map((game) => {
      const localCover = LOCAL_COVER_MAP[normalizeGameName(game.name)];
      const localBackground = LOCAL_BACKGROUND_MAP[normalizeGameName(game.name)];
      const localScreenshots = LOCAL_SCREENSHOTS_MAP[normalizeGameName(game.name)];
      return {
        ...game,
        ...(localCover ? { cover: localCover, fallbackCover: localCover } : {}),
        ...(localBackground ? { background: localBackground } : {}),
        ...(localScreenshots ? { screenshots: localScreenshots } : {}),
        rating: getGameRating(game),
        review: getGameReviewText(game),
      };
    })
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
  renderHomeSummary();
  updateGenreFilter();
  setCatalogLoading(false, `${games.length} juegos disponibles`);
  void sourceName;
};

const normalizeIgdbCoverUrl = (cover) => {
  if (!cover || typeof cover !== 'string') return '';
  const url = cover.startsWith('//') ? `https:${cover}` : cover;
  return url.replace(/\/t_\w+\//, '/t_cover_big/');
};

const loadGamesFromApi = async () => {
  setCatalogLoading(true, 'Cargando juegos...');
  const localLinks = await readLinksCatalog();
  const fallbackGames = mergeCatalogEntries(localLinks, buildFallbackCatalog());
  applyGames(fallbackGames, 'catálogo inmediato');

  try {
    const rawgGames = await fetchRawgGames();
    const mappedGames = rawgGames.map((game) => ({
      name: game.name || game.rawgName || 'Sin nombre',
      rawgId: game.id || 0,
      url: '',
      cover: game.background_image || game.image || '',
      background: game.background_image_additional || game.background_image || '',
      description: game.description_raw || '',
      genres: Array.isArray(game.genres) ? game.genres.map((item) => item.name).filter(Boolean) : [],
      developers: Array.isArray(game.developers) ? game.developers.map((item) => item.name).filter(Boolean) : [],
      platforms: Array.isArray(game.platforms) ? game.platforms.map((item) => item.platform?.name).filter(Boolean) : [],
      released: game.released || '',
      rating: Number(game.rating) || 0,
      screenshots: Array.isArray(game.short_screenshots)
        ? game.short_screenshots.map((item) => item.image).filter(Boolean)
        : [],
      updated: false,
    })).filter((game) => game.name);

    const mergedGames = mergeCatalogEntries(localLinks, mappedGames);
    const linkedNames = new Set(mergedGames.map((game) => normalizeGameName(game.name)));
    const visibleGames = selectedGameTitles
      .filter((name) => !linkedNames.has(normalizeGameName(name)))
      .map((name) => ({ name, url: '' }));

    const finalGames = [...mergedGames, ...visibleGames];
    applyGames(finalGames, 'RAWG directo');
    setTimeout(() => loadGameCovers(), 0);
  } catch {
    if (API_CONFIG.useFallback) {
      applyGames(fallbackGames, 'catálogo seguro');
    }
  }
};

const loadGamesFromLinks = async () => {
  try {
    let markdownText = LOCAL_LINKS_MARKDOWN;

    try {
      const response = await fetch('Links/Links PC.md', { cache: 'no-store' });
      if (response.ok) {
        markdownText = await response.text();
      }
    } catch (fetchError) {
      console.warn('No se pudo leer Links PC.md desde archivo local; usando catálogo local seguro.', fetchError.message);
    }

    const gamesFromLinks = parseLinksMarkdown(markdownText);
    const finalGames = gamesFromLinks.length ? gamesFromLinks : buildFallbackCatalog();

    const linkedNames = new Set(finalGames.map((game) => normalizeGameName(game.name)));
    const visibleGames = selectedGameTitles
      .filter((name) => !linkedNames.has(normalizeGameName(name)))
      .map((name) => ({ name, url: '', cover: buildGeneratedCoverDataUrl(name), fallbackCover: buildGeneratedCoverDataUrl(name) }));

    applyGames([...finalGames, ...visibleGames], 'catálogo local');
  } catch (error) {
    console.error('No se pudo cargar Links PC.md:', error.message);
    applyGames(buildFallbackCatalog(), 'catálogo local');
  }
};

const loadPlatformLists = async () => {
  nintendoGames = await readNintendoLinksCatalog();
  phoneGames = await readPhoneLinksCatalog();

  try {
    xboxGames = await readPlatformSpecificCatalog(
      'Links/Links Xbox.md',
      'Xbox',
      'xbox-emulators',
      {
        'xbox emulators': 'https://www.google.com/s2/favicons?sz=256&domain=xbox.com',
        xemu: 'https://www.google.com/s2/favicons?sz=256&domain=xemu.app',
        xenia: 'https://www.google.com/s2/favicons?sz=256&domain=xenia.jp',
        'cxbx reloaded': 'https://www.google.com/s2/favicons?sz=256&domain=github.com',
      }
    );
  } catch {
    xboxGames = [];
  }

  try {
    playStationGames = await readPlatformSpecificCatalog(
      'Links/Links Play Station.md',
      'PlayStation',
      'playstation-emulators',
      {
        'playstation emulators': 'https://www.google.com/s2/favicons?sz=256&domain=playstation.com',
        pcsx2: 'https://www.google.com/s2/favicons?sz=256&domain=pcsx2.net',
        duckstation: 'https://www.google.com/s2/favicons?sz=256&domain=duckstation.org',
        rpcs3: 'https://www.google.com/s2/favicons?sz=256&domain=rpcs3.net',
        shadps4: 'https://www.google.com/s2/favicons?sz=256&domain=shadps4.net',
        kyty: 'https://github.githubassets.com/favicons/favicon.svg',
        retroarch: 'https://www.google.com/s2/favicons?sz=256&domain=retroarch.com',
      }
    );
  } catch {
    playStationGames = [];
  }

  const apiKey = (RAWG_CREDENTIALS.apiKey || '').trim();
  if (apiKey && apiKey !== 'TU_RAWG_API_KEY') {
    const enrichPlatformCovers = async (catalog) => Promise.all(catalog.map(async (game) => {
      if (game.category !== 'games') return game;

      try {
        const response = await fetch(`https://api.rawg.io/api/games?key=${encodeURIComponent(apiKey)}&search=${encodeURIComponent(game.name)}&page_size=1`, { cache: 'force-cache' });
        if (!response.ok) return game;

        const data = await response.json();
        const result = data.results?.[0];
        if (!result?.background_image) return game;

        return {
          ...game,
          rawgId: result.id || 0,
          cover: result.background_image,
          background: result.background_image_additional || result.background_image,
          fallbackCover: game.fallbackCover,
        };
      } catch {
        return game;
      }
    }));

    nintendoGames = await enrichPlatformCovers(nintendoGames);
    playStationGames = await enrichPlatformCovers(playStationGames);
    xboxGames = await enrichPlatformCovers(xboxGames);
  }

  renderGameCatalog('gameCatalogLibrary', getLibraryGames());
  renderFavoritesCatalog();
  updateCatalogEmptyStates();
  updateProfileStats();
  renderPlatformCatalog();
};

const renderGameCatalog = (containerId, catalogGames = games) => {
  const container = document.getElementById(containerId);
  if (!container) return;

  const visibleGames = catalogGames.slice(0, MAX_RENDERED_GAMES);
  container.innerHTML = visibleGames.map((game) => {
    const generatedCover = buildGeneratedCoverDataUrl(game.name);
    const coverSource = getSafeAssetUrl(game.cover, generatedCover);
    const isLogoAsset = /\/logo\.png(?:\?.*)?$/i.test(coverSource) || /\/logo\.[a-z0-9]+(?:\?.*)?$/i.test(coverSource) || /\/named_logo\.[a-z0-9]+(?:\?.*)?$/i.test(coverSource) || /google\.com\/s2\/favicons/i.test(coverSource);
    const isBlueStacks = game.category === 'phone-emulators' && normalizeGameName(game.name) === 'bluestacks';
    const isPhoneEmulator = game.category === 'phone-emulators';
    const hasDownload = Boolean(getSafeExternalUrl(game.url));
    const hasUpdate = Boolean(game.updated || game.updateUrl || game.updateInfo);
    const genreLabel = getGameCategories(game)[0] || 'Catálogo NEXORT';
    const ratingValue = getGameRating(game);
    const ratingLabel = `★ ${ratingValue.toFixed(1)}`;
    const actionMarkup = hasDownload
      ? `<a class="primary-button download-link" href="${escapeHtml(getSafeExternalUrl(game.url))}" target="_blank" rel="noopener noreferrer" data-game="${escapeHtml(game.name)}">Descargar</a>`
      : `<button class="secondary-button pending-button" type="button" disabled>PENDIENTE</button>`;
    const updateMarkup = hasUpdate
      ? `<div class="update-badge" title="${escapeHtml(game.updateInfo || 'Hay una actualización disponible.')}" role="status">Actualización disponible${game.updateInfo ? ` · ${escapeHtml(game.updateInfo)}` : ''}${getSafeExternalUrl(game.updateUrl) ? ` <a href="${escapeHtml(getSafeExternalUrl(game.updateUrl))}" target="_blank" rel="noopener noreferrer">Abrir</a>` : ''}</div>`
      : '';
    const isNintendoGame = game.category === 'games' && game.platforms?.includes('Nintendo');
    const extraActionsMarkup = isNintendoGame
      ? `
        ${getSafeExternalUrl(game.updatesUrl) ? `<a class="primary-button content-link" href="${escapeHtml(getSafeExternalUrl(game.updatesUrl))}" target="_blank" rel="noopener noreferrer">Actualizaciones</a>` : '<button class="secondary-button pending-button content-link" type="button" disabled>Actualizaciones</button>'}
        ${getSafeExternalUrl(game.dlcUrl) ? `<a class="primary-button content-link" href="${escapeHtml(getSafeExternalUrl(game.dlcUrl))}" target="_blank" rel="noopener noreferrer">DLC</a>` : '<button class="secondary-button pending-button content-link" type="button" disabled>DLC</button>'}
      `
      : isBlueStacks
        ? `
          <div class="bluestacks-version-row">
            ${getSafeExternalUrl(game.versionFiveUrl) ? `<a class="primary-button content-link bluestacks-version" href="${escapeHtml(getSafeExternalUrl(game.versionFiveUrl))}" target="_blank" rel="noopener noreferrer">BlueStacks 5</a>` : '<button class="secondary-button pending-button content-link bluestacks-version" type="button" disabled>BlueStacks 5</button>'}
            ${getSafeExternalUrl(game.versionTenUrl) ? `<a class="primary-button content-link bluestacks-version" href="${escapeHtml(getSafeExternalUrl(game.versionTenUrl))}" target="_blank" rel="noopener noreferrer">BlueStacks 10</a>` : '<button class="secondary-button pending-button content-link bluestacks-version" type="button" disabled>BlueStacks 10</button>'}
          </div>
          <div class="bluestacks-download-row">${actionMarkup}</div>
        `
      : game.category === 'emulators' && (game.keysUrl || game.firmwareUrl || game.usbHelperUrl)
        ? `
          ${getSafeExternalUrl(game.keysUrl || game.firmwareUrl) ? `<a class="primary-button content-link combined-content-link" href="${escapeHtml(getSafeExternalUrl(game.keysUrl || game.firmwareUrl))}" target="_blank" rel="noopener noreferrer">Keys and Firmware</a>` : ''}
          ${getSafeExternalUrl(game.usbHelperUrl) ? `<a class="primary-button content-link combined-content-link" href="${escapeHtml(getSafeExternalUrl(game.usbHelperUrl))}" target="_blank" rel="noopener noreferrer">USB Helper</a>` : ''}
        `
        : isPhoneEmulator
          ? `
            <div class="phone-emulator-actions">
              ${getSafeExternalUrl(game.url) ? `<a class="primary-button content-link combined-content-link" href="${escapeHtml(getSafeExternalUrl(game.url))}" target="_blank" rel="noopener noreferrer">Descargar</a>` : '<button class="secondary-button pending-button content-link combined-content-link" type="button" disabled>Descargar</button>'}
            </div>
          `
          : '';

    return `
      <div class="game-row${['games', 'emulators', 'phone-emulators', 'xbox-emulators', 'playstation-emulators'].includes(game.category) ? ' content-game-row' : ''}" tabindex="0" aria-label="Abrir detalles de ${escapeHtml(game.name)}">
        <div class="game-cover loading" aria-label="Logo de ${game.name}">
          <img src="${escapeHtml(coverSource)}" class="${isLogoAsset ? 'game-logo' : ''}" data-fallback="${escapeHtml(getSafeAssetUrl(game.fallbackCover, generatedCover))}" alt="Logo de ${escapeHtml(game.name)}" loading="lazy">
        </div>
        <div class="game-name-block">
          <span class="game-name">${escapeHtml(game.name)}</span>
          <span class="game-subtitle">${escapeHtml(genreLabel)}${ratingLabel ? ` · ${ratingLabel}` : ''}</span>
          ${updateMarkup}
        </div>
        <div class="game-actions${isBlueStacks ? ' bluestacks-actions' : ''}">
          ${isBlueStacks || isPhoneEmulator ? '' : actionMarkup}
          ${extraActionsMarkup}
        </div>
        <button class="secondary-button icon-button library-toggle${state.library.has(game.name) ? ' is-active' : ''}" type="button" aria-pressed="${state.library.has(game.name)}" aria-label="${state.library.has(game.name) ? 'Quitar de biblioteca' : 'Agregar a biblioteca'}" title="${state.library.has(game.name) ? 'Quitar de biblioteca' : 'Agregar a biblioteca'}">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 3.5A2.5 2.5 0 0 1 7.5 1H20v18H7.5A2.5 2.5 0 0 0 5 21.5v-18ZM7.5 3a.5.5 0 0 0-.5.5v12.1c.16-.06.33-.1.5-.1H18V3H7.5Z"/></svg>
        </button>
        <button class="secondary-button icon-button favorite-toggle${state.favorites.has(game.name) ? ' is-active' : ''}" type="button" aria-pressed="${state.favorites.has(game.name)}" aria-label="${state.favorites.has(game.name) ? 'Quitar favorito' : 'Agregar a favoritos'}" title="${state.favorites.has(game.name) ? 'Quitar favorito' : 'Agregar a favoritos'}">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 21-1.45-1.32C5.4 15.36 2 12.28 2 8.5A4.5 4.5 0 0 1 6.5 4c1.74 0 3.41.81 4.5 2.09A6.05 6.05 0 0 1 15.5 4 4.5 4.5 0 0 1 20 8.5c0 3.78-3.4 6.86-8.55 11.18L12 21Z"/></svg>
        </button>
      </div>
    `;
  }).join('');

  if (catalogGames.length > MAX_RENDERED_GAMES) {
    container.insertAdjacentHTML('beforeend', `<p class="catalog-limit" role="status">Mostrando ${MAX_RENDERED_GAMES} de ${catalogGames.length} resultados. Usa el buscador para afinar.</p>`);
  }

  container.querySelectorAll('img[data-fallback]').forEach((image) => {
    image.addEventListener('error', () => {
      const fallback = image.dataset.fallback;
      if (fallback && image.src !== fallback) {
        image.src = fallback;
        image.classList.remove('game-logo');
        return;
      }

      const cover = image.closest('.game-cover');
      const fallbackLabel = document.createElement('span');
      fallbackLabel.textContent = getCoverFallbackText(cover?.getAttribute('aria-label')?.replace('Portada de ', '') || 'Juego');
      if (cover) {
        cover.innerHTML = '';
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
  const matches = getAllCatalogGames().filter((game) => {
    const matchesQuery = query ? game.name.toLowerCase().includes(query) : false;
    return matchesQuery;
  });
  renderGameCatalog('gameCatalogExplore', matches);
  if (exploreEmpty) {
    const hasSearch = Boolean(query);
    exploreEmpty.style.display = hasSearch && matches.length ? 'none' : '';
    if (hasSearch && !matches.length) {
      exploreEmpty.querySelector('h2').textContent = 'Sin resultados';
      exploreEmpty.querySelector('p').textContent = 'No encontramos juegos con ese nombre.';
    } else {
      exploreEmpty.querySelector('h2').textContent = 'Busca un juego';
      exploreEmpty.querySelector('p').textContent = 'Escribe el nombre del juego para buscarlo en el catálogo.';
    }
  }
};

const renderFavoritesCatalog = () => {
  const favoriteGames = getAllCatalogGames().filter((game) => state.favorites.has(game.name));
  renderGameCatalog('gameCatalogFavorites', favoriteGames);

  const emptyState = document.getElementById('favoritesEmpty');
  if (emptyState) emptyState.style.display = favoriteGames.length ? 'none' : '';
};

const renderNintendoCatalog = () => {
  const container = document.getElementById('gameCatalogPlatforms');
  if (!container) return;

  const emulators = nintendoGames.filter((game) => game.category === 'emulators');
  const amiibos = nintendoGames.filter((game) => game.category === 'amiibos');
  const titles = nintendoGames.filter((game) => !['emulators', 'amiibos'].includes(game.category));
  const switchEmulators = emulators.filter((game) => game.emulatorPlatform === 'Nintendo Switch');
  const activeEmulators = switchEmulators.filter((game) => game.emulatorStatus === 'Activos');
  const discontinuedEmulators = switchEmulators.filter((game) => game.emulatorStatus === 'Descontinuados');
  const ungroupedSwitchEmulators = switchEmulators.filter((game) => !['Activos', 'Descontinuados'].includes(game.emulatorStatus));
  const wiiUEmulators = emulators.filter((game) => game.emulatorPlatform === 'Wii U');
  container.innerHTML = `
    ${switchEmulators.length ? '<h2 class="platform-section-title">Emuladores de Nintendo Switch</h2>' : ''}
    ${ungroupedSwitchEmulators.length ? '<div id="nintendoSwitchEmulators" class="catalog-list"></div>' : ''}
    ${activeEmulators.length ? '<h2 class="platform-section-title">Activos</h2><div id="nintendoActiveEmulators" class="catalog-list"></div>' : ''}
    ${discontinuedEmulators.length ? '<h2 class="platform-section-title">Descontinuados</h2><div id="nintendoDiscontinuedEmulators" class="catalog-list"></div>' : ''}
    ${wiiUEmulators.length ? '<h2 class="platform-section-title">Emuladores de Wii U para PC</h2><div id="nintendoWiiUEmulators" class="catalog-list"></div>' : ''}
    ${amiibos.length ? '<h2 class="platform-section-title">Amiibo</h2><div id="nintendoAmiibos" class="catalog-list"></div>' : ''}
    ${titles.length ? '<h2 class="platform-section-title">Juegos</h2><div id="nintendoGames" class="catalog-list"></div>' : ''}
  `;

  if (ungroupedSwitchEmulators.length) renderGameCatalog('nintendoSwitchEmulators', ungroupedSwitchEmulators);
  if (activeEmulators.length) renderGameCatalog('nintendoActiveEmulators', activeEmulators);
  if (discontinuedEmulators.length) renderGameCatalog('nintendoDiscontinuedEmulators', discontinuedEmulators);
  if (wiiUEmulators.length) renderGameCatalog('nintendoWiiUEmulators', wiiUEmulators);
  if (amiibos.length) renderGameCatalog('nintendoAmiibos', amiibos);
  if (titles.length) renderGameCatalog('nintendoGames', titles);
  return nintendoGames;
};

const renderPlatformSpecificCatalog = (platformName, items) => {
  const container = document.getElementById('gameCatalogPlatforms');
  if (!container) return [];

  const parsedItems = Array.isArray(items) ? items : [];
  const platformGames = parsedItems.filter((item) => item.category === 'games');
  const groupedItems = parsedItems.reduce((groups, item) => {
    if (item.category === 'games') return groups;
    const groupName = item.platformGroup || 'Emuladores';
    if (!groups.has(groupName)) groups.set(groupName, []);
    groups.get(groupName).push(item);
    return groups;
  }, new Map());

  const emulatorHeading = platformName === 'PlayStation' && groupedItems.size
    ? '<h2 class="platform-section-title platform-group-heading">Emuladores</h2>'
    : '';
  const emulatorMarkup = [...groupedItems.keys()].map((groupName, index) => `
    <section class="platform-emulator-group">
      <h2 class="platform-section-title">${escapeHtml(groupName)}</h2>
      <div id="${platformName.toLowerCase()}PlatformList${index}" class="catalog-list"></div>
    </section>
  `).join('');
  const gamesMarkup = platformGames.length ? `
    <section class="platform-games-group">
      <h2 class="platform-section-title">Juegos</h2>
      <div id="${platformName.toLowerCase()}GamesList" class="catalog-list"></div>
    </section>
  ` : '';

  container.innerHTML = `${emulatorHeading}${emulatorMarkup}${gamesMarkup}`;

  [...groupedItems.entries()].forEach(([groupName, groupItems], index) => {
    renderGameCatalog(`${platformName.toLowerCase()}PlatformList${index}`, groupItems);
  });
  if (platformGames.length) renderGameCatalog(`${platformName.toLowerCase()}GamesList`, platformGames);
  return parsedItems;
};

const renderPlatformCatalog = () => {
  const selectedPlatform = state.activePlatform;
  const platformCatalogTitle = document.getElementById('platformCatalogTitle');
  if (platformCatalogTitle) {
    const hasGroupedSections = ['Nintendo', 'Telefono', 'Xbox', 'PlayStation'].includes(selectedPlatform);
    platformCatalogTitle.textContent = 'Juegos';
    platformCatalogTitle.style.display = hasGroupedSections ? 'none' : '';
  }

  let platformGames = [];

  if (selectedPlatform === 'Telefono') {
    platformGames = phoneGames;
  } else if (selectedPlatform === 'Xbox') {
    platformGames = xboxGames;
  } else if (selectedPlatform === 'PlayStation') {
    platformGames = playStationGames;
  } else if (selectedPlatform === 'Nintendo') {
    platformGames = renderNintendoCatalog();
  } else if (selectedPlatform === 'all') {
    platformGames = games;
  } else {
    platformGames = games.filter((game) => {
      const platforms = Array.isArray(game.platforms) ? game.platforms : [];
      return platforms.some((platform) => {
        const name = String(platform).toLowerCase();
        return name.includes(selectedPlatform.toLowerCase());
      });
    });
  }

  if (['Telefono', 'Xbox', 'PlayStation'].includes(selectedPlatform)) {
    renderPlatformSpecificCatalog(selectedPlatform, platformGames);
  } else if (selectedPlatform !== 'Nintendo') {
    renderGameCatalog('gameCatalogPlatforms', platformGames);
  }
  const emptyState = document.getElementById('platformsEmpty');
  if (emptyState) emptyState.style.display = platformGames.length ? 'none' : '';
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
    <div><strong>${state.recentGames.length}</strong><span>Recientes</span></div>
  `;
};

const updateProfileIdentity = (name) => {
  const cleanName = String(name || '').trim();
  const initial = cleanName.charAt(0).toUpperCase() || 'N';
  if (profileHeading) profileHeading.textContent = cleanName || 'Tu perfil';
  if (profileAvatarInitial) profileAvatarInitial.textContent = initial;
  if (profileAvatar) {
    const avatarUrl = storageReadValue('nexort-profile-avatar');
    profileAvatar.style.backgroundImage = avatarUrl
      ? `linear-gradient(135deg, rgba(4, 18, 29, 0.14), rgba(4, 18, 29, 0.14)), url("${avatarUrl}")`
      : '';
    profileAvatar.classList.toggle('has-image', Boolean(avatarUrl));
  }
  if (profileActivity) {
    const savedAt = storageReadValue('nexort-profile-updated-at');
    profileActivity.textContent = savedAt
      ? `Última actualización: ${new Date(savedAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}`
      : 'Aún no has guardado cambios.';
  }
};

const escapeHtml = (value = '') => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#039;');

const getSafeExternalUrl = (value) => {
  const rawValue = String(value || '').trim();
  if (!/^https?:\/\//i.test(rawValue)) return '';

  try {
    const url = new URL(rawValue);
    return ['http:', 'https:'].includes(url.protocol) ? url.href : '';
  } catch {
    return '';
  }
};

const getSafeAssetUrl = (value, fallback = '') => {
  const rawValue = String(value || '').trim();
  if (rawValue.startsWith('data:image/')) return rawValue;
  return getSafeExternalUrl(rawValue) || fallback;
};

const REAL_GAME_RATINGS = {
  'among us': 4.4,
  'ark survival ascended': 4.1,
  'ark survival evolved': 4.2,
  'assassins creed ii': 4.7,
  'assassins creed valhalla': 4.6,
  'assassins creed odyssey': 4.5,
  'assassins creed origins': 4.6,
  'assassins creed syndicate': 4.3,
  'avatar frontiers of pandora': 3.8,
  'battlefield v': 4.1,
  'black myth wukong': 4.7,
  'call of duty modern warfare': 4.3,
  'call of duty modern warfare iii': 3.7,
  'cyberpunk 2077': 4.0,
  'elden ring': 4.9,
  'fallout 4': 4.5,
  'forza horizon 5': 4.8,
  'gears 5': 4.4,
  'god of war': 4.8,
  'god of war ragnarok': 4.8,
  'grand theft auto v': 4.9,
  'halo infinite': 4.4,
  'hollow knight': 4.8,
  'no mans sky': 4.3,
  'phasmophobia': 4.5,
  'project zomboid': 4.3,
  'ready or not': 4.4,
  'red dead redemption 2': 4.9,
  'resident evil 4': 4.8,
  'rust': 4.2,
  'subnautica': 4.6,
  'subnautica below zero': 4.3,
  'the last of us part ii remastered': 4.8,
  'tomb raider game of the year': 4.5,
  'valheim': 4.5,
  'the forest': 4.1,
  'sons of the forest': 3.9,
  'dayz': 3.8,
  'dead by daylight': 3.9,
  'dead space': 4.6,
  'doom': 4.7,
  'doom eternal': 4.8,
  'doom the dark ages': 4.2,
  'dark souls remastered': 4.5,
  'dark souls ii': 4.3,
  'dark souls ii scholar of the first sin': 4.4,
  'dark souls iii': 4.7,
  'metro exodus': 4.5,
  'metro 2033 redux': 4.4,
  'metro last light redux': 4.5,
  'need for speed heat': 4.0,
  'need for speed most wanted': 4.5,
  'need for speed rivals': 4.1,
  'roadcraft': 3.9,
  'shadow of the tomb raider definitive edition': 4.4,
  'solo leveling arise overdrive': 4.2,
  'stranded deep': 3.8,
  'raft': 4.1,
  'the forest': 4.1,
  '7 days to die': 4.0,
};

const REAL_GAME_REVIEWS = {
  'among us': 'Among Us es un juego de estrategia social que convierte cada partida en una mezcla de tensión, humor y lectura de comportamiento. La clave está en la comunicación: aunque el sistema es simple, la forma en que cada persona interpreta la información hace que cada sesión sea distinta y muy repleta de momentos inolvidables.',
  'ark survival evolved': 'ARK: Survival Evolved se siente como una aventura de supervivencia brutal, pero a la vez muy gratificante. La sensación de estar construyendo una base, domesticando criaturas y avanzando poco a poco en un mundo hostil es decisiva; es un juego de paciencia, planificación y enorme escala.',
  'ark survival ascended': 'ARK: Survival Ascended busca modernizar la experiencia de supervivencia con mejor rendimiento visual y una presentación más pulida. Sigue manteniendo esa mezcla de exploración, craftero y combate contra criaturas gigantes que convierte cada partida en un reto muy tangible.',
  'assassins creed ii': 'Assassin’s Creed II mejora la base del original con una historia más sólida, un mejor ritmo y una sensación de libertad mucho mayor. La ciudad de Florencia y las misiones de infiltración hacen que cada paso del juego se sienta elegante, emocionante y muy bien trabajado.',
  'assassins creed valhalla': 'Assassin’s Creed Valhalla ofrece una aventura épica con un mundo enorme, decisiones de progresión muy relevantes y una gran dosis de inmersión escandinava. Aunque es un juego muy grande, su mejor virtud es cómo logra que cada viaje por Noruega y más allá se sienta significativo.',
  'assassins creed odyssey': 'Assassin’s Creed Odyssey destaca por su libertad de exploración y por su enorme capacidad para hacerte sentir protagonista de una historia de mitología y conspiración. El combate es más dinámico que en entregas anteriores y la sensación de aventura se mantiene muy alta durante largas horas.',
  'assassins creed origins': 'Assassin’s Creed Origins reinventa la saga con un tono más profundo y un sistema de combate más visceral. La estructura de mundo abierto funciona muy bien para explorar Egipto, descubrir historias y sentir que cada batalla tiene peso y estilo.',
  'assassins creed syndicate': 'Assassin’s Creed Syndicate aporta una Inglaterra victoriana muy bien lograda y una buena variedad de misiones. El rumbo más urbano y la dualidad de los protagonistas le dan personalidad, aunque la entrega se siente más accesible que ambiciosa.',
  'battlefield v': 'Battlefield V recupera el pulso de la guerra moderna con un enfoque más táctico y con una gran atención al contenido cooperativo y de equipo. La sensación de caos, destrucción y coordinación de squad sigue siendo uno de sus puntos más fuertes.',
  'black myth wukong': 'Black Myth: Wukong combina un arte muy llamativo con un combate ágil y muy satisfactorio. El juego hace que cada encuentro se sienta preciso y elegante, y la inspiración en mitología china da a la experiencia un carácter muy propio.',
  'cyberpunk 2077': 'Cyberpunk 2077 es una aventura enorme, muy detallada y muy marcada por el estilo de vida nocturna de Night City. Aunque tiene sus altibajos, su ambientación, la historia y la libertad de diseño lo convierten en una experiencia memorable para quienes buscan un RPG muy particular.',
  'elden ring': 'Elden Ring se entiende como una obra de gran escala y dirección muy clara. El mundo es enorme, la exploración es gratificante y cada encuentro tiene una sensación de riesgo y recompensa que hace que avanzar siempre valga la pena.',
  'fallout 4': 'Fallout 4 ofrece mucha libertad para crear tu propia historia dentro de un entorno enorme y muy reconocible. Sus momentos de exploración, construcción y decisiones de supervivencia tienen una gran fuerza, especialmente para quien disfruta del estilo de juego más abierto y libre.',
  'forza horizon 5': 'Forza Horizon 5 es una de las mejores experiencias arcade de conducción actuales. La sensación de velocidad, la variedad de coches y la energía del mundo abierto son tan buenas que el juego se disfruta casi sin esfuerzo, incluso para jugadores casuales.',
  'gears 5': 'Gears 5 entiende muy bien la intensidad del combate y la dinámica de equipo. La campaña es sólida, los momentos de acción son muy impactantes y el juego mantiene un equilibrio fuerte entre espectáculo y jugabilidad.',
  'god of war': 'God of War redefine la franquicia con una historia más emocional, un diseño visual excepcional y una exploración que se siente muy madura. El combate sigue siendo excelente, pero el gran acierto es cómo combina brutalidad con una narrativa muy sólida.',
  'god of war ragnarok': 'God of War Ragnarök amplía todo lo bueno de su predecesor con un mundo más rico, más momentos de tensión y una campaña increíblemente pulida. Es una obra de acción con gran peso narrativo y una ejecución impecable.',
  'grand theft auto v': 'Grand Theft Auto V sigue siendo una referencia por la libertad que ofrece y por la cantidad de contenido que tiene. La variedad de misiones, la calidad de su mundo abierto y la sensación de vivir una ciudad enorme convierten la experiencia en una de las más completas del género.',
  'halo infinite': 'Halo Infinite reúne la velocidad de una campaña de Halo con un diseño de niveles más abierto y dinámico. Aunque cada entrega tiene su propia identidad, este juego destaca por su sensación de exploración, su combate y por ofrecer una experiencia muy satisfactoria para fans de la saga.',
  'hollow knight': 'Hollow Knight logra combinar un arte fantástico con una dificultad precisa y muy satisfactoria. El juego es un ejemplo de cómo la exploración y la progresión pueden crear una experiencia muy intensa sin necesidad de grandes cantidades de texto o explicaciones.',
  'no mans sky': 'No Man’s Sky se ha convertido en un ejemplo de evolución constante, transformándose en un juego de exploración mucho más completo de lo que parecía al inicio. La sensación de descubrir nuevos planetas, recursos y paisajes es una de sus mayores fortalezas.',
  'phasmophobia': 'Phasmophobia funciona muy bien porque convierte la tensión en una experiencia cooperativa y muy social. Lo más interesante es la mezcla de investigación, miedo y comunicación; cada partida puede ser completamente distinta según el grupo y la forma de interpretar la evidencia.',
  'project zomboid': 'Project Zomboid es un supervivencia muy exigente y muy realista que entiende a la perfección que el verdadero reto no es solo sobrevivir a los zombis, sino también a la desesperación y a las decisiones del día a día. Su propuesta es muy intensa para quienes disfrutan del juego lento y táctico.',
  'ready or not': 'Ready or Not se centra en la tensión táctica y en la toma de decisiones bajo presión. Tiene un estilo muy serio y muy específico, perfecto para jugadores que disfrutan de la planificación, la coordinación y los escenarios de mando exigentes.',
  'red dead redemption 2': 'Red Dead Redemption 2 destaca por la calidad de su mundo, el peso de cada decisión y la inmersión que ofrece en casi todos sus momentos. Es una obra que consigue ser enorme sin perder la personalidad, y la sensación de vivir en ese entorno es uno de sus mayores logros.',
  'resident evil 4': 'Resident Evil 4 se mantiene vigente por su gran equilibrio entre tensión, acción y diseño de niveles. Es un juego muy bien afinado, donde cada encuentro funciona como una prueba de control y decisión bajo presión.',
  'rust': 'Rust es una experiencia de supervivencia muy dura, orientada a la gestión del riesgo constante y a la toma de decisiones difíciles. Su fuerza está en la competencia social y en la sensación de que cada recurso, cada base y cada amenaza cuentan de verdad.',
  'subnautica': 'Subnautica pone el foco en la exploración submarina, la creatividad y la sensación de vulnerabilidad constante. Es un juego de supervivencia con un enorme atractivo visual y una progresión muy satisfactoria para quien disfruta de la aventura tranquila pero intensa.',
  'subnautica below zero': 'Subnautica: Below Zero mantiene la esencia de la exploración bajo el hielo y añade una atmósfera muy distinta, más fría y aislada. La sensación de descubrimiento sigue siendo su seña más clara, aunque con un enfoque más intenso y más contemplativo.',
  'the last of us part ii remastered': 'The Last of Us Part II Remastered ofrece una experiencia cinematográfica muy bien construida, con una narrativa intensa y un pulso de juego muy preciso. La dirección artística y el acabado técnico elevan la experiencia a un nivel muy alto.',
  'tomb raider game of the year': 'Tomb Raider: Game of the Year se mantiene como una excelente aventura de acción y exploración. La historia, el movimiento y la sensación de supervivencia hacen que cada entorno se disfrute con una tensión muy buena.',
  'valheim': 'Valheim funciona muy bien como una experiencia de supervivencia con una identidad clara y muy accesible. La sensación de avanzar en una aventura nórdica a base de trabajo, construcción y lucha contra criaturas mitológicas es muy poderosa y muy adictiva.',
  'the forest': 'The Forest resulta muy eficaz como experiencia de supervivencia con una tensión muy constante. La mezcla entre exploración, gestión de recursos y amenaza permanente hace que cada sesión se sienta urgente y muy intensa.',
  'sons of the forest': 'Sons of the Forest repite la idea base de supervivencia con una sensación más moderna y visualmente más pulida. Su mayor atractivo está en la mezcla de exploración, peligro constante y esa sensación de incertidumbre cada vez que se adentra más en el bosque.',
  'dayz': 'DayZ pone el foco en la supervivencia extrema y en la tensión constante entre jugadores. Su mayor atractivo es la imprevisibilidad, porque cada encuentro puede cambiarlo todo y la sensación de riesgo siempre está presente.',
  'dead by daylight': 'Dead by Daylight funciona muy bien como juego de tensión y estrategias sociales. Cada partida se vive como una mezcla de persecución, improvisación y lectura del comportamiento del rival, algo que hace que el horror psicológico entre siempre en juego.',
  'dead space': 'Dead Space destaca por su tensión constante, su narrativa de ciencia ficción inquietante y una dirección de juego muy sólida. El diseño de los encuentros y la sensación de vulnerabilidad hacen que cada sección se sienta muy intensa.',
  'doom': 'DOOM es un ejemplo claro de cómo una estructura simple puede llegar a ser extraordinaria. El juego vive del ritmo, del movimiento y del placer de destruir hordas sin perder velocidad ni claridad.',
  'doom eternal': 'DOOM Eternal lleva la energía del original a un nivel superior con un movimiento más agresivo y un ritmo frenético. Está lleno de momentos de acción pura y muy pocos descansos, algo que funciona increíblemente bien para quien busca intensidad constante.',
  'doom the dark ages': 'DOOM: The Dark Ages toma la fórmula de la serie y la reinterpreta con un estilo más pesado y más teatral. La sensación de poder es enorme y la entrega mantiene ese componente brutal que siempre ha definido la franquicia.',
  'dark souls remastered': 'Dark Souls: Remastered conserva la esencia brutal y elegante de la obra maestra original, pero con una presentación más nítida y una experiencia más accesible para quienes desean revivir la historia de Lordran con una mejor claridad visual.',
  'dark souls ii': 'Dark Souls II ofrece un recorrido más libre y más experimental, con enemigos pesados, una estructura de mundo distinta y una sensación de peligro constante que hace que cada paso se sienta muy significativo.',
  'dark souls ii scholar of the first sin': 'Dark Souls II: Scholar of the First Sin reúne el mejor de la aventura principal con una mejora de dificultad, más enemigos y un conjunto de ajustes que hacen que el mundo sea aún más desafiante y memorable.',
  'dark souls iii': 'Dark Souls III cierra la trilogía con una velocidad más agresiva, un combate más técnico y un sentido de final épico que encaja perfectamente con la esencia de la saga. Es una conclusión brillante y muy satisfactoria para fanáticos del desafío.',
  'metro exodus': 'Metro Exodus ofrece una aventura postapocalíptica muy bien construida, con un estilo de supervivencia más libre y un mundo que invita a explorar. La combinación de atmosférica, tensión y narrativa hace que cada zona tenga una personalidad muy marcada.',
  'metro 2033 redux': 'Metro 2033 Redux propone un viaje oscuro y claustrofóbico que se apoya mucho en la tensión ambiental. Su estética, su mundo y la sensación de incomodidad lo convierten en un clásico muy recomendable para quienes disfrutan de la supervivencia de alto nivel.',
  'metro last light redux': 'Metro: Last Light Redux refina la fórmula de su antecesor con una narración más intensa y una experiencia técnica más pulida. Es un juego nervioso, atmosférico y muy bien construido, con una enorme sensación de aislamiento.',
  'need for speed heat': 'Need for Speed Heat equilibra la velocidad con la tensión de la noche y la policía, creando una experiencia muy dinámica. La sensación de carrera, la personalización y la energía del mundo hacen que el juego se disfrute muy bien en modo arcade.',
  'need for speed most wanted': 'Need for Speed: Most Wanted es una entrega muy directa, intensa y llena de adrenalina. La sensación de velocidad, las persecuciones y la estructura de carreras competitivas hacen que cada punto del juego se sienta muy vivo.',
  'need for speed rivals': 'Need for Speed Rivals funciona porque mezcla muy bien la sensación de persecución con la posibilidad de jugar en ambos lados. Es un juego muy vibrante y muy centrado en que cada carrera se sienta agresiva y emocionante.',
  'roadcraft': 'RoadCraft se siente como una experiencia más contemplativa y de gestión del transporte, con un enfoque práctico y muy realista. La satisfacción viene de ver cómo tus decisiones impactan el progreso y la sensación de operación en un entorno muy específico.',
  'shadow of the tomb raider definitive edition': 'Shadow of the Tomb Raider se entiende como una aventura muy sólida, con mejores momentos de plataforma, exploración y acción. La energía del juego y la sensación de movimiento en entornos complejos hacen que destaque muy bien dentro de la franquicia.',
  'solo leveling arise overdrive': 'Solo Leveling: Arise Overdrive consigue combinar la energía del anime y el estilo de acción por rondas con una progresión muy accesible. Tiene un tono muy dinámico y una sensación de poder con muy poco esfuerzo.',
  'stranded deep': 'Stranded Deep se apoya mucho en la supervivencia y la sensación de aislamiento total. La aventura es más contemplativa que agresiva, pero el valor del juego está en la progresión constante y en cómo cada pequeño avance tiene una importancia real.',
  'raft': 'Raft es una experiencia muy buena para quienes disfrutan de construir, explorar y coordinar avances con una idea clara de supervivencia. El juego crea una fuerte sensación de progreso a medida que vas ampliando tu base y tus posibilidades.',
};

const getGameRating = (game) => {
  const explicitRating = Number(game?.rating);
  if (Number.isFinite(explicitRating) && explicitRating > 0) {
    return Math.min(5, Math.max(0, explicitRating));
  }

  const lookupName = normalizeGameName(game?.name || '');
  if (lookupName && REAL_GAME_RATINGS[lookupName]) {
    return Number(REAL_GAME_RATINGS[lookupName]);
  }

  const name = lookupName || '';
  if (!name) return 0;

  let hash = 0;
  for (let index = 0; index < name.length; index += 1) {
    hash = (hash * 31 + name.charCodeAt(index)) >>> 0;
  }

  const generatedScore = 3.2 + ((hash % 180) / 60);
  return Number(Math.min(5, generatedScore).toFixed(1));
};

const getGameReviewText = (game) => {
  const existingReview = typeof game?.review === 'string' ? game.review.trim() : '';
  if (existingReview) return existingReview;

  const lookupName = normalizeGameName(game?.name || '');
  if (lookupName && REAL_GAME_REVIEWS[lookupName]) {
    return REAL_GAME_REVIEWS[lookupName];
  }

  const rating = getGameRating(game);
  const genre = getGameCategories(game)[0] || 'acción';
  const platform = Array.isArray(game?.platforms) && game.platforms.length ? game.platforms[0] : 'PC';

  if (rating >= 4.5) {
    return `${game.name || 'Este juego'} destaca por su excelente equilibrio entre ${genre.toLowerCase()} y ${platform.toLowerCase()}, con una propuesta muy sólida y fácil de recomendar.`;
  }

  if (rating >= 3.5) {
    return `${game.name || 'Este juego'} ofrece una experiencia competente y entretenida dentro de ${genre.toLowerCase()}, con buen ritmo y valor para jugadores que buscan una propuesta fiable.`;
  }

  return `${game.name || 'Este juego'} es una opción más discreta en ${genre.toLowerCase()}, con ideas interesantes pero que se siente más como una experiencia funcional que imprescindible.`;
};

const formatReleaseDate = (date) => {
  if (!date) return 'Sin fecha';
  const parsedDate = new Date(`${date}T00:00:00`);
  return Number.isNaN(parsedDate.getTime()) ? date : parsedDate.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

const translateDescriptionToSpanish = async (description) => {
  const sourceText = String(description || '').trim();
  if (!sourceText) return '';
  if (translationCache.has(sourceText)) return translationCache.get(sourceText);

  try {
    const textToTranslate = sourceText.slice(0, 4500);
    const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=es&dt=t&q=${encodeURIComponent(textToTranslate)}`, { cache: 'force-cache' });
    if (!response.ok) return sourceText;

    const payload = await response.json();
    const translated = Array.isArray(payload?.[0])
      ? payload[0].map((part) => part?.[0] || '').join('').trim()
      : '';
    const result = translated || sourceText;
    translationCache.set(sourceText, result);
    return result;
  } catch {
    return sourceText;
  }
};

const fetchRawgDetails = async (game) => {
  if (!game || game.detailsLoaded) return;

  const emulatorCategories = ['emulators', 'phone-emulators', 'xbox-emulators', 'playstation-emulators', 'amiibos'];
  const isPlatformGame = game.category === 'games' || game.platformGroup?.toLowerCase().startsWith('juegos');
  const isEmulatorEntry = !isPlatformGame && emulatorCategories.includes(game.category);
  if (isEmulatorEntry) {
    game.detailsLoaded = true;
    if (state.activeView === 'details') showGameDetails(game);
    return;
  }

  const apiKey = (RAWG_CREDENTIALS.apiKey || '').trim();
  if (!apiKey || apiKey === 'TU_RAWG_API_KEY') {
    game.detailsLoaded = true;
    game.detailsError = true;
    if (state.activeView === 'details') showGameDetails(game);
    return;
  }

  try {
    if (!game.rawgId) {
      const variant = getRawgSearchVariants(game.name)[0];
      const searchResponse = await fetch(`https://api.rawg.io/api/games?key=${encodeURIComponent(apiKey)}&search=${encodeURIComponent(variant)}&page_size=1`, { cache: 'no-store' });
      if (!searchResponse.ok) throw new Error(`RAWG search failed: ${searchResponse.status}`);
      const searchData = await searchResponse.json();
      game.rawgId = searchData.results?.[0]?.id || 0;
      if (!game.rawgId) throw new Error('No RAWG match');
    }

    const response = await fetch(`https://api.rawg.io/api/games/${encodeURIComponent(game.rawgId)}?key=${encodeURIComponent(apiKey)}`, { cache: 'no-store' });
    if (!response.ok) throw new Error(`RAWG details failed: ${response.status}`);

    const details = await response.json();
    const rawDescription = details.description_raw || details.description || '';
    const cleanDescription = String(rawDescription)
      .replace(/<br\s*\/?\s*>/gi, ' ')
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    game.description = LOCAL_DESCRIPTION_MAP[normalizeGameName(game.name)] || cleanDescription || game.description || '';
    game.descriptionEs = await translateDescriptionToSpanish(game.description);
    game.genres = Array.isArray(details.genres) ? details.genres.map((item) => item.name).filter(Boolean) : game.genres || [];
    game.developers = Array.isArray(details.developers) ? details.developers.map((item) => item.name).filter(Boolean) : game.developers || [];
    game.platforms = Array.isArray(details.platforms) ? details.platforms.map((item) => item.platform?.name).filter(Boolean) : game.platforms || [];
    game.released = details.released || game.released || '';
    const localBackground = LOCAL_BACKGROUND_MAP[normalizeGameName(game.name)];
    game.background = localBackground || details.background_image_additional || details.background_image || game.background || '';
    const localScreenshots = LOCAL_SCREENSHOTS_MAP[normalizeGameName(game.name)];
    game.screenshots = localScreenshots || (Array.isArray(details.short_screenshots)
      ? details.short_screenshots.map((item) => item.image).filter(Boolean)
      : Array.isArray(details.screenshots) ? details.screenshots.map((item) => item.image).filter(Boolean) : game.screenshots || []);

    if (!game.screenshots.length) {
      const screenshotsResponse = await fetch(`https://api.rawg.io/api/games/${encodeURIComponent(game.rawgId)}/screenshots?key=${encodeURIComponent(apiKey)}&page_size=6`, { cache: 'no-store' });
      if (screenshotsResponse.ok) {
        const screenshotsData = await screenshotsResponse.json();
        game.screenshots = Array.isArray(screenshotsData.results)
          ? screenshotsData.results.map((item) => item.image).filter(Boolean)
          : [];
      }
    }

    game.detailsLoaded = true;
    game.detailsError = false;
    if (state.activeView === 'details') showGameDetails(game);
  } catch {
    game.detailsLoaded = true;
    game.detailsError = true;
    if (state.activeView === 'details') showGameDetails(game);
  }
};

const getFriendlyMetadataValue = (value, fallback = 'No disponible') => {
  if (Array.isArray(value)) {
    const normalized = value
      .map((item) => getFriendlyMetadataValue(item, ''))
      .filter(Boolean)
      .slice(0, 3);
    return normalized.length ? normalized.join(', ') : fallback;
  }

  if (value && typeof value === 'object') {
    return value.name || value.title || value.label || fallback;
  }

  if (typeof value === 'string' && value.trim()) {
    return value.trim();
  }

  return fallback;
};

const showGameDetails = (game) => {
  if (!detailsContent || !game) return;

  state.recentGames = [game.name, ...state.recentGames.filter((name) => name !== game.name)].slice(0, 6);
  storageSaveValue('nexort-recent-games', JSON.stringify(state.recentGames));
  renderHomeSummary();

  const isEdenEmulator = game.category === 'emulators' && normalizeGameName(game.name) === 'eden';
  const isPhoneEmulator = game.category === 'phone-emulators';
  const isPlatformGame = game.category === 'games' || game.platformGroup?.toLowerCase().startsWith('juegos');
  const isPlatformEmulator = !isPlatformGame && ['xbox-emulators', 'playstation-emulators'].includes(game.category);
  const canLoadGameDetails = isPlatformGame
    && Boolean((RAWG_CREDENTIALS.apiKey || '').trim())
    && RAWG_CREDENTIALS.apiKey !== 'TU_RAWG_API_KEY';
  const background = isEdenEmulator
    ? 'https://eden-emu.dev/assets/logos/named_logo.png'
    : getSafeAssetUrl(game.background || game.cover, buildGeneratedCoverDataUrl(game.name));
  const screenshots = Array.isArray(game.screenshots) ? game.screenshots.filter(Boolean).slice(0, 6) : [];
  const genres = getFriendlyMetadataValue(game.genres, isEdenEmulator ? 'Emulador, Nintendo' : isPhoneEmulator ? 'Emulador, Android' : isPlatformEmulator ? 'Emulador' : getGameCategories(game)[0] || 'Catálogo NEXORT');
  const developers = getFriendlyMetadataValue(game.developers, isEdenEmulator ? 'Eden Emulators' : isPhoneEmulator ? game.name : isPlatformEmulator ? game.name : 'Catálogo NEXORT');
  const platforms = getFriendlyMetadataValue(game.platforms, isEdenEmulator ? 'PC, macOS, Linux, Web' : isPhoneEmulator ? 'Android' : isPlatformEmulator ? (game.category === 'xbox-emulators' ? 'Xbox' : 'PlayStation') : 'PC');
  const localDescription = LOCAL_DESCRIPTION_MAP[normalizeGameName(game.name)];
  const descriptionText = localDescription
    || (canLoadGameDetails && !game.detailsLoaded
      ? 'Obteniendo información del juego...'
    : isPhoneEmulator
    ? (game.descriptionEs || game.description || `${game.name} es un emulador móvil para ejecutar juegos y apps Android con buena compatibilidad, rendimiento y facilidad de uso.`)
    : (isPlatformEmulator
      ? (game.descriptionEs || game.description || `${game.name} es un emulador compatible con ${game.category === 'xbox-emulators' ? 'Xbox' : 'PlayStation'} para ejecutar juegos de esa plataforma.`)
      : (isEdenEmulator
      ? 'Emulador Nintendo para PC, macOS, Linux y Web con soporte para software, firmware y compatibilidad avanzada.'
      : (game.descriptionEs || game.description || game.review || (game.updated ? 'Tiene una actualización registrada por la fuente.' : `${game.name} forma parte del catálogo de NEXORT.`)))));
  const ratingValue = getGameRating(game);
  const reviewText = getGameReviewText(game);
  const filledStars = Array.from({ length: 5 }, (_, index) => index < Math.round(ratingValue)
    ? '<span class="star filled">★</span>'
    : '<span class="star">★</span>').join('');

  detailsContent.innerHTML = `
    <div class="game-detail-hero" style="background-image: linear-gradient(90deg, rgba(5, 9, 16, 0.94) 0%, rgba(5, 9, 16, 0.68) 48%, rgba(5, 9, 16, 0.18) 100%), url('${escapeHtml(background)}')">
      <div class="game-detail-hero-content">
        <span class="eyebrow">JUEGO</span>
        <h2>${escapeHtml(game.name)}</h2>
        <p>${escapeHtml(descriptionText)}</p>
        <div class="source-controls">
          <button class="primary-button detail-library-toggle" type="button" data-game="${escapeHtml(game.name)}">${state.library.has(game.name) ? 'Quitar de biblioteca' : 'Agregar a biblioteca'}</button>
          <button class="secondary-button detail-favorite-toggle" type="button" data-game="${escapeHtml(game.name)}">${state.favorites.has(game.name) ? 'Quitar favorito' : 'Agregar a favoritos'}</button>
        </div>
      </div>
    </div>
    <div class="game-detail-meta">
      <div><span>Géneros</span><strong>${escapeHtml(genres)}</strong></div>
      <div><span>Desarrolladores</span><strong>${escapeHtml(developers)}</strong></div>
      <div><span>Plataformas</span><strong>${escapeHtml(platforms)}</strong></div>
      <div><span>Fecha de lanzamiento</span><strong>${escapeHtml(formatReleaseDate(isEdenEmulator ? '2022-03-11' : (isPhoneEmulator ? '2024-01-01' : game.released)))}</strong></div>
    </div>
    <section class="game-rating-review">
      <div class="detail-section-heading"><span class="eyebrow">VALORACIÓN</span><span>Reseña general</span></div>
      <div class="rating-review-card">
        <div class="rating-score-block">
          <div class="rating-stars" aria-label="Puntuación ${ratingValue.toFixed(1)} de 5">${filledStars}</div>
          <strong>${ratingValue.toFixed(1)} / 5</strong>
        </div>
        <div class="review-copy">
          <h3>Reseña</h3>
          <p>${escapeHtml(reviewText)}</p>
        </div>
      </div>
    </section>
    ${screenshots.length ? `
      <section class="game-screenshots">
        <div class="detail-section-heading"><span class="eyebrow">GALERÍA</span><span>${screenshots.length} capturas</span></div>
        <div class="screenshot-grid">
          ${screenshots.map((image, index) => `<img src="${escapeHtml(getSafeAssetUrl(image))}" alt="Captura ${index + 1} de ${escapeHtml(game.name)}" loading="lazy">`).join('')}
        </div>
      </section>
    ` : ''}
    ${getSafeExternalUrl(game.url) ? `<a class="secondary-button detail-source-link" href="${escapeHtml(getSafeExternalUrl(game.url))}" target="_blank" rel="noopener noreferrer">Abrir enlace de descarga</a>` : ''}
  `;

  void fetchRawgDetails(game);
};

const loadGameDetails = async (game) => {
  showGameDetails(game);
  openView('details');
};

const loadGameCovers = async () => {
  for (const game of games) {
    const preferredCover = game.cover || game.background_image || game.image || '';

    if (preferredCover) {
      game.cover = preferredCover;
      game.fallbackCover = preferredCover;
      continue;
    }

    const generatedCover = buildGeneratedCoverDataUrl(game.name);
    game.cover = generatedCover;
    game.fallbackCover = generatedCover;
  }

  renderGameCatalog('gameCatalog');
  renderExploreCatalog();
  renderGameCatalog('gameCatalogLibrary', getLibraryGames());
  renderGameCatalog('gameCatalogUpdates', games.filter((game) => game.updated));
  renderFavoritesCatalog();
  renderPlatformCatalog();
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
  if (viewName === 'trends') void loadTrendGames();
  if (viewName === 'platforms') renderPlatformCatalog();

  navItems.forEach((item) => {
    item.classList.toggle('active', item.dataset.view === viewName);
    if (item.dataset.view === viewName) item.setAttribute('aria-current', 'page');
    else item.removeAttribute('aria-current');
  });

  viewPanels.forEach((panel) => {
    panel.classList.toggle('active', panel.dataset.view === viewName);
  });
};

const showToast = (title, message, type = 'info') => {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  const indicator = document.createElement('span');
  indicator.className = 'indicator';
  const content = document.createElement('div');
  const heading = document.createElement('strong');
  const body = document.createElement('span');
  heading.textContent = title;
  body.textContent = message;
  content.append(heading, body);
  toast.append(indicator, content);

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
  toggleSidebarBtn.setAttribute('aria-expanded', String(!collapsed));
  state.sidebarCollapsed = collapsed;
  storageSaveValue('nexort-sidebar-collapsed', String(collapsed));
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
        <h3>${escapeHtml(title)}</h3>
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

if (state.sidebarCollapsed) sidebar.classList.add('collapsed');
toggleSidebarBtn.textContent = state.sidebarCollapsed ? 'Expandir' : 'Minimizar';
toggleSidebarBtn.setAttribute('aria-expanded', String(!state.sidebarCollapsed));
toggleSidebarBtn.addEventListener('click', toggleSidebar);

const savedProfileName = storageReadValue('nexort-profile-name');
if (profileNameInput) profileNameInput.value = savedProfileName;
updateProfileIdentity(savedProfileName);

profileAvatar?.addEventListener('click', () => profileAvatarInput?.click());
profileAvatarInput?.addEventListener('change', () => {
  const file = profileAvatarInput.files?.[0];
  if (!file) return;
  if (!file.type.startsWith('image/')) {
    if (profileStatus) profileStatus.textContent = 'Selecciona un archivo de imagen válido.';
    return;
  }
  if (file.size > 2 * 1024 * 1024) {
    if (profileStatus) profileStatus.textContent = 'La imagen debe pesar menos de 2 MB.';
    return;
  }

  const reader = new FileReader();
  reader.addEventListener('load', () => {
    if (typeof reader.result !== 'string') return;
    storageSaveValue('nexort-profile-avatar', reader.result);
    updateProfileIdentity(profileNameInput?.value || savedProfileName);
    if (profileStatus) profileStatus.textContent = 'Imagen de perfil actualizada.';
    showToast('Imagen actualizada', 'Tu nueva imagen de perfil está guardada.', 'success');
  }, { once: true });
  reader.readAsDataURL(file);
});

profileForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const name = profileNameInput.value.trim();
  if (name.length < 2) {
    profileNameInput.setCustomValidity('Escribe al menos 2 caracteres.');
    profileNameInput.reportValidity();
    if (profileStatus) profileStatus.textContent = 'El nombre debe tener al menos 2 caracteres.';
    return;
  }

  profileNameInput.setCustomValidity('');

  storageSaveValue('nexort-profile-name', name);
  storageSaveValue('nexort-profile-updated-at', new Date().toISOString());
  updateProfileIdentity(name);
  if (profileStatus) profileStatus.textContent = 'Perfil guardado correctamente.';
  showToast('Perfil actualizado', `Bienvenido, ${name}.`, 'success');
});

profileNameInput?.addEventListener('input', () => profileNameInput.setCustomValidity(''));

clearProfileDataButton?.addEventListener('click', () => {
  if (!window.confirm('¿Borrar nombre, favoritos, biblioteca y actividad reciente?')) return;

  storageRemoveValue('nexort-profile-name');
  storageRemoveValue('nexort-profile-updated-at');
  storageRemoveValue('nexort-profile-avatar');
  state.favorites.clear();
  state.library.clear();
  state.recentGames = [];
  persistStoredSet('nexort-favorites', state.favorites);
  persistStoredSet('nexort-library', state.library);
  if (profileNameInput) profileNameInput.value = '';
  if (profileAvatarInput) profileAvatarInput.value = '';
  updateProfileIdentity('');
  updateProfileStats();
  renderHomeSummary();
  renderFavoritesCatalog();
  renderGameCatalog('gameCatalogLibrary', getLibraryGames());
  updateCatalogEmptyStates();
  if (profileStatus) profileStatus.textContent = 'Datos locales borrados.';
  showToast('Datos eliminados', 'El perfil volvió a su estado inicial.', 'warning');
});

let searchTimer;
searchInput.addEventListener('input', () => {
  clearTimeout(searchTimer);
  const query = searchInput.value.trim();
  searchTimer = setTimeout(() => {
    renderExploreCatalog();
    if (query && state.activeView !== 'explore') openView('explore');
  }, SEARCH_DEBOUNCE_MS);
});

genreFilter?.addEventListener('change', () => {
  renderGameCatalog('gameCatalog', games.filter((game) => {
    const selectedGenre = genreFilter?.value || 'all';
    if (selectedGenre === 'all') return true;
    return getGameCategories(game).includes(selectedGenre);
  }));
  if (state.activeView !== 'home') openView('home');
  const selectedGenre = genreFilter.value === 'all' ? 'todas las categorías' : genreFilter.value;
  showToast('Categoría aplicada', `Mostrando ${selectedGenre} en Inicio.`, 'info');
});

libraryFilter?.addEventListener('change', () => {
  renderGameCatalog('gameCatalogLibrary', getLibraryGames());
  updateCatalogEmptyStates();
});

document.querySelectorAll('.platform-filter').forEach((button) => {
  button.setAttribute('aria-pressed', String(button.classList.contains('active')));
  button.addEventListener('click', () => {
    state.activePlatform = button.dataset.platform || 'all';
    document.querySelectorAll('.platform-filter').forEach((item) => {
      const isActive = item === button;
      item.classList.toggle('active', isActive);
      item.setAttribute('aria-pressed', String(isActive));
    });
    renderPlatformCatalog();
  });
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
  const recentButton = event.target.closest('[data-recent-game]');
  if (recentButton) {
    const game = getAllCatalogGames().find((item) => item.name === recentButton.dataset.recentGame);
    if (game) {
      showGameDetails(game);
      openView('details');
    }
    return;
  }

  const downloadLink = event.target.closest('a.download-link');
  if (downloadLink) {
    const title = downloadLink.dataset.game;
    showToast('Descarga iniciada', `${title} se añadió a Descargas.`, 'info');
    installGame(title);
    return;
  }

  const row = event.target.closest('.game-row');
  if (row && !event.target.closest('button, a')) {
    const game = getAllCatalogGames().find((item) => item.name === row.querySelector('.game-name')?.textContent.trim());
    if (game) {
      showGameDetails(game);
      openView('details');
    }
    return;
  }

  const button = event.target.closest('button');
  if (!button) return;

  if (button.dataset.view) {
    openView(button.dataset.view);
  }

  if (button.classList.contains('detail-library-toggle') || button.classList.contains('detail-favorite-toggle')) {
    const game = getAllCatalogGames().find((item) => item.name === button.dataset.game);
    if (!game) return;

    if (button.classList.contains('detail-library-toggle')) {
      if (state.library.has(game.name)) state.library.delete(game.name);
      else state.library.add(game.name);
      persistStoredSet('nexort-library', state.library);
      renderGameCatalog('gameCatalogLibrary', getLibraryGames());
    } else {
      if (state.favorites.has(game.name)) state.favorites.delete(game.name);
      else state.favorites.add(game.name);
      persistStoredSet('nexort-favorites', state.favorites);
      renderFavoritesCatalog();
    }

    updateCatalogEmptyStates();
    updateProfileStats();
    renderHomeSummary();
    showGameDetails(game);
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
    persistStoredSet('nexort-favorites', state.favorites);
    renderFavoritesCatalog();
    if (state.activeView === 'platforms') renderPlatformCatalog();
    if (state.activeView === 'home') renderGameCatalog('gameCatalog', games);
    if (state.activeView === 'explore') renderExploreCatalog();
    updateProfileStats();
    renderHomeSummary();
  }

  if (button.classList.contains('library-toggle') && !state.library.has(findGameTitle(button))) {
    const game = findGameTitle(button);
    state.library.add(game);
    persistStoredSet('nexort-library', state.library);
    renderGameCatalog('gameCatalogLibrary', getLibraryGames());
    renderGameCatalog('gameCatalog', games);
    renderExploreCatalog();
    if (state.activeView === 'platforms') renderPlatformCatalog();
    updateCatalogEmptyStates();
    updateProfileStats();
    renderHomeSummary();
    showToast('Biblioteca actualizada', `${game} se añadió a tu biblioteca.`, 'info');
  }

  else if (button.classList.contains('library-toggle') && state.library.has(findGameTitle(button))) {
    const game = findGameTitle(button);
    state.library.delete(game);
    persistStoredSet('nexort-library', state.library);
    renderGameCatalog('gameCatalogLibrary', getLibraryGames());
    renderGameCatalog('gameCatalog', games);
    renderExploreCatalog();
    if (state.activeView === 'platforms') renderPlatformCatalog();
    updateCatalogEmptyStates();
    updateProfileStats();
    renderHomeSummary();
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

document.addEventListener('keydown', (event) => {
  const row = event.target.closest('.game-row');
  if (!row || !['Enter', ' '].includes(event.key) || event.target !== row) return;
  event.preventDefault();
  const game = getAllCatalogGames().find((item) => item.name === row.querySelector('.game-name')?.textContent.trim());
  if (game) {
    showGameDetails(game);
    openView('details');
  }
});

clearDemoData();
loadGamesFromApi();
loadDiscoverGames();
window.setInterval(() => {
  if (document.visibilityState === 'visible' && Date.now() - lastDiscoverRefresh >= DISCOVER_REFRESH_MS) {
    void loadDiscoverGames();
  }
}, 60 * 1000);
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible' && Date.now() - lastDiscoverRefresh >= DISCOVER_REFRESH_MS) {
    void loadDiscoverGames();
  }
});
loadPlatformLists();
