import type { MetadataRoute } from "next";
export default function manifest(): MetadataRoute.Manifest { return {name:"Quested",short_name:"Quested",description:"Discover places. Complete collections. Build your legend.",start_url:"/",display:"standalone",background_color:"#f7f8f5",theme_color:"#163e32"}; }
