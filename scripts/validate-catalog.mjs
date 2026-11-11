import fs from "node:fs";
const collections=JSON.parse(fs.readFileSync("data/collections.json","utf8"));
const discoveries=JSON.parse(fs.readFileSync("data/discoveries.json","utf8"));
const unique=(arr)=>new Set(arr).size===arr.length;
if(!Array.isArray(collections)||!Array.isArray(discoveries))throw Error("Catalog files must be arrays");
if(!unique(collections.map(c=>c.slug))||!unique(discoveries.map(d=>d.slug)))throw Error("Duplicate slugs");
const known=new Set(discoveries.map(d=>d.slug));
for(const c of collections){if(!c.slug||!c.name||!Array.isArray(c.discoverySlugs))throw Error(`Invalid collection: ${c.slug}`);if(!unique(c.discoverySlugs))throw Error(`Duplicate discovery in ${c.slug}`);for(const slug of c.discoverySlugs)if(!known.has(slug))throw Error(`Unknown discovery ${slug} in ${c.slug}`)}
console.log(`Catalog valid: ${collections.length} collections, ${discoveries.length} discoveries`);
