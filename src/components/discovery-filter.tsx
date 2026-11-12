"use client";
import {useEffect,useMemo,useState} from "react";
import Link from "next/link";
import type {Discovery} from "@/lib/catalog";
import {supabaseBrowser} from "@/lib/supabase/client";
import {photoForDiscovery} from "@/lib/media";
import {getTechnicalAdventure} from "@/lib/technical-adventures";
import {PhotoImage} from "@/components/photo";
type View="all"|"remaining"|"completed";
export default function DiscoveryFilter({discoveries}:{discoveries:Discovery[]}){
 const [query,setQuery]=useState("");
 const [view,setView]=useState<View>("all");
 const [completed,setCompleted]=useState<Set<string>|null>(null);
 const [error,setError]=useState("");
 useEffect(()=>{
  const sb=supabaseBrowser();if(!sb)return;let active=true;
  void sb.auth.getUser().then(async({data})=>{
   if(!active||!data.user)return;
   const {data:rows,error}=await sb.from("user_discoveries").select("discovery_slug").eq("user_id",data.user.id);
   if(!active)return;
   if(error)setError("Your completion markers could not be loaded.");
   else setCompleted(new Set((rows??[]).map(r=>r.discovery_slug as string)));
  });
  return()=>{active=false};
 },[]);
 const visible=useMemo(()=>discoveries.filter(d=>{
  const matches=(d.name+" "+d.region+" "+d.summary).toLowerCase().includes(query.trim().toLowerCase());
  return matches&&(view==="all"||completed===null||(view==="completed"?completed.has(d.slug):!completed.has(d.slug)));
 }),[discoveries,query,view,completed]);
 const n=completed===null?null:discoveries.filter(d=>completed.has(d.slug)).length;
 return <div>
  {n!==null&&<div className="mb-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
   <div className="flex flex-wrap items-center justify-between gap-2"><p className="font-bold text-emerald-950">{n===discoveries.length?"Collection completed!":n===0?"Your adventure starts here":`You have explored ${n} of ${discoveries.length} places`}</p><span className="text-sm font-semibold text-emerald-800">{Math.round(n/discoveries.length*100)}%</span></div>
   <div role="progressbar" aria-label="Discovery collection completion" aria-valuemin={0} aria-valuemax={discoveries.length} aria-valuenow={n} className="mt-3 h-2 overflow-hidden rounded-full bg-emerald-200"><div className="h-full rounded-full bg-emerald-700" style={{width:(n/discoveries.length*100)+"%"}}/></div>
  </div>}
  <div className="mb-4 flex flex-wrap items-center gap-3">
   <label className="block min-w-52 flex-1"><span className="sr-only">Search discoveries in this collection</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search discoveries..." className="w-full rounded-xl border border-emerald-950/15 bg-white px-4 py-3 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-200"/></label>
   {completed!==null&&<div role="group" aria-label="Filter discoveries" className="flex gap-1 rounded-xl border border-emerald-950/10 bg-white p-1">{(["all","remaining","completed"] as const).map(v=><button key={v} type="button" aria-pressed={view===v} onClick={()=>setView(v)} className={`rounded-lg px-3 py-2 text-sm font-semibold ${view===v?"bg-[#163e32] text-white":"text-slate-600 hover:bg-emerald-50"}`}>{v==="all"?"All":v==="remaining"?"To explore":"Completed"}</button>)}</div>}
  </div>
  {error&&<p role="status" className="mb-3 text-sm text-amber-800">{error}</p>}
  <p className="mb-4 text-sm text-slate-500">{visible.length} {visible.length===1?"place":"places"} {view!=="all"&&completed!==null?"shown":""}</p>
  <div className="grid gap-3 sm:grid-cols-2">{visible.map(d=>{const done=completed?.has(d.slug)??false;const photo=photoForDiscovery(d.slug);const technical=getTechnicalAdventure(d.slug);return <Link key={d.slug} href={`/discoveries/${d.slug}`} className={`group flex gap-4 overflow-hidden rounded-xl border bg-white p-4 shadow-sm transition hover:shadow-md ${done?"border-emerald-400":"border-emerald-950/10 hover:border-emerald-600"}`}>
   {photo?<div className="relative h-28 w-24 shrink-0 overflow-hidden rounded-lg bg-emerald-100 sm:w-28"><PhotoImage photo={photo} width={400} className="h-full w-full object-cover"/>{done&&<span aria-label="Completed" className="absolute right-2 top-2 rounded-full bg-emerald-700 px-2 py-0.5 text-sm font-bold text-white">✓</span>}</div>:<span aria-hidden className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-sm font-bold ${done?"bg-emerald-700 text-white":"bg-emerald-50 text-emerald-800"}`}>{done?"✓":discoveries.indexOf(d)+1}</span>}
   <div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h3 className="font-bold group-hover:underline">{d.name}</h3>{done&&<span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-900">Completed</span>}</div><p className="mt-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">{d.region}</p>{technical&&<p className="mt-2 text-xs font-black text-emerald-900">{technical.activity==="Alpine ski touring"?`${technical.experienceLevel} · ${technical.verticalGain??"Route dependent"} · ${technical.descentStyle??"Backcountry skiing"}`:`${technical.technicalGrade} · ${technical.pitches} pitches · ${technical.protection} · ${technical.experienceLevel}`}</p>}<p className="mt-2 text-sm leading-6 text-slate-600">{d.summary}</p></div>
  </Link>})}</div>
  {visible.length===0&&<div className="rounded-xl bg-white p-8 text-center text-slate-600">{view==="completed"&&completed?.size===0?"No completed discoveries yet. Pick a destination to start your adventure.":"No discoveries match these filters."}</div>}
 </div>;
}
