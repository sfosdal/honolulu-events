# Honolulu Events

Event feed and calendar for Honolulu: the Neal S. Blaisdell Center (arena,
concert hall and exhibition hall), the Stan Sheriff Center and the Ching
Athletics Complex on the Manoa campus, the Waikiki Shell, the Hawaii Theatre,
the music rooms (the Republik, Blue Note Hawaii, Hawaiian Brian's) and the
neighbor islands' halls (the Maui Arts & Cultural Center, Kahilu Theatre in
Waimea) — with the University of Hawaii's seasons (Rainbow Warriors football
and basketball, Rainbow Wahine volleyball) in a Teams view. No pro club plays
in Hawaii.

Live at **https://honolulu.here.events/** once the domain is wired (GitHub
Pages, built by the Actions workflow once a day at noon Hawaii time).

One of the cities on the lqa-events codebase, after Everett and Chicago:
everything that makes this Honolulu's is `site/city.js` (every team, venue,
type, default, share-code registry and string), `site/index.html`,
`scripts/fetch-events.mjs` (the sources), `scripts/sources.mjs`,
`site/embed.js`, `outlook.json`, `scripts/data/postseason.json`,
`channels.json` (national numbers only), the manifest and icons (a hibiscus,
rendered from `favicon.svg`). Everything else is lqa-events' own, byte for
byte — copy from there, never edit here.

## Embed

```html
<div id="honolulu-events"></div>
<script src="https://honolulu.here.events/embed.js" data-max="8" defer></script>
```

## Sources

- **Ticketmaster Discovery API** — every room by its venue id (every page):
  12 rooms, from the Blaisdell Arena to the 300-seat Blue Note. There is no
  city sweep: the Outrigger Waikiki Beachcomber alone lists 579 Cirque du
  Soleil performances. Thirteen here.events builds share the one key, so the
  calls are paced 1.5 s apart and a 429 waits and retries. Church events are
  left out (`isChurch`). The Blue Note is default-off (two sets a night, more
  dates than every other room together).
- **Seasons** — ESPN for the Rainbow Warriors (team id 62 in every college
  league): football at the Ching Athletics Complex, men's basketball and the
  Rainbow Wahine's volleyball at the Stan Sheriff Center
  (`scripts/schedules.mjs`, shared with lqa). Basketball is a filter row
  without a Teams tab (`strip: false`) until its regular season begins —
  ESPN's plain call answers with an empty preseason until then.

Looked up and left out (nothing on Ticketmaster): the Hawaii Convention
Center, Les Murakami Stadium, Aloha Stadium, Diamond Head Theatre, Kilohana;
Anna O'Brien's, Downbeat, Nextdoor and Waikiki Beach Walk are not on it at all.
Next to add: the rooms whose shows Ticketmaster never lists (the Hawaii
Symphony's own box office, Kumu Kahua Theatre, Manoa Valley Theatre, the
Honolulu Museum of Art) and the Rainbow Warriors' baseball season at Les
Murakami Stadium (ESPN college-baseball id 79) once the shared adapter stops
flagging a whole college season as preseason.

## Local run

```sh
cp .env.example .env   # TICKETMASTER_API_KEY=…
ALLOW_NO_ARCHIVE=1 node scripts/fetch-events.mjs   # ALLOW_NO_ARCHIVE only until the site has published once
node --test scripts/*.test.mjs
```
