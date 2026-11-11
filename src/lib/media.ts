// Curated place-specific Wikimedia Commons media. Keep source and licensing with each asset.
// Images are not user uploads; use the Commons source links for provenance.
export type MediaCredit={file:string;alt:string;credit:string;license:string;licenseUrl:string;sourceUrl:string;position?:string};
export const photos:Record<string,MediaCredit>={
 "portland":{file:"Pittock Mansion View.jpg",alt:"Portland skyline and Mount Hood seen from Pittock Mansion",credit:"Little Mountain 5",license:"CC BY-SA 3.0",licenseUrl:"https://creativecommons.org/licenses/by-sa/3.0/",sourceUrl:"https://commons.wikimedia.org/wiki/File:Pittock_Mansion_View.jpg",position:"center 55%"},
 "mount-hood":{file:"Mount Hood.jpg",alt:"Mount Hood in the Oregon Cascades",credit:"Lyn Topinka / USGS",license:"Public domain",licenseUrl:"https://commons.wikimedia.org/wiki/Commons:Public_domain",sourceUrl:"https://commons.wikimedia.org/wiki/File:Mount_Hood.jpg",position:"center 45%"},
 "multnomah-falls":{file:"Multnomah Falls in Oregon.jpg",alt:"Multnomah Falls in the Columbia River Gorge",credit:"Pixel.la",license:"CC0 1.0",licenseUrl:"https://creativecommons.org/publicdomain/zero/1.0/",sourceUrl:"https://commons.wikimedia.org/wiki/File:Multnomah_Falls_in_Oregon.jpg",position:"center 50%"},
 "haystack-rock":{file:"Cannon Beach and Haystock Rock.jpg",alt:"Haystack Rock on Cannon Beach along the Oregon Coast",credit:"K. Kendall",license:"CC BY 2.0",licenseUrl:"https://creativecommons.org/licenses/by/2.0/",sourceUrl:"https://commons.wikimedia.org/wiki/File:Cannon_Beach_and_Haystock_Rock.jpg",position:"center 45%"},
 "pittock-mansion":{file:"Portland, OR — Pittock Mansion.jpg",alt:"Historic Pittock Mansion in Portland",credit:"Steven Pavlov",license:"CC BY-SA 4.0",licenseUrl:"https://creativecommons.org/licenses/by-sa/4.0/",sourceUrl:"https://commons.wikimedia.org/wiki/File:Portland,_OR_%E2%80%94_Pittock_Mansion.jpg",position:"center 50%"},
 "black-butte-lookout":{file:"Hood Jeff ThreeFingeredJack BB 150509.jpg",alt:"Historic lookout structures and Cascade mountain views from Black Butte",credit:"Johannes Menzel",license:"CC BY-SA 4.0",licenseUrl:"https://creativecommons.org/licenses/by-sa/4.0/",sourceUrl:"https://commons.wikimedia.org/wiki/File:Hood_Jeff_ThreeFingeredJack_BB_150509.jpg",position:"center 55%"}
};
const collectionPhoto:Record<string,string>={
 "portland-explorer":"portland",
 "columbia-gorge-waterfalls":"multnomah-falls",
 "oregon-coast-highlights":"haystack-rock",
 "oregon-fire-lookouts":"black-butte-lookout",
 "oregon-volcanoes":"mount-hood",
 "portland-viewpoints":"portland",
 "cascade-summit-circuit":"mount-hood"
};
export function photoForDiscovery(slug:string){return photos[slug];}
export function photoForCollection(slug:string){return photos[collectionPhoto[slug]];}
export function commonsImageUrl(photo:MediaCredit,width=1280){return "https://commons.wikimedia.org/wiki/Special:FilePath/"+encodeURIComponent(photo.file)+"?width="+width;}
