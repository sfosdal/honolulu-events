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
    // strip: false while ESPN's plain call answers with an empty preseason (the
    // shared adapter asks for the regular season by name only for the NBA) —
    // a filter row, no Teams tab; drop the flag once the season begins in November
    { slug: 'basketball', label: 'Warriors Basketball', re: /rainbow warriors mens basketball|rainbow warriors basketball/i, sport: 'basketball', venue: 'Stan Sheriff Center', colors: ['#024731', '#000000'], strip: false,
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
  // Looked up and left out (2026-10-11): the Hawaii Convention Center, Les
  // Murakami Stadium, Aloha Stadium (closed for redevelopment), Diamond Head
  // Theatre and Kilohana list nothing on Ticketmaster; Anna O'Brien's,
  // Downbeat, Nextdoor and Waikiki Beach Walk are not on it at all.
  // No festivals yet, so the panel's Festivals group folds away (app.js).
  var VENUES = {
    // --- The Blaisdell, the university grounds, the Shell and the theatres ---
    'Blaisdell Arena': {
      capacity: 8800,
      type: 'concert',
      cssVar: '--v-arena',
      color: '#ea8686',
      url: 'https://www.blaisdellcenter.com/events/',
      icon: 'https://www.google.com/s2/favicons?domain=www.blaisdellcenter.com&sz=128',
      tm: { id: 'KovZpZAEAlEA', match: 'blaisdell arena', fallbackUrl: 'https://www.blaisdellcenter.com/events/', exclude: /\bparking\b|\bluau\b/i },
      alias: /blaisdell arena/i,
    },
    'Blaisdell Concert Hall': {
      capacity: 2158,
      type: 'arts',
      cssVar: '--v-concerthall',
      color: '#86eaa4',
      url: 'https://www.blaisdellcenter.com/events/',
      icon: 'https://www.google.com/s2/favicons?domain=www.blaisdellcenter.com&sz=128',
      tm: { id: 'KovZpZAF6E7A', match: 'blaisdell concert hall', fallbackUrl: 'https://www.blaisdellcenter.com/events/', exclude: /\bparking\b/i },
      alias: /blaisdell concert hall/i,
    },
    'Blaisdell Exhibition Hall': {
      capacity: 5000,
      type: 'community',
      cssVar: '--v-exhibition',
      color: '#c086ea',
      url: 'https://www.blaisdellcenter.com/events/',
      icon: 'https://www.google.com/s2/favicons?domain=www.blaisdellcenter.com&sz=128',
      tm: { id: 'KovZpapZGe', match: 'blaisdell exhibition hall', fallbackUrl: 'https://www.blaisdellcenter.com/events/', exclude: /\bparking\b/i },
      alias: /blaisdell exhibition/i,
    },
    'Stan Sheriff Center': {
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
      capacity: 8400,
      type: 'concert',
      cssVar: '--v-shell',
      color: '#ea86bb',
      url: 'https://www.blaisdellcenter.com/events/',
      icon: 'https://www.google.com/s2/favicons?domain=www.blaisdellcenter.com&sz=128',
      tm: { id: 'KovZpZAFAt7A', match: 'waikiki shell', fallbackUrl: 'https://www.blaisdellcenter.com/events/', exclude: /\bparking\b|\bluau\b/i },
      alias: /waikiki shell/i,
    },
    'Hawaii Theatre Center': {
      capacity: 1400,
      type: 'arts',
      cssVar: '--v-hawaiitheatre',
      color: '#9fea86',
      url: 'https://www.hawaiitheatre.com/events/',
      icon: 'https://www.google.com/s2/favicons?domain=www.hawaiitheatre.com&sz=128',
      tm: { id: 'KovZpabZIe', match: 'hawaii theatre', fallbackUrl: 'https://www.hawaiitheatre.com/events/', exclude: /\bparking\b|theatre tour/i },
      alias: /hawaii theat/i,
    },
    // --- Music rooms and the neighbor islands (`area: 'town'`): Kakaako, Waikiki, Moiliili, then Maui and Waimea ---
    'The Republik': {
      area: 'town',
      capacity: 1000,
      type: 'concert',
      cssVar: '--v-republik',
      color: '#8b86ea',
      url: 'https://jointherepublik.com/',
      icon: 'https://www.google.com/s2/favicons?domain=jointherepublik.com&sz=128',
      tm: { id: 'KovZpZAIJF7A', match: 'republik', fallbackUrl: 'https://jointherepublik.com/' },
      alias: /republik/i,
    },
    'Blue Note Hawaii': {
      area: 'town',
      capacity: 300,
      type: 'concert',
      cssVar: '--v-bluenote',
      color: '#eaa786',
      url: 'https://www.bluenotehawaii.com/',
      icon: 'https://www.google.com/s2/favicons?domain=www.bluenotehawaii.com&sz=128',
      tm: { id: 'KovZpZAktFvA', match: 'blue note', fallbackUrl: 'https://www.bluenotehawaii.com/' },
      alias: /blue note/i,
    },
    "Hawaiian Brian's": {
      area: 'town',
      capacity: 600,
      type: 'concert',
      cssVar: '--v-brians',
      color: '#86eac5',
      url: 'https://www.hawaiianbrians.com/',
      icon: 'https://www.google.com/s2/favicons?domain=www.hawaiianbrians.com&sz=128',
      tm: { id: 'Z7r9jZa7c3', match: 'hawaiian brian', fallbackUrl: 'https://www.hawaiianbrians.com/' },
      alias: /hawaiian brian|hb social club/i,
    },
    'Maui Arts & Cultural Center': {
      area: 'town',
      capacity: 1200,
      type: 'arts',
      cssVar: '--v-macc',
      color: '#e186ea',
      url: 'https://www.mauiarts.org/events',
      icon: 'https://www.google.com/s2/favicons?domain=www.mauiarts.org&sz=128',
      tm: { id: 'KovZpZA1aEAA', match: 'maui arts', fallbackUrl: 'https://www.mauiarts.org/events' },
      alias: /maui arts|castle theater/i,
    },
    'Kahilu Theatre': {
      area: 'town',
      capacity: 490,
      type: 'arts',
      cssVar: '--v-kahilu',
      color: '#d4ea86',
      url: 'https://kahilutheatre.org/',
      icon: 'https://www.google.com/s2/favicons?domain=kahilutheatre.org&sz=128',
      tm: { id: 'KovZ917AVeR', match: 'kahilu', fallbackUrl: 'https://kahilutheatre.org/' },
      alias: /kahilu/i,
    },
  };

  // The usual view: every room on but the Blue Note, whose two sets a night
  // (114 dates on the first build, more than every other room together)
  // would bury the list
  var DEFAULT_ON = ['Blaisdell Arena', 'Blaisdell Concert Hall', 'Blaisdell Exhibition Hall', 'Stan Sheriff Center', 'Ching Athletics Complex', 'Waikiki Shell', 'Hawaii Theatre Center', 'The Republik', "Hawaiian Brian's", 'Maui Arts & Cultural Center', 'Kahilu Theatre'];
  var DEFAULT_OFF = ['Blue Note Hawaii'];
  var PREFS_KNOWN_FROM = 'Blue Note Hawaii'; // saved prefs older than this room are told about it once

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
  // 23 slots from the first build: five base-36 digits.
  var CODE_LENGTH = 5;
  var REGISTRY = [
    ['venue', 'Blaisdell Arena'], ['venue', 'Blaisdell Concert Hall'], ['venue', 'Blaisdell Exhibition Hall'], ['venue', 'Stan Sheriff Center'], ['venue', 'Ching Athletics Complex'], ['venue', 'Waikiki Shell'], ['venue', 'Hawaii Theatre Center'], ['venue', 'The Republik'], ['venue', 'Blue Note Hawaii'], ['venue', "Hawaiian Brian's"], ['venue', 'Maui Arts & Cultural Center'], ['venue', 'Kahilu Theatre'],
    ['badge', 'concert'], ['badge', 'sports'], ['badge', 'arts'], ['badge', 'community'],
    ['team', 'football'], ['team', 'basketball'], ['team', 'volleyball'],
    ['cap', 'stadium'], ['cap', 'arena'], ['cap', 'hall'], ['cap', 'room'],
  ];

  // The words the page uses for the place
  var WORDS = {
    teamCity: 'Hawaii', // the board drops it from the programs' names ("Hawaii Rainbow Warriors Football" → Rainbow Warriors Football)
    presetDefault: 'Every room — the Blaisdell, the Shell, the university grounds, the theatres and the music rooms — every team and type',
    presetNeighborhood: 'The Blaisdell, the Shell, the university grounds and the theatres only',
    presetBig: 'Only the places that hold 2,000 or more — the Blaisdell, the Shell and the university grounds',
    phrases: { all: 'Showing everything.', none: 'Showing nothing yet — open Filter and pick some venues.', neighborhood: 'Showing the Blaisdell, the Shell, the university grounds and the theatres only.', big: 'Showing the big rooms only — the Blaisdell, the Shell and the university grounds.' },
  };

  global.LQACity = {
    key: 'honolulu',
    name: 'Honolulu',
    site: 'https://honolulu.here.events/',
    userAgent: 'Mozilla/5.0 (compatible; honolulu-events/1.0; +https://honolulu.here.events/)',
    tz: 'Pacific/Honolulu', tzName: 'Hawaii', // the city's time zone (no daylight time): the ICS feed's TZID, the game clocks, the poster's footer
    // the calendar feed's header; the UID domain never changes (changing it
    // re-creates every event in subscribers' calendars)
    ics: { name: 'Honolulu Events', short: 'Honolulu Events', teams: 'Hawaii home teams — every season', prodid: '-//here.events//honolulu-events//EN', uidDomain: 'fosdal.net', // the UID domain the whole family issues (the shared ics test pins it)
      desc: 'Upcoming events around Honolulu — the Blaisdell Center\\, the Waikiki Shell\\, the Stan Sheriff Center\\, the Hawaii Theatre and the music rooms' },
    teams: TEAMS,
    venues: VENUES,
    defaultOn: DEFAULT_ON,
    defaultOff: DEFAULT_OFF,
    prefsKnownFrom: PREFS_KNOWN_FROM,
    types: TYPES,
    movieVenue: MOVIE_VENUE,
    groundsVenue: null, // every listing is read by room, so nothing arrives under a name city.js lacks
    codeLength: CODE_LENGTH,
    registry: REGISTRY,
    words: WORDS,
  };
})(typeof globalThis !== 'undefined' ? globalThis : window);
