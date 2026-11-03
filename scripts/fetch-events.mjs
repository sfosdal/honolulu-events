#!/usr/bin/env node
/**
 * Aggregates upcoming events in Honolulu, Oʻahu into site/events.json and site/events.ics. Runs in CI (see
 * .github/workflows/events.yml) and locally for preview. The build itself is the shared scripts/build.mjs
 * (lqa-events' file, like every scripts/*.mjs here); only what is below and site/city.js are this city's.
 */
import './failures.mjs'; // first: every outside call retried, the ones still failing written to failures.json (Steve, 2026-10-29)
import { build } from './build.mjs';
import { CITY } from './badges.mjs';

const blaisdellBlank = (rows) => rows.map((e) => (!e.venue && /blaisdellcenter\.com/.test(e.url || '') ? { ...e, venue: 'Blaisdell Concert Hall' } : e));
const venueType = (rows) => rows.map((e) => (e.type || !CITY.venues[e.venue] ? e : { ...e, type: CITY.venues[e.venue].type }));

await build({
  feedUrl: 'https://honolulu.here.events/events.json',
  archiveUrl: 'https://raw.githubusercontent.com/sfosdal/honolulu-events/archive/events-archive.json',
  listedVenuesOnly: true, decodeEntities: true,
  gateSources: (primary) => primary, // the empty-list gate counts the leading sources
  // the Blaisdell's own calendar names no venue on some rows: the URL says which; a typeless row takes its venue's type
  primary: (s) => [...s.tmFirst, ...s.feedsFirst.map((fn) => async () => blaisdellBlank(await fn()))].map((fn) => async () => venueType(await fn())),
  afterMerge: (merged) => merged.map((e) => (e.venue === "Hawaiian Brian's" ? { ...e, venue: 'HB Social Club' } : e)), // the bar's old name, in the archive
});
