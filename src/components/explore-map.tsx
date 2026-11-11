"use client";
import {useEffect,useMemo,useRef,useState} from "react";
import Link from "next/link";
import {allCollections,allDiscoveries} from "@/lib/catalog";
import {discoveryCoordinates} from "@/lib/discovery-coordinates";
import {supabaseBrowser} from "@/lib/supabase/client";
import WantToGoButton from "@/components/want-to-go-button";
import {photoForDiscovery} from "@/lib/media";
import {PhotoImage} from "@/components/photo";

type MapObject={setView:(center:[number,number],zoom:number)=>MapObject;flyTo:(center:[number,number],zoom:number)=>void;remove:()=>void;fitBounds:(bounds:unknown,options?:{padding?:[number,number];maxZoom?:number})=>void};
type MarkerObject={addTo:(map:MapObject)=>MarkerObject;on:(name:string,handler:()=>void)=>MarkerObject;remove:()=>void;setStyle:(style:Record<string,unknown>)=>void};
type Leaflet={map:(node:HTMLElement,options?:Record<string,unknown>)=>MapObject;tileLayer:(url:string,options:Record<string,unknown>)=>{addTo:(m:MapObject)=>unknown};circleMarker:(coords:[number,number],options:Record<string,unknown>)=>MarkerObject;latLngBounds:(pts:[number,number][])=>unknown};
declare global {interface Window{L?:Leaflet}}
const LEAFLET_CSS="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
const LEAFLET_JS="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
function loadLeaflet():Promise<Leaflet>{
 if(window.L)return Promise.resolve(window.L);
 return new Promise((resolve,reject)=>{
  if(!document.querySelector('link[data-quested-leaflet]')){const css=document.createElement("link");css.rel="stylesheet";css.href=LEAFLET_CSS;css.dataset.questedLeaflet="1";document.head.appendChild(css);}
  const existing=document.querySelector<HTMLScriptElement>('script[data-quested-leaflet]');
  const script=existing??document.createElement("script");
  const ready=()=>window.L?resolve(window.L):reject(new Error("Map library unavailable"));
  script.addEventListener("load",ready,{once:true});script.addEventListener("error",()=>reject(new Error("Map library could not load")),{once:true});
  if(!existing){script.src=LEAFLET_JS;script.async=true;script.dataset.questedLeaflet="1";document.body.appendChild(script);}
 });
}
type Filter="all"|"unexplored"|"saved"|"visited";
type Point=(typeof allDiscoveries)[number];
export default function ExploreMap(){
 const container=useRef<HTMLDivElement>(null),map=useRef<MapObject|null>(null),leaflet=useRef<Leaflet|null>(null),markers=useRef<MarkerObject[]>([]);
 const [mapError,setMapError]=useState(false),[loaded,setLoaded]=useState(false);
 const [selected,setSelected]=useState<string|null>(null),[collection,setCollection]=useState("all"),[filter,setFilter]=useState<Filter>("all");
 const [userId,setUserId]=useState<string|null>(null),[saved,setSaved]=useState<Set<string>>(()=>new Set()),[visited,setVisited]=useState<Set<string>>(()=>new Set());
 useEffect(()=>{const sb=supabaseBrowser();if(!sb)return;let active=true;
  void sb.auth.getUser().then(async({data})=>{if(!active||!data.user)return;setUserId(data.user.id);
   const [wishlist,history]=await Promise.all([sb.from("user_want_to_go").select("discovery_slug").eq("user_id",data.user.id),sb.from("user_discoveries").select("discovery_slug").eq("user_id",data.user.id)]);
   if(active){if(!wishlist.error)setSaved(new Set((wishlist.data??[]).map(x=>x.discovery_slug)));if(!history.error)setVisited(new Set((history.data??[]).map(x=>x.discovery_slug)));}
  });return()=>{active=false};
 },[]);
 useEffect(()=>{let active=true;void loadLeaflet().then(L=>{
  if(!active||!container.current)return;leaflet.current=L;const m=L.map(container.current,{scrollWheelZoom:false}).setView([44.7,-122.3],7);map.current=m;
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:18,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(m);
  setLoaded(true);
 }).catch(()=>{if(active)setMapError(true)});return()=>{active=false;markers.current.forEach(x=>x.remove());markers.current=[];map.current?.remove();map.current=null;};
 },[]);
 const filtered=useMemo(()=>allDiscoveries.filter(d=>{
  if(!discoveryCoordinates[d.slug])return false;
  if(collection!=="all"&&!allCollections.find(c=>c.slug===collection)?.discoverySlugs.includes(d.slug))return false;
  if(filter==="saved"&&!saved.has(d.slug))return false;
  if(filter==="visited"&&!visited.has(d.slug))return false;
  if(filter==="unexplored"&&visited.has(d.slug))return false;
  return true;
 }),[collection,filter,saved,visited]);
 useEffect(()=>{if(!loaded||!map.current||!leaflet.current)return;
  markers.current.forEach(x=>x.remove());markers.current=[];
  for(const d of filtered){const coords=discoveryCoordinates[d.slug] as [number,number];
   const color=visited.has(d.slug)?"#17785e":saved.has(d.slug)?"#be7b21":"#315c87";
   const marker=leaflet.current.circleMarker(coords,{radius:9,color:"#ffffff",weight:2.5,fillColor:color,fillOpacity:0.95,opacity:1});
   marker.addTo(map.current).on("click",()=>setSelected(d.slug));markers.current.push(marker);
  }
 },[filtered,loaded,visited,saved]);
 const selectedDiscovery=allDiscoveries.find(d=>d.slug===selected);
 function focus(d:Point){setSelected(d.slug);const coords=discoveryCoordinates[d.slug] as [number,number];map.current?.flyTo(coords,Math.max(9,collection==="all"?9:10));}
 function frameResults(){if(!map.current||!leaflet.current||!filtered.length)return;const bounds=leaflet.current.latLngBounds(filtered.map(d=>discoveryCoordinates[d.slug] as [number,number]));map.current.fitBounds(bounds,{padding:[36,36],maxZoom:11});}
 return <div className="mt-7">
  <div className="flex flex-wrap items-end gap-3 rounded-2xl bg-white p-4 shadow-sm">
   <label className="flex-1 text-xs font-black text-emerald-950">Collection<select aria-label="Filter by collection" value={collection} onChange={e=>{setCollection(e.target.value);setSelected(null)}} className="mt-2 block w-full rounded-xl border border-emerald-900/20 bg-white px-3 py-3 text-sm font-semibold"><option value="all">All collections</option>{allCollections.map(c=><option key={c.slug} value={c.slug}>{c.name}</option>)}</select></label>
   <label className="flex-1 text-xs font-black text-emerald-950">Show<select aria-label="Filter by adventure status" value={filter} onChange={e=>{setFilter(e.target.value as Filter);setSelected(null)}} className="mt-2 block w-full rounded-xl border border-emerald-900/20 bg-white px-3 py-3 text-sm font-semibold"><option value="all">All discoveries</option><option value="unexplored">Not completed</option><option value="saved">Want to Go</option><option value="visited">Completed</option></select></label>
   <button type="button" onClick={frameResults} disabled={!loaded||filtered.length===0} className="rounded-xl border border-emerald-900/20 px-4 py-3 text-sm font-bold text-emerald-900 disabled:opacity-50">Fit map</button>
  </div>
  <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_330px]">
   <div className="relative min-h-[440px] overflow-hidden rounded-2xl bg-[#dae7d7] shadow-sm">
    <div ref={container} aria-label="Interactive map of Pacific Northwest adventures" className="absolute inset-0 z-0"/>
    {!loaded&&!mapError&&<p role="status" className="absolute left-4 top-4 rounded-xl bg-white px-4 py-2 text-sm shadow">Loading the adventure map…</p>}
    {mapError&&<p role="alert" className="absolute left-4 top-4 right-4 rounded-xl bg-white px-4 py-3 text-sm text-slate-700 shadow">Map tiles or scripts could not load. You can still explore the discovery list beside the map.</p>}
    <div className="absolute bottom-6 left-3 z-[400] flex flex-wrap gap-2 rounded-lg bg-white/95 px-3 py-2 text-[11px] font-bold shadow"><span className="text-[#315c87]">● To explore</span><span className="text-[#be7b21]">● Want to Go</span><span className="text-[#17785e]">● Completed</span></div>
   </div>
   <aside className="rounded-2xl bg-white p-4 shadow-sm lg:max-h-[620px] lg:overflow-y-auto">
    <div className="flex items-center justify-between gap-3"><h2 className="text-lg font-black">{filtered.length} places to explore</h2><span className="text-xs text-slate-500">{userId?"Your progress is synced":"Sign in to save adventures"}</span></div>
    <p className="mt-2 text-xs leading-5 text-slate-500">Pins mark approximate destinations, not trailheads or route directions. Verify current access before visiting.</p>
    {selectedDiscovery&&<section className="mt-4 overflow-hidden rounded-xl border border-emerald-200 bg-emerald-50">
     {photoForDiscovery(selectedDiscovery.slug)&&<div className="h-36 overflow-hidden"><PhotoImage photo={photoForDiscovery(selectedDiscovery.slug)!} width={540} className="h-full w-full object-cover"/></div>}
     <div className="p-4"><p className="text-[11px] font-black uppercase tracking-wider text-emerald-800">{selectedDiscovery.region}</p><h3 className="mt-1 text-xl font-black">{selectedDiscovery.name}</h3><p className="mt-2 text-sm text-slate-700">{selectedDiscovery.summary}</p><div className="mt-3 flex flex-wrap gap-2"><WantToGoButton key={selectedDiscovery.slug} slug={selectedDiscovery.slug} compact saved={saved.has(selectedDiscovery.slug)} onChanged={v=>setSaved(previous=>{const next=new Set(previous);if(v)next.add(selectedDiscovery.slug);else next.delete(selectedDiscovery.slug);return next})}/><Link href={"/discoveries/"+selectedDiscovery.slug} className="rounded-full bg-[#163e32] px-4 py-2 text-xs font-bold text-white">View discovery →</Link></div></div>
    </section>}
    <div className="mt-4 space-y-1">{filtered.slice(0,100).map(d=><button type="button" key={d.slug} onClick={()=>focus(d)} className={"w-full rounded-xl px-3 py-3 text-left hover:bg-emerald-50 "+(selected===d.slug?"bg-emerald-50":"")}><span className="flex items-center gap-2"><span className={"text-sm "+(visited.has(d.slug)?"text-emerald-700":saved.has(d.slug)?"text-amber-700":"text-blue-800")}>{visited.has(d.slug)?"●":saved.has(d.slug)?"★":"○"}</span><span className="min-w-0"><span className="block text-sm font-bold">{d.name}</span><span className="block text-xs text-slate-500">{d.region}</span></span></span></button>)}</div>
    {filtered.length===0&&<p className="mt-6 text-sm text-slate-600">No discoveries match these filters yet. Try another collection or status.</p>}
   </aside>
  </div>
 </div>;
}
