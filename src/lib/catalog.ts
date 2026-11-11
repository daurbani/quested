import collections from "../../data/collections.json";
export const allCollections = collections.filter((c) => c.status === "published");
export function getCollection(slug: string) {return allCollections.find((c) => c.slug === slug);}
