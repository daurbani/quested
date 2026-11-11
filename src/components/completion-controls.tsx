"use client";
import {useCallback,useEffect,useState} from "react";
import {supabaseBrowser,isConfigured} from "@/lib/supabase/client";
import {localToday,prettyDate,type Completion} from "@/lib/completions";
type Intent={slug:string;type:"new"|"historical";date:string|null};
const KEY="quested-pending-completion";
export default function CompletionControls({slug}:{slug:string}){
 const sb=supabaseBrowser();
 const [userId,setUserId]=useState<string|null>(null),[visit,setVisit]=useState<Completion|null>(null),[loading,setLoading]=useState(true),[busy,setBusy]=useState(false),[past,setPast]=useState(false),[date,setDate]=useState(""),[notice,setNotice]=useState("");
 const refresh=useCallback(async(id:string)=>{if(!sb)return;const {data,error}=await sb.from("user_discoveries").select("discovery_slug,completion_type,visited_on,created_at").eq("user_id",id).eq("discovery_slug",slug).maybeSingle();if(error)setNotice("Could not load this visit: "+error.message);else setVisit(data as Completion|null);},[sb,slug]);
 const save=useCallback(async(id:string,type:Intent["type"],visitedOn:string|null)=>{if(!sb)return;setBusy(true);setNotice("");const {error}=await sb.from("user_discoveries").upsert({user_id:id,discovery_slug:slug,completion_type:type,visited_on:type==="new"?localToday():visitedOn},{onConflict:"user_id,discovery_slug"});if(error)setNotice("Could not save: "+error.message);else{await refresh(id);setPast(false);setNotice("Saved! Your collection progress has updated.")}setBusy(false);},[sb,slug,refresh]);
 useEffect(()=>{if(!sb){setLoading(false);return;}let alive=true;void sb.auth.getUser().then(async({data,error})=>{if(!alive)return;if(error){setNotice(error.message);setLoading(false);return;}const id=data.user?.id??null;setUserId(id);if(id){await refresh(id);if(!alive)return;try{const raw=sessionStorage.getItem(KEY);if(raw){const intent=JSON.parse(raw) as Intent;if(intent.slug===slug){sessionStorage.removeItem(KEY);await save(id,intent.type,intent.date)}}}catch{sessionStorage.removeItem(KEY)}}if(alive)setLoading(false)});return()=>{alive=false};},[sb,slug,refresh,save]);
 function begin(type:Intent["type"],date:string|null){if(!userId){sessionStorage.setItem(KEY,JSON.stringify({slug,type,date} as Intent));window.location.assign("/sign-in?next="+encodeURIComponent("/discoveries/"+slug));return;}void save(userId,type,date);}
 async function remove(){if(!sb||!userId)return;setBusy(true);const {error}=await sb.from("user_discoveries").delete().eq("user_id",userId).eq("discovery_slug",slug);if(error)setNotice("Could not remove: "+error.message);else{setVisit(null);setNotice("Completion removed; progress recalculated.")}setBusy(false);}
 if(!isConfigured())return <section className="rounded-xl bg-amber-50 p-5 text-sm text-amber-900">Completion tracking is being connected to Supabase. Discovery browsing is available now.</section>;
 return <section className="rounded-2xl bg-white p-6 shadow-sm"><h2 className="text-xl font-black">{visit?"You've been here":"Record this discovery"}</h2>
 {loading?<p className="mt-3 text-sm text-slate-500">Loading...</p>:<>{visit&&<p className="mt-3 font-semibold text-emerald-800">✓ {visit.completion_type==="new"?"Completed":"Historical visit"} · {prettyDate(visit.visited_on)}</p>}
 <button disabled={busy} onClick={()=>begin("new",localToday())} className="mt-5 w-full rounded-xl bg-[#163e32] px-5 py-3 font-bold text-white disabled:opacity-50">{visit?"Update to completed today":"✓ Complete now"}</button>
 <button disabled={busy} onClick={()=>setPast(x=>!x)} className="mt-3 w-full rounded-xl border border-emerald-900/20 px-5 py-3 font-semibold text-emerald-900 disabled:opacity-50">Add or edit past visit</button>
 {past&&<div className="mt-4 rounded-xl bg-emerald-50 p-4"><label htmlFor="visit-date" className="block text-sm font-semibold">Visit date (optional)</label><input id="visit-date" type="date" max={localToday()} value={date} onChange={e=>setDate(e.target.value)} className="mt-2 w-full rounded-lg border border-emerald-950/20 bg-white p-2"/><button disabled={busy} onClick={()=>begin("historical",date||null)} className="mt-3 rounded-lg bg-[#163e32] px-5 py-2 font-bold text-white">Save visit</button></div>}
 {visit&&<button disabled={busy} onClick={()=>void remove()} className="mt-4 block text-sm font-semibold text-red-700">Remove completion</button>}
 {notice&&<p role="status" className="mt-4 text-sm text-emerald-900">{notice}</p>}
 {!userId&&<p className="mt-3 text-xs text-slate-500">You'll sign in to save your visit. Your selection will be carried back to this page.</p>}</>}</section>;
}
