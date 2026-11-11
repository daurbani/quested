import details from "../../data/discovery-details.json";
export type DiscoveryDetail={eyebrow:string;description:string;highlights:string[];whatToKnow:string;officialUrl:string;sourceName:string;activities:string[];reviewStatus:"editorial-reviewed"|"starter"};
const records=details as Record<string,DiscoveryDetail>;
export function getDiscoveryDetail(slug:string):DiscoveryDetail|undefined{return records[slug];}
