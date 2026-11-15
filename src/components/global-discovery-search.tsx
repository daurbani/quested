"use client";
import {useMemo,useState} from "react";
import Link from "next/link";
import {allCollections,allDiscoveries,getDiscoveryCollections} from "@/lib/catalog";
import {photoForDiscovery} from "@/lib/media";
import {PhotoImage} from "@/components/photo";

const normalize=(value:string)=>value.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g," ").trim();
const categories=[...new Set(allDiscoveries.map(d=>d.category))].sort();
const collectionsByDiscovery=new Map(allDiscoveries.map(d=>[d.slug,getDiscoveryCollections(d.slug)]));

export default function GlobalDiscoverySearch(){
 const [query,setQuery]=useState("");
 const [collection,setCollection]=useState("all");
 const [category,setCategory]=useState("all");
 const results=useMemo(()=>{
  const terms=normalize(query).split(" ").filter(Boolean);
  return allDiscoveries.filter(d=>{
   const memberships=collectionsByDiscovery.get(d.slug)??[];
   if(collection!=="all"&&!memberships.some(c=>c.slug===collection))return false;
   if(category!=="all"&&d.category!==category)return false;
   if(!terms.length)return true;
   const text=normalize([d.name,d.region,d.summary,d.category,...memberships.map(c=>c.name)].join(" "));
   return terms.every(term=>text.includes(term));
  }).sort((a,b)=>{
   if(!terms.length)return a.name.localeCompare(b.name);
   const needle=normalize(query);
   const score=(name:string)=>{const normalized=normalize(name);return normalized===needle?0:normalized.startsWith(needle)?1:normalized.includes(needle)?2:3};
   return score(a.name)-score(b.name)||a.name.localeCompare(b.name);
  });
 },[query,collection,category]);
 const clear=()=>{setQuery("");setCollection("all");setCategory("all")};
 return <section aria-label="Search all discoveries" className="mt-8">
  <div className="rounded-2xl border border-emerald-900/10 bg-white p-4 shadow-sm sm:p-6">
   <label htmlFor="global-discovery-search" className="block text-sm font-bold text-emerald-950">Search all discoveries</label>
   <div className="mt-2 flex items-center gap-2">
    <input id="global-discovery-search" type="search" value={query} onChange={e=>setQuery(e.target.value)} autoComplete="off" placeholder="Try Mount Hood, waterfalls, skiing, Smith Rock…" className="min-w-0 flex-1 rounded-xl border border-emerald-900/20 bg-white px-4 py-3 text-base text-slate-900 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-200"/>
    {(query||collection!=="all"||category!=="all")&&<button type="button" onClick={clear} className="rounded-xl border border-emerald-900/20 px-4 py-3 text-sm font-semibold text-emerald-900 hover:bg-emerald-50">Clear</button>}
   </div>
   <div className="mt-4 grid gap-3 sm:grid-cols-2">
    <label className="text-xs font-bold text-emerald-950">Collection
     <select value={collection} onChange={e=>setCollection(e.target.value)} className="mt-1 block w-full rounded-xl border border-emerald-900/20 bg-white px-3 py-3 text-sm text-slate-900"><option value="all">All collections</option>{allCollections.map(c=><option key={c.slug} value={c.slug}>{c.name}</option>)}</select>
    </label>
    <label className="text-xs font-bold text-emerald-950">Activity
     <select value={category} onChange={e=>setCategory(e.target.value)} className="mt-1 block w-full rounded-xl border border-emerald-900/20 bg-white px-3 py-3 text-sm text-slate-900"><option value="all">All activities</option>{categories.map(c=><option key={c} value={c}>{c}</option>)}</select>
    </label>
   </div>
  </div>
  <p role="status" aria-live="polite" className="my-5 text-sm font-semibold text-slate-600">{results.length} of {allDiscoveries.length} discoveries {query.trim()||collection!=="all"||category!=="all"?"match your search":"to explore"}</p>
  {results.length?<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{results.map(d=>{
   const photo=photoForDiscovery(d.slug);
   const memberships=collectionsByDiscovery.get(d.slug)??[];
   return <article key={d.slug} className="overflow-hidden rounded-2xl border border-emerald-900/10 bg-white shadow-sm transition hover:shadow-md">
    <Link href={`/discoveries/${d.slug}`} className="group block h-full">
     {photo&&<div className="h-40 overflow-hidden bg-emerald-50"><PhotoImage photo={photo} width={650} className="h-full w-full object-cover transition-transform group-hover:scale-105"/></div>}
     <div className="p-5">
      <p className="text-[11px] font-black uppercase tracking-wider text-emerald-700">{d.category} · {d.region}</p>
      <h2 className="mt-2 text-lg font-black text-emerald-950 group-hover:underline">{d.name}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">{d.summary}</p>
      {memberships.length>0&&<p className="mt-3 text-xs leading-5 text-emerald-800">In {memberships.map(c=>c.name).join(" · ")}</p>}
      <p className="mt-4 text-sm font-bold text-emerald-800">View discovery →</p>
     </div>
    </Link>
   </article>;
  })}</div>:<div className="rounded-2xl border border-emerald-900/10 bg-white p-8 text-center">
   <h2 className="text-xl font-bold text-emerald-950">No discoveries found</h2>
   <p className="mt-2 text-sm text-slate-600">Try a different place, region, activity, or collection.</p>
   <button type="button" onClick={clear} className="mt-4 rounded-full bg-[#163e32] px-5 py-3 text-sm font-bold text-white">Show all discoveries</button>
  </div>}
 </section>;
}
