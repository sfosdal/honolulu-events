// The city — every fact that makes this calendar Honolulu's rather than
// another town's, in one place (2026-10-11: one of the cities built on
// lqa-events after Everett and Chicago). The browser (filter.js, app.js) and
// the build (scripts/*.mjs) both read it; nothing else names a venue or a
// team. The shared files (app.js, filter.js, styles.css bar its --v-* hues,
// scripts/*.mjs bar fetch-events.mjs and sources.mjs) are lqa-events' own,
// byte for byte — see README "Sister sites".
//
// Loaded before filter.js (a plain script, so the tests can share it): it
// sets globalThis.LQACity (the name is the shared code's, not the city's).
(function (global) {
  'use strict';

  // The home teams, matched on the event title whatever the venue. Order =
  // the Teams strip, left to right. Per team:
  //   re        the title match (Ticketmaster writes "Hawaii Rainbow Warriors
  //             Football vs. …", and the women's volleyball team, oddly,
  //             "Hawaii Rainbow Warriors Womens Volleyball")
  //   venue     the home building; schedule = the program's own schedule page
  //   sport     keys the strip icon (app.js SPORT_ICONS — none for volleyball
  //             yet, so the Wahine's pill carries the crest alone), the game
  //             clock, the leader categories
  //   colors    [primary, accent] — the season calendar's home cells and
  //             card frames (UH green and the grey of the away kit)
  //   espn      ESPN's sport/league/team id — the university is id 62 in
  //             every college league, so the season, the form block and news
  //             all come from there (schedules.mjs). No pro club plays in
  //             Hawaii, and nothing from the mainland is listed.
  //   club      the program's name on Ticketmaster; wiki the article; opens
  //             when the season usually starts
  var UH_LOGO = 'https://a.espncdn.com/i/teamlogos/ncaa/500/62.png';
  var TEAMS = [
    { slug: 'football', label: 'Warriors Football', re: /rainbow warriors football/i, sport: 'football', venue: 'Ching Athletics Complex', colors: ['#024731', '#a7a9ac'],
      espn: { sport: 'football', league: 'college-football', id: '62' }, season: { kind: 'espn' }, form: { kind: 'espn' },
      logo: UH_LOGO, schedule: 'https://hawaiiathletics.com/sports/football/schedule',
      club: 'Hawaii Rainbow Warriors Football', opens: 'late August', wiki: { title: 'Hawaii Rainbow Warriors football', startYear: true } },
    // strip: false was set 2026-10-11 (lifted the same night: schedules.mjs now merges the regular season for college basketball) while ESPN's plain call answers with an empty preseason (the
    // shared adapter asks for the regular season by name only for the NBA) —
    // a filter row, no Teams tab; drop the flag once the season begins in November
    { slug: 'basketball', label: 'Warriors Basketball', re: /rainbow warriors mens basketball|rainbow warriors basketball/i, sport: 'basketball', venue: 'Stan Sheriff Center', colors: ['#024731', '#000000'],
      espn: { sport: 'basketball', league: 'mens-college-basketball', id: '62' }, season: { kind: 'espn' }, form: { kind: 'espn' },
      logo: UH_LOGO, schedule: 'https://hawaiiathletics.com/sports/mens-basketball/schedule',
      club: 'Hawaii Rainbow Warriors Mens Basketball', opens: 'early November', wiki: { title: "Hawaii Rainbow Warriors men's basketball", startYear: true } },
    { slug: 'volleyball', label: 'Wahine Volleyball', re: /womens volleyball|rainbow wahine volleyball/i, sport: 'volleyball', venue: 'Stan Sheriff Center', colors: ['#024731', '#ffffff'],
      espn: { sport: 'volleyball', league: 'womens-college-volleyball', id: '62' }, season: { kind: 'espn' }, form: { kind: 'espn' },
      logo: UH_LOGO, schedule: 'https://hawaiiathletics.com/sports/womens-volleyball/schedule',
      club: 'Hawaii Rainbow Warriors Womens Volleyball', opens: 'late August', wiki: { title: "Hawaii Rainbow Wahine volleyball", startYear: true } },
  ];

  // The venues, one record each — the Blaisdell, the university grounds, the
  // Shell and the Hawaii Theatre first, then the music rooms and the
  // neighbor islands. Per venue:
  //   capacity how many people the place holds
  //   area     'town' for the music rooms across Honolulu and the neighbor
  //            islands' halls (the panel's second group); absent = the
  //            Blaisdell, the stadiums and the theatres
  //   type     the event type when the title decides nothing
  //   cssVar   the hue styles.css sets for it (dark block --v-*); color
  //            the same hue as a value, for the series graph
  //   url      the venue's own events listing — not a ticket vendor
  //   icon     a mark for listings without a team crest
  //   tm       its Ticketmaster Discovery listing (fetch-events.mjs reads
  //            the venue by id — every page). There is NO city sweep: the
  //            Outrigger Waikiki Beachcomber alone lists 579 Cirque du Soleil
  //            performances, which would bury everything else
  //   alias    the other spellings the feeds use for it, folded to this name
  //   geo      [lat, lon] for the Map view's pin (OpenStreetMap's Nominatim, once, by hand)
  //   feed     the room's own calendar, read by scripts/feeds.mjs (kind, url, …)
  // The Maui Arts & Cultural Center and the Kahilu Theatre, listed here from
  // 2026-10-11, moved to the Maui and Kona sites on 2026-10-25 (one site per
  // island; their registry slots stay reserved so old share codes keep meaning
  // what they meant).
  // Looked up and left out (2026-10-11): the Hawaii Convention Center, Les
  // Murakami Stadium, Aloha Stadium (closed for redevelopment), Diamond Head
  // Theatre and Kilohana list nothing on Ticketmaster; Anna O'Brien's,
  // Downbeat, Nextdoor and Waikiki Beach Walk are not on it at all.
  // No festivals yet, so the panel's Festivals group folds away (app.js).
  var VENUES = {
    // --- Honolulu: the Blaisdell, the Shell, the university grounds, the theatres, the music rooms, the museums and the palace ---
    // The Blaisdell's four rooms are read first from the Center's own Events Calendar (FEEDS below, one
    // feed for all four, folded by alias); Ticketmaster fills the dates it lacks (`tm.secondary`).
    'Blaisdell Arena': {
      geo: [21.29895, -157.85142],
      capacity: 8800,
      type: 'concert',
      cssVar: '--v-arena',
      color: '#ea8686',
      url: 'https://www.blaisdellcenter.com/events/',
      icon: 'https://www.google.com/s2/favicons?domain=www.blaisdellcenter.com&sz=128',
      tm: { id: 'KovZpZAEAlEA', match: 'blaisdell arena', fallbackUrl: 'https://www.blaisdellcenter.com/events/', exclude: /\bparking\b|\bluau\b/i, secondary: true },
      alias: /^arena$|blaisdell arena/i,
    },
    'Blaisdell Concert Hall': {
      geo: [21.30109, -157.84982],
      capacity: 2158,
      type: 'arts',
      cssVar: '--v-concerthall',
      color: '#86eaa4',
      url: 'https://www.blaisdellcenter.com/events/',
      icon: 'https://www.google.com/s2/favicons?domain=www.blaisdellcenter.com&sz=128',
      tm: { id: 'KovZpZAF6E7A', match: 'blaisdell concert hall', fallbackUrl: 'https://www.blaisdellcenter.com/events/', exclude: /\bparking\b/i, secondary: true },
      alias: /^concert hall$|blaisdell concert hall/i,
    },
    'Blaisdell Exhibition Hall': {
      geo: [21.29989, -157.85089],
      capacity: 5000,
      type: 'community',
      cssVar: '--v-exhibition',
      color: '#c086ea',
      url: 'https://www.blaisdellcenter.com/events/',
      icon: 'https://www.google.com/s2/favicons?domain=www.blaisdellcenter.com&sz=128',
      tm: { id: 'KovZpapZGe', match: 'blaisdell exhibition hall', fallbackUrl: 'https://www.blaisdellcenter.com/events/', exclude: /\bparking\b/i, secondary: true },
      alias: /exhibition hall/i,
    },
    'Stan Sheriff Center': {
      geo: [21.29431, -157.81892],
      capacity: 10300,
      type: 'sports',
      cssVar: '--v-sheriff',
      color: '#eade86',
      url: 'https://hawaiiathletics.com/calendar',
      icon: 'https://www.google.com/s2/favicons?domain=hawaiiathletics.com&sz=128',
      tm: { id: 'KovZpZA1tdeA', match: 'stan sheriff', fallbackUrl: 'https://hawaiiathletics.com/calendar', exclude: /\bparking\b/i },
      alias: /stan sheriff|bankoh arena/i,
    },
    'Ching Athletics Complex': {
      geo: [21.29429, -157.81712],
      capacity: 15000,
      type: 'sports',
      cssVar: '--v-ching',
      color: '#86d9ea',
      url: 'https://hawaiiathletics.com/sports/football/schedule',
      icon: 'https://www.google.com/s2/favicons?domain=hawaiiathletics.com&sz=128',
      tm: { id: 'Z7r9jZa7qr', match: 'ching athletics', fallbackUrl: 'https://hawaiiathletics.com/sports/football/schedule', exclude: /\bparking\b/i },
      alias: /ching athletics|ching complex|ching field/i,
    },
    'Waikiki Shell': {
      geo: [21.26819, -157.81856],
      capacity: 8400,
      type: 'concert',
      cssVar: '--v-shell',
      color: '#ea86bb',
      url: 'https://www.blaisdellcenter.com/events/',
      icon: 'https://www.google.com/s2/favicons?domain=www.blaisdellcenter.com&sz=128',
      tm: { id: 'KovZpZAFAt7A', match: 'waikiki shell', fallbackUrl: 'https://www.blaisdellcenter.com/events/', exclude: /\bparking\b|\bluau\b/i, secondary: true },
      alias: /waik[iī]k[iī] shell/i,
    },
    'Hawaii Theatre Center': {
      geo: [21.31098, -157.86123],
      capacity: 1400,
      type: 'arts',
      cssVar: '--v-hawaiitheatre',
      color: '#9fea86',
      url: 'https://www.hawaiitheatre.com/upcoming-events/',
      icon: 'https://www.google.com/s2/favicons?domain=www.hawaiitheatre.com&sz=128',
      tm: { id: 'KovZpabZIe', match: 'hawaii theatre', fallbackUrl: 'https://www.hawaiitheatre.com/upcoming-events/', exclude: /\bparking\b|theatre tour/i },
      // the theatre's own grid (JetEngine) lists three times what Ticketmaster does but prints no
      // clocks, so it stands behind Ticketmaster's timed rows and fills the dates they lack
      feed: { kind: 'cards', secondary: true, url: 'https://www.hawaiitheatre.com/upcoming-events/', item: '<div class="jet-listing-grid__item ', title: /href="([^"]+)">\s*<img[\s\S]*?<h2 class="elementor-heading-title[^"]*">([^<]+)<\/h2>/, when: /jet-listing-dynamic-field__content"\s*>([^<]*)</ },
      alias: /hawaii theat/i,
    },
    'Diamond Head Theatre': {
      geo: [21.2711, -157.80331],
      capacity: 480,
      type: 'arts',
      cssVar: '--v-diamondhead',
      color: '#ea869f',
      url: 'https://www.diamondheadtheatre.com/shows-tickets/',
      icon: 'https://www.google.com/s2/favicons?domain=www.diamondheadtheatre.com&sz=128',
      tm: { id: 'KovZpZAaEvAA', match: 'diamond head', fallbackUrl: 'https://www.diamondheadtheatre.com/shows-tickets/' },
      alias: /diamond head theat/i,
    },
    'Kumu Kahua Theatre': {
      geo: [21.30959, -157.86314],
      capacity: 100,
      type: 'arts',
      cssVar: '--v-kumukahua',
      color: '#86c0ea',
      url: 'https://www.kumukahua.org/',
      icon: 'https://www.google.com/s2/favicons?domain=www.kumukahua.org&sz=128',
      feed: { kind: 'linked', url: 'https://www.kumukahua.org/' }, // each production links to Eventbrite, whose page carries the run's schema.org Event
      alias: /kumu kahua/i,
    },
    'Honolulu Museum of Art': {
      geo: [21.30419, -157.84808],
      capacity: 280,
      type: 'arts',
      cssVar: '--v-homa',
      color: '#86eadc',
      url: 'https://honolulumuseum.org/events',
      icon: 'https://www.google.com/s2/favicons?domain=honolulumuseum.org&sz=128',
      feed: { kind: 'linked', url: 'https://honolulumuseum.org/events', match: /honolulumuseum\.org\/events\/[^/?#]+$/, drop: /\btours?\b|ツアー|—\s*(mon|tues|wednes|thurs|fri|satur|sun)days\b/i }, // the listing's event pages each carry a schema.org Event — films at the Doris Duke Theatre, HoMA Nights, talks; the standing gallery tours (a weekday rota in the title, 27 dates each) are left out
      alias: /doris duke|honolulu museum of art/i,
    },
    'Orvis Auditorium': {
      geo: [21.29589, -157.82039],
      capacity: 500,
      type: 'arts',
      cssVar: '--v-orvis',
      color: '#86ea86',
      url: 'https://manoa.hawaii.edu/music/events/',
      icon: 'https://www.google.com/s2/favicons?domain=manoa.hawaii.edu&sz=128',
      feed: { kind: 'tribe', url: 'https://manoa.hawaii.edu/music/wp-json/tribe/events/v1/events', rooms: /orvis|smith amphitheater|room 108/i }, // UH Mānoa Music's calendar: recitals, the orchestra, guest artists at Orvis and the Barbara Smith Amphitheater
      alias: /orvis/i,
    },
    'Bishop Museum': {
      geo: [21.33308, -157.87071],
      capacity: 5000,
      type: 'community',
      cssVar: '--v-bishop',
      color: '#e1ea86',
      url: 'https://www.bishopmuseum.org/exhibits-and-programs/events/',
      icon: 'https://www.google.com/s2/favicons?domain=www.bishopmuseum.org&sz=128',
      feed: { kind: 'jsonld', url: 'https://www.bishopmuseum.org/exhibits-and-programs/events/' }, // the museum's calendar page carries a schema.org Event per listing (Great Lawn concerts, planetarium nights, hula)
      alias: /bishop museum/i,
    },
    'ʻIolani Palace': {
      geo: [21.30681, -157.85877],
      capacity: 1000,
      type: 'community',
      cssVar: '--v-iolani',
      color: '#86a4ea',
      url: 'https://www.iolanipalace.org/events/',
      icon: 'https://www.google.com/s2/favicons?domain=www.iolanipalace.org&sz=128',
      feed: { kind: 'cards', url: 'https://www.iolanipalace.org/events/', item: '<li class="col-md-4 col-sm-6 grid-item', title: /<h3><a href="([^"]+)">([^<]+)<\/a><\/h3>/, when: /<span class="date">(\d+)<\/span>\s*<span class="month">([A-Za-z]+)[^<]*<\/span>[\s\S]*?<div class="meta-data[^"]*">\s*<div>([^<]*)<\/div>/ }, // the palace grid: Royal Hawaiian Band Fridays, Kamaʻāina Sundays, evening tours
      alias: /iolani palace/i,
    },
    'Hawaiian Mission Houses': {
      geo: [21.3058, -157.8578],
      capacity: 300,
      type: 'community',
      cssVar: '--v-missionhouses',
      color: '#a786ea',
      url: 'https://missionhouses.org/events/',
      icon: 'https://www.google.com/s2/favicons?domain=missionhouses.org&sz=128',
      feed: { kind: 'cards', url: 'https://missionhouses.org/events/', item: '<article class="mec-event-article', title: /<h3 class="mec-event-title"><a [^>]*href="([^"]+)"[^>]*>([^<]+)<\/a>/, when: /<span class="mec-start-date-label">([^<]+)<\/span>[\s\S]*?<span class="mec-start-time">([^<]+)<\/span>/ }, // the Modern Events Calendar list: ʻOhana Days, the craft fair, parade viewing
      alias: /mission houses/i,
    },
    'HB Social Club': { // Hawaiian Brian's until 2025 — same room (1680 Kapiʻolani: Crossroads, the Slack Key Lounge), new name and site
      geo: [21.29147, -157.83816],
      capacity: 800,
      type: 'concert',
      cssVar: '--v-hbsocial',
      color: '#86eac5',
      url: 'https://hbsocialclub.com/events/',
      icon: 'https://www.google.com/s2/favicons?domain=hbsocialclub.com&sz=128',
      tm: { id: 'Z7r9jZa7c3', match: 'hb social club', fallbackUrl: 'https://hbsocialclub.com/events/', secondary: true },
      feed: { kind: 'cards', url: 'https://hbsocialclub.com/events/', item: '<article class="event-card', title: /<h3 class="event-card-title"><a href="([^"]+)">([^<]+)<\/a>/, when: /<div class="event-card-date">([^<]*)<span[^>]*>[^<]*<\/span>[^<]*<\/div><div class="event-card-times">([^<]*)<\/div>/ },
      alias: /hawaiian brian|hb social club/i,
    },
    'The Republik': {
      geo: [21.29357, -157.8454],
      capacity: 1000,
      type: 'concert',
      cssVar: '--v-republik',
      color: '#8b86ea',
      url: 'https://jointherepublik.com/',
      icon: 'https://www.google.com/s2/favicons?domain=jointherepublik.com&sz=128',
      tm: { id: 'KovZpZAIJF7A', match: 'republik', fallbackUrl: 'https://jointherepublik.com/' }, // its own site is bot-walled (403 to everything but a browser), so Ticketmaster is the only reading
      alias: /republik/i,
    },
    'Blue Note Hawaii': {
      geo: [21.27715, -157.82767],
      capacity: 300,
      type: 'concert',
      cssVar: '--v-bluenote',
      color: '#eaa786',
      url: 'https://www.bluenotehawaii.com/',
      icon: 'https://www.google.com/s2/favicons?domain=www.bluenotehawaii.com&sz=128',
      tm: { id: 'KovZpZAktFvA', match: 'blue note', fallbackUrl: 'https://www.bluenotehawaii.com/' },
      alias: /blue note/i,
    },
    "Hula's Bar & Lei Stand": {
      geo: [21.27182, -157.82187],
      capacity: 200,
      type: 'concert',
      cssVar: '--v-hulas',
      color: '#eac086',
      url: 'https://hulas.com/events/',
      icon: 'https://www.google.com/s2/favicons?domain=hulas.com&sz=128',
      feed: { kind: 'tribe', url: 'https://www.hulas.com/wp-json/tribe/events/v1/events' }, // the bar's Events Calendar; its near-nightly Live Sessions fall under the feed's daily-row rule, the one-offs and the catamaran stay
      alias: /hula.s bar/i,
    },
    'Royal Hawaiian Center': {
      geo: [21.27846, -157.82928],
      capacity: 500,
      type: 'community',
      cssVar: '--v-royalhawaiian',
      color: '#d686ea',
      url: 'https://www.royalhawaiiancenter.com/events',
      icon: 'https://www.google.com/s2/favicons?domain=www.royalhawaiiancenter.com&sz=128',
      feed: { kind: 'squarespace', url: 'https://www.royalhawaiiancenter.com/events' }, // the Royal Grove's hula and music, lessons, the holiday kick-off
      alias: /royal hawaiian center|royal grove/i,
    },
    'SALT at Our Kakaʻako': {
      geo: [21.29819, -157.86148],
      capacity: 2000,
      type: 'community',
      cssVar: '--v-salt',
      color: '#ea9a86',
      url: 'https://saltatkakaako.com/events/',
      icon: 'https://www.google.com/s2/favicons?domain=saltatkakaako.com&sz=128',
      feed: { kind: 'tribe', url: 'https://saltatkakaako.com/wp-json/tribe/events/v1/events', maxRepeat: 12 }, // the block's Events Calendar is all weekly nights (trivia, live music, markets), ten dates each — kept, where the default rule would read them as hours
      alias: /salt at (our )?kaka/i,
    },
    // --- Around Oʻahu (`area: 'town'`): Kāneʻohe and the North Shore ---
    'Palikū Theatre': {
      area: 'town',
      geo: [21.40856, -157.81347],
      capacity: 300,
      type: 'arts',
      cssVar: '--v-paliku',
      color: '#b8ea86',
      url: 'https://windward.hawaii.edu/campus-life/events-calendar/',
      icon: 'https://www.google.com/s2/favicons?domain=windward.hawaii.edu&sz=128',
      feed: { kind: 'jsonld', url: 'https://windward.hawaii.edu/campus-life/events-calendar/', at: /palik/i }, // Windward CC's calendar carries a schema.org Event per listing; only the theatre's rows are kept
      alias: /palik[uū] theat/i,
    },
    'Waimea Valley': {
      area: 'town',
      geo: [21.63637, -158.0548],
      capacity: 2000,
      type: 'community',
      cssVar: '--v-waimea',
      color: '#ea86d9',
      url: 'https://www.waimeavalley.net/events',
      icon: 'https://www.google.com/s2/favicons?domain=www.waimeavalley.net&sz=128',
      feed: { kind: 'squarespace', url: 'https://www.waimeavalley.net/events' }, // moonwalks, the Makahiki festival, the royal birthdays
      alias: /waimea valley/i,
    },
  };

  // The usual view: every room on but the Blue Note, whose two sets a night
  // (114 dates on the first build, more than every other room together)
  // would bury the list, and the two weekly-nights calendars (SALT, Hula's)
  var DEFAULT_ON = ['Blaisdell Arena', 'Blaisdell Concert Hall', 'Blaisdell Exhibition Hall', 'Stan Sheriff Center', 'Ching Athletics Complex', 'Waikiki Shell', 'Hawaii Theatre Center', 'Diamond Head Theatre', 'Kumu Kahua Theatre', 'Honolulu Museum of Art', 'Orvis Auditorium', 'Bishop Museum', 'ʻIolani Palace', 'Hawaiian Mission Houses', 'HB Social Club', 'The Republik', 'Royal Hawaiian Center', 'Palikū Theatre', 'Waimea Valley'];
  var DEFAULT_OFF = ['Blue Note Hawaii', "Hula's Bar & Lei Stand", 'SALT at Our Kakaʻako'];
  var PREFS_KNOWN_FROM = 'Diamond Head Theatre'; // saved prefs older than this room (the first of the 2026-10-25 additions) are told about the new rooms once

  // Event types: every event lands in exactly one, from its flags, title,
  // then venue. The rows the panel shows, in order.
  var TYPES = [
    { key: 'concert', label: 'Concerts', title: 'Live music — arena tours to club nights' },
    { key: 'sports', label: 'Sports', title: 'Rainbow Warriors football and basketball, Rainbow Wahine volleyball — home games' },
    { key: 'arts', label: 'Arts & Theater', title: 'Broadway tours, the symphony and the opera at the Blaisdell, the Hawaii Theatre, comedy, dance' },
    { key: 'community', label: 'Community', title: 'Expos, festivals, family days' },
  ];
  var MOVIE_VENUE = null; // no cinema here

  // Share codes (?f=CODE): REGISTRY is every filterable key in a fixed
  // order and a code is a bitmask over it, so the list is APPEND-ONLY —
  // adding an entry adds a bit and every existing code keeps meaning what
  // it meant; removing or reordering one changes every link out there.
  // 23 slots from the first build (five base-36 digits); 36 since 2026-10-25, when the thirteen
  // rooms of the Oʻahu refresh were appended: seven digits. Three slots name rooms the site no
  // longer lists (the two neighbour-island rooms, moved to the Maui and Kona sites, and Hawaiian
  // Brian's, renamed HB Social Club) — they stay so older codes keep their meaning.
  var CODE_LENGTH = 7;
  var REGISTRY = [
    ['venue', 'Blaisdell Arena'], ['venue', 'Blaisdell Concert Hall'], ['venue', 'Blaisdell Exhibition Hall'], ['venue', 'Stan Sheriff Center'], ['venue', 'Ching Athletics Complex'], ['venue', 'Waikiki Shell'], ['venue', 'Hawaii Theatre Center'], ['venue', 'The Republik'], ['venue', 'Blue Note Hawaii'], ['venue', "Hawaiian Brian's"], ['venue', 'Maui Arts & Cultural Center'], ['venue', 'Kahilu Theatre'],
    ['badge', 'concert'], ['badge', 'sports'], ['badge', 'arts'], ['badge', 'community'],
    ['team', 'football'], ['team', 'basketball'], ['team', 'volleyball'],
    ['cap', 'stadium'], ['cap', 'arena'], ['cap', 'hall'], ['cap', 'room'],
    ['venue', 'Diamond Head Theatre'], ['venue', 'Kumu Kahua Theatre'], ['venue', 'Honolulu Museum of Art'], ['venue', 'Orvis Auditorium'], ['venue', 'Bishop Museum'], ['venue', 'ʻIolani Palace'], ['venue', 'Hawaiian Mission Houses'], ['venue', 'HB Social Club'], ['venue', "Hula's Bar & Lei Stand"], ['venue', 'Royal Hawaiian Center'], ['venue', 'SALT at Our Kakaʻako'], ['venue', 'Palikū Theatre'], ['venue', 'Waimea Valley'],
  ];

  // The words the page uses for the place
  var WORDS = {
    teamCity: 'Hawaii', // the board drops it from the programs' names ("Hawaii Rainbow Warriors Football" → Rainbow Warriors Football)
    presetDefault: 'Every venue — the Blaisdell, the Shell, the university grounds, the theatres, the museums, the palace and the music venues, Kāneʻohe and the North Shore too — every team and type',
    presetNeighborhood: 'Honolulu proper — without Kāneʻohe and the North Shore',
    presetBig: 'Only the places that hold 2,000 or more — the Blaisdell, the Shell, the university grounds, the Bishop Museum lawn and the open-air grounds',
    phrases: { all: 'Showing everything.', none: 'Showing nothing yet — open Filter and pick some venues.', neighborhood: 'Showing Honolulu proper — without Kāneʻohe and the North Shore.', big: 'Showing the big venues only — the Blaisdell, the Shell, the university grounds and the open-air grounds.' },
  };

  // City-wide feeds (scripts/feeds.mjs), folded onto the rooms by alias:
  //  - the Blaisdell Center's Events Calendar names its room per row (Arena, Concert Hall,
  //    Exhibition Hall, Tom Moffatt Waikīkī Shell) — the voice of record for the four rooms,
  //    Ticketmaster behind it; its weekly Farmers Market, the parking notices and the box-office
  //    closures are dropped by title; `maxRepeat` lifted so a 16-show Broadway run is not read as hours
  //  - Chamber Music Hawaii's season plays the Doris Duke Theatre, Palikū and Orvis
  var FEEDS = [
    { kind: 'tribe', label: 'Blaisdell Center calendar', url: 'https://www.blaisdellcenter.com/wp-json/tribe/events/v1/events', drop: /farmers market|\bparking\b|box office is closed/i, maxRepeat: 40 },
    { kind: 'tribe', label: 'Chamber Music Hawaii', url: 'https://chambermusichawaii.org/wp-json/tribe/events/v1/events', type: 'arts' },
  ];

  // Hawaiʻi's public holidays (app.js holidaysFor reads this instead of its
  // Seattle list): the federal set without Columbus Day and Juneteenth, which
  // the state does not observe, plus its own three — Prince Kūhiō Day, King
  // Kamehameha I Day and Statehood Day — and Good Friday.
  function nthWeekday(y, month, weekday, n) { var d = new Date(y, month, 1); while (d.getDay() !== weekday) d.setDate(d.getDate() + 1); d.setDate(d.getDate() + (n - 1) * 7); return d; }
  function lastMonday(y, month) { var d = new Date(y, month + 1, 0); while (d.getDay() !== 1) d.setDate(d.getDate() - 1); return d; }
  function easter(y) { // Gregorian computus (Meeus/Jones/Butcher)
    var a = y % 19, b = Math.floor(y / 100), c = y % 100, d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3);
    var h = (19 * a + b - d - g + 15) % 30, i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451);
    var month = Math.floor((h + l - 7 * m + 114) / 31), day = ((h + l - 7 * m + 114) % 31) + 1;
    return new Date(y, month - 1, day);
  }
  var HOLIDAYS = function (y) {
    var gf = easter(y); gf.setDate(gf.getDate() - 2);
    return [
      [new Date(y, 0, 1), "New Year's Day"],
      [nthWeekday(y, 0, 1, 3), 'Martin Luther King Jr. Day'],
      [nthWeekday(y, 1, 1, 3), "Presidents' Day"],
      [new Date(y, 2, 26), 'Prince Kūhiō Day'],
      [gf, 'Good Friday'],
      [lastMonday(y, 4), 'Memorial Day'],
      [new Date(y, 5, 11), 'King Kamehameha I Day'],
      [new Date(y, 6, 4), 'Independence Day'],
      [nthWeekday(y, 7, 5, 3), 'Statehood Day'],
      [nthWeekday(y, 8, 1, 1), 'Labor Day'],
      [new Date(y, 10, 11), 'Veterans Day'],
      [nthWeekday(y, 10, 4, 4), 'Thanksgiving'],
      [new Date(y, 11, 25), 'Christmas Day'],
    ];
  };

  global.LQACity = {
    key: 'honolulu',
    name: 'Honolulu',
    site: 'https://honolulu.here.events/',
    userAgent: 'Mozilla/5.0 (compatible; honolulu-events/1.0; +https://honolulu.here.events/)',
    tz: 'Pacific/Honolulu', tzName: 'Hawaii', // the city's time zone (no daylight time): the ICS feed's TZID, the game clocks, the poster's footer
    state: "Hawaii", stateOutline: 'M3.7 6.3L3.3 6.5L3.1 6.4L2.7 6.3L2.6 6.2L2.2 6.0L2.0 5.8L2.3 5.4L2.8 5.0L3.8 5.0L3.9 5.3L4.0 5.5L3.8 5.7L3.8 6.1L3.7 6.3ZM10.0 8.3L10.1 8.3L10.3 8.3L10.4 8.6L10.6 8.8L10.6 8.9L10.4 9.1L10.0 9.1L9.8 9.0L9.6 8.8L9.3 8.9L9.3 8.7L9.3 8.6L9.1 8.7L9.3 8.9L8.9 8.9L8.7 8.9L8.6 8.6L8.2 8.2L8.2 8.0L8.1 7.7L8.7 7.7L9.1 7.3L9.3 7.2L9.8 7.9L9.8 8.1L9.9 8.2L10.0 8.3ZM12.3 9.3L13.2 9.4L13.4 9.4L13.5 9.5L14.2 9.6L14.3 9.6L14.2 9.8L13.8 10.0L13.1 9.8L12.0 9.8L12.1 9.6L12.2 9.5L12.2 9.3L12.3 9.3ZM15.2 10.5L15.4 10.6L15.8 10.5L16.1 10.5L16.6 10.7L16.8 10.9L17.1 11.1L17.2 11.3L17.1 11.5L16.8 11.8L16.3 11.8L16.0 12.0L15.6 11.9L15.4 11.9L15.4 11.5L15.3 11.1L15.0 11.2L14.7 11.0L14.4 10.7L14.4 10.5L14.6 10.1L14.9 10.1L15.1 10.3L15.2 10.5ZM18.9 18.8L18.7 19.0L18.5 19.0L17.7 18.5L17.6 18.3L17.6 17.2L17.3 16.3L17.0 15.6L17.2 15.3L17.6 15.0L17.9 14.5L17.6 13.8L17.7 13.4L17.9 13.4L18.7 13.8L20.4 14.6L20.9 15.1L20.9 15.6L21.3 15.7L21.4 16.1L21.9 16.4L22.0 16.6L21.8 16.9L21.0 17.5L20.0 17.7L19.1 18.4L18.9 18.8Z', // the masthead's small state, linking to here.events (scripts/state-outline.mjs, Natural Earth 1:50m)
    // the calendar feed's header; the UID domain never changes (changing it
    // re-creates every event in subscribers' calendars)
    ics: { name: 'Honolulu Events', short: 'Honolulu Events', teams: 'Hawaii home teams — every season', prodid: '-//here.events//honolulu-events//EN', uidDomain: 'fosdal.net', // the UID domain the whole family issues (the shared ics test pins it)
      desc: 'Upcoming events around Honolulu — the Blaisdell Center\\, the Waikiki Shell\\, the Stan Sheriff Center\\, the Hawaii Theatre and the music rooms' },
    teams: TEAMS,
    // the Map view (site/local-map.js, the Map stop): the ground scripts/build-local-map.mjs draws into site/local-map.json
    // — Oʻahu's shoreline, named waters and main roads from OpenStreetMap through Overpass, once, cached — with a pin on
    // every room above that carries geo: [lat, lon]. The frame is the whole island; the view opens on Honolulu itself.
    map: {
      kind: 'urban',
      bbox: [21.24, -158.3, 21.73, -157.63], // south, west, north, east — the whole island, Kaʻena Point to Makapuʻu
      home: [21.255, -157.905, 21.335, -157.78], // the view at first: Pearl Harbor's mouth to Diamond Head; the fit button shows the island
      roads: ['motorway', 'trunk', 'primary'],
      tolerance: 0.8,
      labels: [ // the places a visitor steers by; anchor: which side of the dot the name sits
        { name: 'Downtown', lat: 21.309, lon: -157.862, anchor: 'end' },
        { name: 'Chinatown', lat: 21.313, lon: -157.863, anchor: 'end', dy: -10 },
        { name: 'Kakaʻako', lat: 21.297, lon: -157.855, anchor: 'start', dy: 12 },
        { name: 'Ala Moana', lat: 21.291, lon: -157.843, anchor: 'start', dy: 12 },
        { name: 'Waikīkī', lat: 21.279, lon: -157.829, anchor: 'start', dy: 12 },
        { name: 'Diamond Head', lat: 21.262, lon: -157.806, anchor: 'start' },
        { name: 'Mānoa', lat: 21.31, lon: -157.81, anchor: 'start' },
        { name: 'Kaimukī', lat: 21.284, lon: -157.8, anchor: 'start' },
        { name: 'Kalihi', lat: 21.333, lon: -157.875, anchor: 'end' },
        { name: 'Pearl Harbor', lat: 21.355, lon: -157.96, anchor: 'end' },
        { name: 'ʻAiea', lat: 21.385, lon: -157.93, anchor: 'start' },
        { name: 'Kapolei', lat: 21.335, lon: -158.058, anchor: 'end' },
        { name: 'Koʻolina', lat: 21.335, lon: -158.12, anchor: 'end', dy: 12 },
        { name: 'Hawaiʻi Kai', lat: 21.28, lon: -157.71, anchor: 'start' },
        { name: 'Kailua', lat: 21.4, lon: -157.74, anchor: 'start' },
        { name: 'Kāneʻohe', lat: 21.41, lon: -157.8, anchor: 'end' },
        { name: 'Kualoa', lat: 21.52, lon: -157.84, anchor: 'start' },
        { name: 'Lāʻie', lat: 21.65, lon: -157.925, anchor: 'start' },
        { name: 'Haleʻiwa', lat: 21.593, lon: -158.103, anchor: 'end' },
        { name: 'Wahiawā', lat: 21.5, lon: -158.02, anchor: 'end' },
      ],
    },
    venues: VENUES,
    feeds: FEEDS,
    defaultOn: DEFAULT_ON,
    defaultOff: DEFAULT_OFF,
    prefsKnownFrom: PREFS_KNOWN_FROM,
    types: TYPES,
    movieVenue: MOVIE_VENUE,
    groundsVenue: null, // every listing is read by room, so nothing arrives under a name city.js lacks
    codeLength: CODE_LENGTH,
    registry: REGISTRY,
    words: WORDS,
    holidays: HOLIDAYS,
  };
})(typeof globalThis !== 'undefined' ? globalThis : window);
