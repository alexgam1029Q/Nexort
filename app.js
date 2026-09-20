const navItems = document.querySelectorAll('.nav-item');
const viewPanels = document.querySelectorAll('.view-panel');
const sidebar = document.getElementById('sidebar');
const toggleSidebarBtn = document.getElementById('toggleSidebar');
const toastStack = document.getElementById('toastStack');
const searchInput = document.querySelector('.search-shell input');
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
let nintendoGames = [];
let phoneGames = [];
let xboxGames = [];
let playStationGames = [];

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
  activePlatform: 'PC',
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
  const linkPattern = /^##\s+(.+?)\s*\r?\n-\s*(.+)$/gm;
  let match;

  while ((match = linkPattern.exec(markdown)) !== null) {
    const name = match[1].trim();
    if (!name || name.startsWith('*')) continue;
    const rawValue = (match[2] || '').trim();
    const url = rawValue === 'PENDIENTE' || !rawValue ? '' : rawValue;
    gamesFromLinks.push({ name, url });
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
      entries.push({
        name,
        url: rawValue === 'PENDIENTE' || !rawValue ? '' : rawValue,
        updatesUrl: fields['actualización'] && fields['actualización'] !== 'PENDIENTE' ? fields['actualización'] : '',
        dlcUrl: fields.dlc && fields.dlc !== 'PENDIENTE' ? fields.dlc : '',
        keysUrl: isEdenEntry && fields.keys && fields.keys !== 'PENDIENTE' ? fields.keys : '',
        firmwareUrl: isEdenEntry && fields.firmware && fields.firmware !== 'PENDIENTE' ? fields.firmware : '',
        usbHelperUrl: isCemuEntry && fields['usb helper'] && fields['usb helper'] !== 'PENDIENTE' ? fields['usb helper'] : '',
        cover: NINTENDO_EMULATOR_LOGOS[normalizedName]
          || nintendoCoverMap[normalizedName]
          || buildGeneratedCoverDataUrl(name),
        fallbackCover: buildGeneratedCoverDataUrl(name),
        platforms: ['Nintendo'],
        category: currentSection,
        emulatorStatus: currentEmulatorStatus,
        emulatorPlatform: currentEmulatorPlatform,
        description: currentSection === 'emulators'
          ? NINTENDO_EMULATOR_DESCRIPTIONS[normalizedName] || `${name} es un emulador de Nintendo.`
          : '',
        descriptionEs: currentSection === 'emulators'
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
  noxplayer: 'https://www.google.com/s2/favicons?sz=256&domain=bignox.com',
  mumuplayer: 'https://www.google.com/s2/favicons?sz=256&domain=mumuplayer.com',
  'mumu player': 'https://www.google.com/s2/favicons?sz=256&domain=mumuplayer.com',
  gameloop: 'https://www.google.com/s2/favicons?sz=256&domain=gameloop.fun',
  'android studio emulator': 'https://www.google.com/s2/favicons?sz=256&domain=developer.android.com',
  genymotion: 'https://www.google.com/s2/favicons?sz=256&domain=genymotion.com',
  waydroid: 'https://www.google.com/s2/favicons?sz=256&domain=waydro.id',
  primeos: 'https://www.google.com/s2/favicons?sz=256&domain=primeos.in',
  'playstation emulators': 'https://www.google.com/s2/favicons?sz=256&domain=playstation.com',
  'xbox emulators': 'https://www.google.com/s2/favicons?sz=256&domain=xbox.com',
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

    for (let index = 0; index < lines.length; index += 1) {
      const line = lines[index].trim();
      const sectionMatch = line.match(/^###\s+🎮\s*(.+?)\s*$/);
      if (sectionMatch) {
        currentPlatformGroup = sectionMatch[1].trim();
        continue;
      }

      const entryMatch = line.match(/^(?:###|####)\s+(?!🎮)(.+?)\s*$/);
      if (!entryMatch) continue;

      const name = entryMatch[1].trim();
      const entryLines = lines.slice(index + 1, index + 10);
      const firstLink = entryLines.find((line) => /^-\s*https?:\/\//i.test(line.trim()));
      const plainValue = firstLink ? firstLink.trim().replace(/^[-]\s*/, '').trim() : '';
      const mappedLogo = customLogoMap[normalizeGameName(name)] || PHONE_EMULATOR_LOGO_MAP[normalizeGameName(name)] || '';
      const normalizedName = normalizeGameName(name);
      const descriptionMap = platformName === 'PlayStation'
        ? PLAYSTATION_EMULATOR_DESCRIPTIONS
        : platformName === 'Xbox'
          ? XBOX_EMULATOR_DESCRIPTIONS
          : {};
      const description = descriptionMap[normalizedName] || '';

      entries.push({
        name,
        url: plainValue && plainValue !== 'PENDIENTE' ? plainValue : '',
        cover: mappedLogo || buildGeneratedCoverDataUrl(name),
        fallbackCover: buildGeneratedCoverDataUrl(name),
        platforms: [platformName],
        platformGroup: currentPlatformGroup,
        category: categoryName,
        description: description || `${name} es un emulador compatible con ${platformName}, pensado para ejecutar juegos y contenido de esa plataforma.`,
        descriptionEs: description || `${name} es un emulador compatible con ${platformName}, pensado para ejecutar juegos y contenido de esa plataforma.`,
        genres: ['Emulador'],
        developers: [name],
        released: '2024-01-01',
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
      const mappedLogo = PHONE_EMULATOR_LOGO_MAP[normalizeGameName(name)] || '';
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
  const text = getCoverFallbackText(name).slice(0, 2) || 'NX';
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
  const index = [...name].reduce((sum, char) => sum + char.charCodeAt(0), 0) % palette.length;
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
      <circle cx="90" cy="500" r="110" fill="rgba(255,255,255,0.05)"/>
      <text x="50%" y="52%" text-anchor="middle" fill="white" font-size="130" font-weight="700" font-family="Arial, Helvetica, sans-serif">${text}</text>
      <text x="50%" y="78%" text-anchor="middle" fill="rgba(255,255,255,0.7)" font-size="20" font-family="Arial, Helvetica, sans-serif">NEXORT</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

const selectedGameTitles = [
  '7 Days to Die', 'Among Us', 'ARK: Survival Ascended', 'ARK: Survival Evolved',
  "Assassin's Creed II", "Assassin's Creed Mirage", "Assassin's Creed Shadows",
  "Assassin's Creed Valhalla", "Assassin's Creed III Remastered", "Assassin's Creed IV Black Flag",
  "Assassin's Creed Black Flag Resynced",
  "Assassin's Creed Odyssey", "Assassin's Creed Origins", "Assassin's Creed Rogue",
  "Assassin's Creed Syndicate", "Assassin's Creed Unity", "Assassin's Creed Director's Cut",
  'Avatar: Frontiers of Pandora', 'Battlefield V', 'Black Myth: Wukong',
  'Call of Duty: Black Ops 6', 'Call of Duty: Black Ops II', 'Call of Duty: Black Ops III',
  'Call of Duty: Modern Warfare', 'Call of Duty: Modern Warfare III', 'Cities: Skylines',
  'Cities: Skylines II', 'Cyberpunk 2077', 'Dark Souls: Remastered', 'Days Gone', 'DayZ',
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

const getLibraryGames = () => {
  const libraryGames = games.filter((game) => state.library.has(game.name));
  if (libraryFilter?.value === 'favorites') return libraryGames.filter((game) => state.favorites.has(game.name));
  if (libraryFilter?.value === 'updates') return libraryGames.filter((game) => game.updated);
  return libraryGames;
};

const applyGames = (nextGames, sourceName) => {
  const safeNextGames = Array.isArray(nextGames) && nextGames.length ? nextGames : buildFallbackCatalog();
  const seenNames = new Set(safeNextGames.map((game) => normalizeGameName(game.name)));
  const catalogPlaceholders = selectedGameTitles
    .filter((name) => !seenNames.has(normalizeGameName(name)))
    .map((name) => ({ name, url: '', cover: buildGeneratedCoverDataUrl(name), fallbackCover: buildGeneratedCoverDataUrl(name) }));

  const filteredGames = [...safeNextGames, ...catalogPlaceholders]
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
};

const normalizeIgdbCoverUrl = (cover) => {
  if (!cover || typeof cover !== 'string') return '';
  const url = cover.startsWith('//') ? `https:${cover}` : cover;
  return url.replace(/\/t_\w+\//, '/t_cover_big/');
};

const loadGamesFromApi = async () => {
  const localLinks = await readLinksCatalog();
  const fallbackGames = mergeCatalogEntries(localLinks, buildFallbackCatalog());
  applyGames(fallbackGames, 'catálogo inmediato');

  try {
    const rawgGames = await fetchRawgGames();
    const mappedGames = rawgGames.map((game) => ({
      name: game.name || game.rawgName || 'Sin nombre',
      rawgId: game.id || 0,
      url: game.website || '',
      cover: game.background_image || game.image || '',
      background: game.background_image_additional || game.background_image || '',
      description: game.description_raw || '',
      genres: Array.isArray(game.genres) ? game.genres.map((item) => item.name).filter(Boolean) : [],
      developers: Array.isArray(game.developers) ? game.developers.map((item) => item.name).filter(Boolean) : [],
      platforms: Array.isArray(game.platforms) ? game.platforms.map((item) => item.platform?.name).filter(Boolean) : [],
      released: game.released || '',
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
        retroarch: 'https://www.google.com/s2/favicons?sz=256&domain=retroarch.com',
      }
    );
  } catch {
    playStationGames = [];
  }

  const apiKey = (RAWG_CREDENTIALS.apiKey || '').trim();
  if (apiKey && apiKey !== 'TU_RAWG_API_KEY') {
    nintendoGames = await Promise.all(nintendoGames.map(async (game) => {
      const isEmulatorEntry = game.category === 'emulators' || game.category === 'phone-emulators';
      if (isEmulatorEntry) return game;

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
  }

  renderPlatformCatalog();
};

const renderGameCatalog = (containerId, catalogGames = games) => {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = catalogGames.map((game) => {
    const coverSource = typeof game.cover === 'string' && game.cover ? game.cover : buildGeneratedCoverDataUrl(game.name);
    const isLogoAsset = /\/logo\.png(?:\?.*)?$/i.test(coverSource) || /\/logo\.[a-z0-9]+(?:\?.*)?$/i.test(coverSource) || /\/named_logo\.[a-z0-9]+(?:\?.*)?$/i.test(coverSource) || /google\.com\/s2\/favicons/i.test(coverSource);
    const isBlueStacks = game.category === 'phone-emulators' && normalizeGameName(game.name) === 'bluestacks';
    const isPhoneEmulator = game.category === 'phone-emulators';
    const hasDownload = Boolean(game.url && game.url !== 'PENDIENTE');
    const actionMarkup = hasDownload
      ? `<a class="primary-button download-link" href="${game.url}" target="_blank" rel="noopener noreferrer" data-game="${game.name}">Descargar</a>`
      : `<button class="secondary-button pending-button" type="button" disabled>PENDIENTE</button>`;
    const extraActionsMarkup = game.category === 'games'
      ? `
        ${game.updatesUrl ? `<a class="primary-button content-link" href="${game.updatesUrl}" target="_blank" rel="noopener noreferrer">Actualizaciones</a>` : '<button class="secondary-button pending-button content-link" type="button" disabled>Actualizaciones</button>'}
        ${game.dlcUrl ? `<a class="primary-button content-link" href="${game.dlcUrl}" target="_blank" rel="noopener noreferrer">DLC</a>` : '<button class="secondary-button pending-button content-link" type="button" disabled>DLC</button>'}
      `
      : isBlueStacks
        ? `
          <div class="bluestacks-version-row">
            ${game.versionFiveUrl ? `<a class="primary-button content-link bluestacks-version" href="${game.versionFiveUrl}" target="_blank" rel="noopener noreferrer">BlueStacks 5</a>` : '<button class="secondary-button pending-button content-link bluestacks-version" type="button" disabled>BlueStacks 5</button>'}
            ${game.versionTenUrl ? `<a class="primary-button content-link bluestacks-version" href="${game.versionTenUrl}" target="_blank" rel="noopener noreferrer">BlueStacks 10</a>` : '<button class="secondary-button pending-button content-link bluestacks-version" type="button" disabled>BlueStacks 10</button>'}
          </div>
          <div class="bluestacks-download-row">${actionMarkup}</div>
        `
      : game.category === 'emulators' && (game.keysUrl || game.firmwareUrl || game.usbHelperUrl)
        ? `
          ${game.keysUrl || game.firmwareUrl ? `<a class="primary-button content-link combined-content-link" href="${game.keysUrl || game.firmwareUrl}" target="_blank" rel="noopener noreferrer">Keys and Firmware</a>` : ''}
          ${game.usbHelperUrl ? `<a class="primary-button content-link combined-content-link" href="${game.usbHelperUrl}" target="_blank" rel="noopener noreferrer">USB Helper</a>` : ''}
        `
        : isPhoneEmulator
          ? `
            <div class="phone-emulator-actions">
              ${hasDownload ? `<a class="primary-button content-link combined-content-link" href="${game.url}" target="_blank" rel="noopener noreferrer">Descargar</a>` : '<button class="secondary-button pending-button content-link combined-content-link" type="button" disabled>Descargar</button>'}
            </div>
          `
          : '';

    return `
      <div class="game-row${['games', 'emulators', 'phone-emulators', 'xbox-emulators', 'playstation-emulators'].includes(game.category) ? ' content-game-row' : ''}">
        <div class="game-cover loading" aria-label="Logo de ${game.name}">
          <img src="${coverSource}" class="${isLogoAsset ? 'game-logo' : ''}" data-fallback="${game.fallbackCover || buildGeneratedCoverDataUrl(game.name)}" alt="Logo de ${game.name}" loading="lazy">
        </div>
        <span class="game-name">${game.name}</span>
        <div class="game-actions${isBlueStacks ? ' bluestacks-actions' : ''}">
          ${isBlueStacks || isPhoneEmulator ? '' : actionMarkup}
          ${extraActionsMarkup}
        </div>
        <button class="secondary-button icon-button library-toggle" type="button" aria-label="${state.library.has(game.name) ? 'Quitar de biblioteca' : 'Agregar a biblioteca'}" title="${state.library.has(game.name) ? 'Quitar de biblioteca' : 'Agregar a biblioteca'}">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 3.5A2.5 2.5 0 0 1 7.5 1H20v18H7.5A2.5 2.5 0 0 0 5 21.5v-18ZM7.5 3a.5.5 0 0 0-.5.5v12.1c.16-.06.33-.1.5-.1H18V3H7.5Z"/></svg>
        </button>
        <button class="secondary-button icon-button favorite-toggle" type="button" aria-label="${state.favorites.has(game.name) ? 'Quitar favorito' : 'Agregar a favoritos'}" title="${state.favorites.has(game.name) ? 'Quitar favorito' : 'Agregar a favoritos'}">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 21-1.45-1.32C5.4 15.36 2 12.28 2 8.5A4.5 4.5 0 0 1 6.5 4c1.74 0 3.41.81 4.5 2.09A6.05 6.05 0 0 1 15.5 4 4.5 4.5 0 0 1 20 8.5c0 3.78-3.4 6.86-8.55 11.18L12 21Z"/></svg>
        </button>
      </div>
    `;
  }).join('');

  container.querySelectorAll('.game-row').forEach((row) => {
    row.addEventListener('click', (event) => {
      if (event.target.closest('button, a')) return;
      const gameName = row.querySelector('.game-name')?.textContent.trim();
      const allCatalogEntries = [...games, ...nintendoGames, ...phoneGames, ...xboxGames, ...playStationGames];
      const game = allCatalogEntries.find((item) => item.name === gameName);
      if (game) {
        showGameDetails(game);
        openView('details');
      }
    });
  });

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

const renderNintendoCatalog = () => {
  const container = document.getElementById('gameCatalogPlatforms');
  if (!container) return;

  const emulators = nintendoGames.filter((game) => game.category === 'emulators');
  const titles = nintendoGames.filter((game) => game.category !== 'emulators');
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
    ${titles.length ? '<h2 class="platform-section-title">Juegos</h2><div id="nintendoGames" class="catalog-list"></div>' : ''}
  `;

  if (ungroupedSwitchEmulators.length) renderGameCatalog('nintendoSwitchEmulators', ungroupedSwitchEmulators);
  if (activeEmulators.length) renderGameCatalog('nintendoActiveEmulators', activeEmulators);
  if (discontinuedEmulators.length) renderGameCatalog('nintendoDiscontinuedEmulators', discontinuedEmulators);
  if (wiiUEmulators.length) renderGameCatalog('nintendoWiiUEmulators', wiiUEmulators);
  if (titles.length) renderGameCatalog('nintendoGames', titles);
  return nintendoGames;
};

const renderPlatformSpecificCatalog = (platformName, items) => {
  const container = document.getElementById('gameCatalogPlatforms');
  if (!container) return [];

  const parsedItems = Array.isArray(items) ? items : [];
  const groupedItems = parsedItems.reduce((groups, item) => {
    const groupName = item.platformGroup || 'Emuladores';
    if (!groups.has(groupName)) groups.set(groupName, []);
    groups.get(groupName).push(item);
    return groups;
  }, new Map());

  container.innerHTML = `${[...groupedItems.keys()].map((groupName, index) => `
    <section class="platform-emulator-group">
      <h2 class="platform-section-title">${escapeHtml(groupName)}</h2>
      <div id="${platformName.toLowerCase()}PlatformList${index}" class="catalog-list"></div>
    </section>
  `).join('')}<section class="platform-games-group">
    <h2 class="platform-section-title">Juegos</h2>
    <div id="${platformName.toLowerCase()}GamesList" class="catalog-list"></div>
  </section>`;

  [...groupedItems.entries()].forEach(([groupName, groupItems], index) => {
    renderGameCatalog(`${platformName.toLowerCase()}PlatformList${index}`, groupItems);
  });
  return parsedItems;
};

const renderPlatformCatalog = () => {
  const selectedPlatform = state.activePlatform;
  const platformCatalogTitle = document.getElementById('platformCatalogTitle');
  if (platformCatalogTitle) {
    platformCatalogTitle.textContent = ['Telefono', 'Xbox', 'PlayStation'].includes(selectedPlatform) ? 'Emuladores' : 'Juegos';
    platformCatalogTitle.style.display = selectedPlatform === 'Nintendo' ? 'none' : '';
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
  `;
};

const escapeHtml = (value = '') => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#039;');

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

  const emulatorCategories = ['emulators', 'phone-emulators', 'xbox-emulators', 'playstation-emulators'];
  const isEmulatorEntry = emulatorCategories.includes(game.category);
  if (isEmulatorEntry) {
    game.detailsLoaded = true;
    if (state.activeView === 'details') showGameDetails(game);
    return;
  }

  const apiKey = (RAWG_CREDENTIALS.apiKey || '').trim();
  if (!apiKey || apiKey === 'TU_RAWG_API_KEY') return;

  try {
    if (!game.rawgId) {
      const variant = getRawgSearchVariants(game.name)[0];
      const searchResponse = await fetch(`https://api.rawg.io/api/games?key=${encodeURIComponent(apiKey)}&search=${encodeURIComponent(variant)}&page_size=1`, { cache: 'no-store' });
      if (!searchResponse.ok) return;
      const searchData = await searchResponse.json();
      game.rawgId = searchData.results?.[0]?.id || 0;
      if (!game.rawgId) return;
    }

    const response = await fetch(`https://api.rawg.io/api/games/${encodeURIComponent(game.rawgId)}?key=${encodeURIComponent(apiKey)}`, { cache: 'no-store' });
    if (!response.ok) return;

    const details = await response.json();
    game.description = details.description_raw || game.description || '';
    game.descriptionEs = await translateDescriptionToSpanish(game.description);
    game.genres = Array.isArray(details.genres) ? details.genres.map((item) => item.name).filter(Boolean) : game.genres || [];
    game.developers = Array.isArray(details.developers) ? details.developers.map((item) => item.name).filter(Boolean) : game.developers || [];
    game.platforms = Array.isArray(details.platforms) ? details.platforms.map((item) => item.platform?.name).filter(Boolean) : game.platforms || [];
    game.released = details.released || game.released || '';
    game.background = details.background_image_additional || details.background_image || game.background || '';
    game.screenshots = Array.isArray(details.short_screenshots)
      ? details.short_screenshots.map((item) => item.image).filter(Boolean)
      : Array.isArray(details.screenshots) ? details.screenshots.map((item) => item.image).filter(Boolean) : game.screenshots || [];

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
    if (state.activeView === 'details') showGameDetails(game);
  } catch {
    // La ficha inicial sigue disponible aunque RAWG no responda.
  }
};

const showGameDetails = (game) => {
  if (!detailsContent || !game) return;

  const isEdenEmulator = game.category === 'emulators' && normalizeGameName(game.name) === 'eden';
  const isPhoneEmulator = game.category === 'phone-emulators';
  const isPlatformEmulator = ['xbox-emulators', 'playstation-emulators'].includes(game.category);
  const background = isEdenEmulator
    ? 'https://eden-emu.dev/assets/logos/named_logo.png'
    : (game.background || game.cover || buildGeneratedCoverDataUrl(game.name));
  const screenshots = Array.isArray(game.screenshots) ? game.screenshots.filter(Boolean).slice(0, 6) : [];
  const genres = Array.isArray(game.genres) && game.genres.length ? game.genres.join(', ') : (isEdenEmulator ? 'Emulador, Nintendo' : isPhoneEmulator ? 'Emulador, Android' : isPlatformEmulator ? 'Emulador' : 'Sin géneros registrados');
  const developers = Array.isArray(game.developers) && game.developers.length ? game.developers.join(', ') : (isEdenEmulator ? 'Eden Emulators' : isPhoneEmulator ? game.name : isPlatformEmulator ? game.name : 'Sin desarrollador registrado');
  const platforms = Array.isArray(game.platforms) && game.platforms.length ? game.platforms.join(', ') : (isEdenEmulator ? 'PC, macOS, Linux, Web' : isPhoneEmulator ? 'Android' : isPlatformEmulator ? (game.category === 'xbox-emulators' ? 'Xbox' : 'PlayStation') : 'Sin plataformas registradas');
  const descriptionText = isPhoneEmulator
    ? (game.descriptionEs || game.description || `${game.name} es un emulador móvil para ejecutar juegos y apps Android con buena compatibilidad, rendimiento y facilidad de uso.`)
    : (isPlatformEmulator
      ? (game.descriptionEs || game.description || `${game.name} es un emulador compatible con ${game.category === 'xbox-emulators' ? 'Xbox' : 'PlayStation'} para ejecutar juegos de esa plataforma.`)
      : (isEdenEmulator
      ? 'Emulador Nintendo para PC, macOS, Linux y Web con soporte para software, firmware y compatibilidad avanzada.'
      : (game.descriptionEs || game.description || (game.updated ? 'Tiene una actualización registrada por la fuente.' : 'Disponible en el catálogo de NEXORT.'))));

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
    ${screenshots.length ? `
      <section class="game-screenshots">
        <div class="detail-section-heading"><span class="eyebrow">GALERÍA</span><span>${screenshots.length} capturas</span></div>
        <div class="screenshot-grid">
          ${screenshots.map((image, index) => `<img src="${escapeHtml(image)}" alt="Captura ${index + 1} de ${escapeHtml(game.name)}" loading="lazy">`).join('')}
        </div>
      </section>
    ` : ''}
    ${game.url ? `<a class="secondary-button detail-source-link" href="${escapeHtml(game.url)}" target="_blank" rel="noopener noreferrer">Abrir enlace de descarga</a>` : ''}
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
  if (viewName === 'platforms') renderPlatformCatalog();

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

document.querySelectorAll('.platform-filter').forEach((button) => {
  button.addEventListener('click', () => {
    state.activePlatform = button.dataset.platform || 'all';
    document.querySelectorAll('.platform-filter').forEach((item) => item.classList.toggle('active', item === button));
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
loadGamesFromApi();
loadPlatformLists();
