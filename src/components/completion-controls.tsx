"use client";
import {useCallback,useEffect,useState} from "react";
import Link from "next/link";
import {supabaseBrowser,isConfigured} from "@/lib/supabase/client";
import {localToday,prettyDate,type Completion} from "@/lib/completions";
type Intent={slug:string;type:"new"|"historical";date:string|null};
type RelatedCollection={slug:string;name:string;emoji:string;discoverySlugs:string[]};
type Impact={slug:string;name:string;emoji:string;count:number;total:number;advanced:boolean};
const KEY="quested-pending-completion";
export default function CompletionControls({slug,collections}:{slug:string;collections:RelatedCollection[]}){
 const sb=supabaseBrowser();
 const [impact,setImpact]=useState<Impact[]|null>(null);
 const [userId,setUserId]=useState<string|null>(null),[visit,setVisit]=useState<Completion|null>(null),[loading,setLoading]=useState(true),[busy,setBusy]=useState(false),[past,setPast]=useState(false),[date,setDate]=useState(""),[notice,setNotice]=useState("");
 const refresh=useCallback(async(id:string)=>{if(!sb)return;const {data,error}=await sb.from("user_discoveries").select("discovery_slug,completion_type,visited_on,created_at").eq("user_id",id).eq("discovery_slug",slug).maybeSingle();if(error)setNotice("Could not load this visit: "+error.message);else setVisit(data as Completion|null);},[sb,slug]);
 const save=useCallback(async(id:string,type:Intent["type"],visitedOn:string|null)=>{
  if(!sb)return;
  setBusy(true);setNotice("");setImpact(null);
  // Query before upsert so edits never claim to advance progress twice.
  const prior=await sb.from("user_discoveries").select("discovery_slug").eq("user_id",id).eq("discovery_slug",slug).maybeSingle();
  const alreadyRecorded=!prior.error&&Boolean(prior.data);
  const {error}=await sb.from("user_discoveries").upsert({
   user_id:id,discovery_slug:slug,completion_type:type,visited_on:type==="new"?localToday():visitedOn
  },{onConflict:"user_id,discovery_slug"});
  if(error){setNotice("Could not save: "+error.message);setBusy(false);return;}
  await refresh(id);setPast(false);
  const result=await sb.from("user_discoveries").select("discovery_slug").eq("user_id",id);
  if(result.error){
   setNotice("Visit saved. Collection progress will appear when you open My Quested.");
  }else{
   const done=new Set((result.data??[]).map(item=>item.discovery_slug as string));
   setImpact(collections.map(c=>({slug:c.slug,name:c.name,emoji:c.emoji,count:c.discoverySlugs.filter(s=>done.has(s)).length,total:c.discoverySlugs.length,advanced:!alreadyRecorded&&!prior.error})));
   setNotice(prior.error?"Visit saved.":"Visit saved — your collection progress is up to date.");
  }
  setBusy(false);
 },[sb,slug,refresh,collections]);
 useEffect(()=>{if(!sb){setLoading(false);return;}let alive=true;void sb.auth.getUser().then(async({data,error})=>{if(!alive)return;if(error){setNotice(error.message);setLoading(false);return;}const id=data.user?.id??null;setUserId(id);if(id){await refresh(id);if(!alive)return;try{const raw=sessionStorage.getItem(KEY);if(raw){const intent=JSON.parse(raw) as Intent;if(intent.slug===slug){sessionStorage.removeItem(KEY);await save(id,intent.type,intent.date)}}}catch{sessionStorage.removeItem(KEY)}}if(alive)setLoading(false)});return()=>{alive=false};},[sb,slug,refresh,save]);
 function begin(type:Intent["type"],date:string|null){if(!userId){sessionStorage.setItem(KEY,JSON.stringify({slug,type,date} as Intent));window.location.assign("/sign-in?next="+encodeURIComponent("/discoveries/"+slug));return;}void save(userId,type,date);}
 async function remove(){if(!sb||!userId)return;setBusy(true);const {error}=await sb.from("user_discoveries").delete().eq("user_id",userId).eq("discovery_slug",slug);if(error)setNotice("Could not remove: "+error.message);else{setVisit(null);setImpact(null);setNotice("Completion removed; progress recalculated.")}setBusy(false);}
 if(!isConfigured())return <section className="rounded-xl bg-amber-50 p-5 text-sm text-amber-900">Completion tracking is being connected to Supabase. Discovery browsing is available now.</section>;
 return <section className="rounded-2xl bg-white p-6 shadow-sm"><h2 className="text-xl font-black">{visit?"You have been here":"Record this discovery"}</h2>
 {loading?<p className="mt-3 text-sm text-slate-500">Loading...</p>:<>{visit&&<p className="mt-3 font-semibold text-emerald-800">✓ {visit.completion_type==="new"?"Completed":"Historical visit"} · {prettyDate(visit.visited_on)}</p>}
 <button disabled={busy} onClick={()=>begin("new",localToday())} className="mt-5 w-full rounded-xl bg-[#163e32] px-5 py-3 font-bold text-white disabled:opacity-50">{visit?"Update to completed today":"✓ Complete now"}</button>
 <button disabled={busy} onClick={()=>setPast(x=>!x)} className="mt-3 w-full rounded-xl border border-emerald-900/20 px-5 py-3 font-semibold text-emerald-900 disabled:opacity-50">Add or edit past visit</button>
 {past&&<div className="mt-4 rounded-xl bg-emerald-50 p-4"><label htmlFor="visit-date" className="block text-sm font-semibold">Visit date (optional)</label><input id="visit-date" type="date" max={localToday()} value={date} onChange={e=>setDate(e.target.value)} className="mt-2 w-full rounded-lg border border-emerald-950/20 bg-white p-2"/><button disabled={busy} onClick={()=>begin("historical",date||null)} className="mt-3 rounded-lg bg-[#163e32] px-5 py-2 font-bold text-white">Save visit</button></div>}
 {visit&&<button disabled={busy} onClick={()=>void remove()} className="mt-4 block text-sm font-semibold text-red-700">Remove completion</button>}
 {notice&&<p role="status" className="mt-4 text-sm text-emerald-900">{notice}</p>}
 {impact&&impact.length>0&&<div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4"><p className="font-bold text-emerald-950">{impact.filter(c=>c.advanced).length>0?`One discovery, ${impact.length} ${impact.length===1?"collection":"collections"} advanced`:`Progress across ${impact.length} ${impact.length===1?"collection":"collections"}`}</p><p className="mt-1 text-xs text-emerald-900">An existing completion is counted only once, even when its visit date changes.</p><div className="mt-3 space-y-2">{impact.map(c=><Link key={c.slug} href={`/collections/${c.slug}`} className="flex items-center justify-between gap-3 rounded-lg bg-white px-3 py-2 text-sm hover:shadow-sm"><span className="font-semibold text-emerald-950">{c.emoji} {c.name}</span><span className="whitespace-nowrap text-emerald-800">{c.count}/{c.total}{c.advanced?" · +1":""}</span></Link>)}</div></div>}
 {visit&&<Link href="/my-quested" className="mt-4 inline-block font-semibold text-emerald-800 hover:underline">View your progress in My Quested →</Link>}
 {!userId&&<p className="mt-3 text-xs text-slate-500">You will sign in to save your visit. Your selection will be carried back to this page.</p>}</>}</section>;
}
