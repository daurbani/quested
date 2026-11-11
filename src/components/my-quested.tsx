"use client";
import {useEffect,useMemo,useState} from "react";
import Link from "next/link";
import {allCollections,allDiscoveries} from "@/lib/catalog";
import {type Completion,prettyDate} from "@/lib/completions";
import {isConfigured,supabaseBrowser} from "@/lib/supabase/client";
type HistoryFilter="all"|"new"|"historical";
export default function MyQuested(){
 const sb=supabaseBrowser();
 const [email,setEmail]=useState<string|null>(null),[entries,setEntries]=useState<Completion[]>([]),[loading,setLoading]=useState(true),[error,setError]=useState("");
 const [historyFilter,setHistoryFilter]=useState<HistoryFilter>("all"),[showAll,setShowAll]=useState(false);
 useEffect(()=>{if(!sb){setLoading(false);return;}let active=true;
  void sb.auth.getUser().then(async({data,error})=>{
   if(!active)return;
   if(error){setError(error.message);setLoading(false);return;}
   if(!data.user){setLoading(false);return;}
   setEmail(data.user.email??"Signed in");
   const response=await sb.from("user_discoveries").select("discovery_slug,completion_type,visited_on,created_at").eq("user_id",data.user.id).order("created_at",{ascending:false});
   if(active){if(response.error)setError(response.error.message);else setEntries((response.data??[]) as Completion[]);setLoading(false)}
  });return()=>{active=false};
 },[sb]);
 const done=useMemo(()=>new Set(entries.map(e=>e.discovery_slug)),[entries]);
 const masteredCollections=useMemo(()=>allCollections.filter(c=>c.discoverySlugs.length>0&&c.discoverySlugs.every(s=>done.has(s))),[done]);
 const sortedHistory=useMemo(()=>entries.filter(e=>allDiscoveries.some(d=>d.slug===e.discovery_slug)&& (historyFilter==="all"||e.completion_type===historyFilter)).sort((a,b)=>{
  // Show the most recently visited first; undated historical visits follow dated visits.
  const ad=a.visited_on??"",bd=b.visited_on??"";
  return bd.localeCompare(ad)||b.created_at.localeCompare(a.created_at);
 }),[entries,historyFilter]);
 const history=showAll?sortedHistory:sortedHistory.slice(0,8);
 async function signOut(){if(!sb)return;await sb.auth.signOut();location.assign("/");}
 if(!isConfigured())return <p className="rounded-xl bg-amber-50 p-5 text-amber-900">My Quested will be available after Supabase account setup is complete.</p>;
 if(loading)return <p className="text-slate-600">Loading your discoveries...</p>;
 if(!email)return <section className="rounded-2xl bg-white p-7"><p>Sign in to save your adventures.</p><Link href="/sign-in?next=/my-quested" className="mt-4 inline-block font-bold text-emerald-800">Sign in →</Link></section>;
 return <><div className="flex flex-wrap items-center justify-between gap-3"><p className="text-sm text-slate-500">{email}</p><button onClick={()=>void signOut()} className="text-sm font-semibold text-emerald-800">Sign out</button></div>
 {error&&<p role="alert" className="mt-4 text-red-700">{error}</p>}
 <div className="mt-8 grid gap-4 sm:grid-cols-3"><div className="rounded-2xl bg-white p-6"><p className="text-sm text-slate-500">Discoveries completed</p><p className="mt-2 text-4xl font-black">{done.size}</p></div><div className="rounded-2xl bg-white p-6"><p className="text-sm text-slate-500">New completions</p><p className="mt-2 text-4xl font-black">{entries.filter(e=>e.completion_type==="new").length}</p></div><div className="rounded-2xl bg-white p-6"><p className="text-sm text-slate-500">Past visits</p><p className="mt-2 text-4xl font-black">{entries.filter(e=>e.completion_type==="historical").length}</p></div></div>
 {entries.length===0&&!error&&<section className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
  <p className="text-xs font-black uppercase tracking-[.16em] text-emerald-800">Your first discovery</p>
  <h2 className="mt-2 text-2xl font-black text-emerald-950">Start with somewhere you’ve already been.</h2>
  <p className="mt-3 max-w-2xl text-sm leading-6 text-emerald-900">Choose a collection, open a familiar place, and record a past visit. You’ll see the same discovery count toward every collection it belongs to.</p>
  <div className="mt-4 flex flex-wrap gap-3"><Link href="/welcome" className="inline-flex rounded-full bg-[#163e32] px-5 py-3 text-sm font-black text-white hover:bg-emerald-900">Get started →</Link><Link href="/collections" className="inline-flex rounded-full border border-emerald-900/20 px-5 py-3 text-sm font-bold text-emerald-900 hover:bg-white">Browse collections</Link></div>
 </section>}
 {done.size>0&&<div role="status" className="mt-6 rounded-2xl bg-emerald-50 px-6 py-5"><p className="font-bold text-emerald-950">✓ {done.size} {done.size===1?"place":"places"} in your adventure record</p><p className="mt-1 text-sm text-emerald-800">Keep exploring—each discovery counts in every collection where it appears.</p></div>}
 {masteredCollections.length>0&&<section className="mt-10" aria-label="Your completed collection achievements">
  <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-black uppercase tracking-widest text-amber-800">Your milestones</p><h2 className="mt-1 text-2xl font-black">🏆 Hall of Fame</h2></div><span className="rounded-full bg-amber-100 px-4 py-2 text-sm font-black text-amber-900">{masteredCollections.length} {masteredCollections.length===1?"collection mastered":"collections mastered"}</span></div>
  <p className="mt-2 text-sm text-slate-600">These awards stay yours as long as your completion record contains every destination in the collection.</p>
  <div className="mt-5 grid gap-4 sm:grid-cols-2">{masteredCollections.map(c=><Link key={c.slug} href={`/collections/${c.slug}`} className="quested-celebration group rounded-2xl border border-amber-300 bg-gradient-to-br from-[#fff7de] to-[#f6dc98] p-6 shadow-sm transition hover:shadow-md">
    <div className="flex items-start gap-4"><span aria-hidden className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-amber-200 text-3xl">🏅</span><div><p className="text-xs font-black uppercase tracking-widest text-amber-900">Collection mastered</p><h3 className="mt-1 text-xl font-black text-[#453113]">{c.emoji} {c.name}</h3><p className="mt-2 text-sm text-amber-950">{c.discoverySlugs.length} of {c.discoverySlugs.length} discoveries completed</p></div></div>
    <span className="mt-5 inline-block text-sm font-bold text-amber-900 group-hover:underline">View your achievement →</span>
  </Link>)}</div>
 </section>}
 <section className="mt-10"><h2 className="text-2xl font-black">Your collections</h2><p className="mt-2 text-sm text-slate-600">Progress counts every completed discovery, even if you never followed the collection.</p><div className="mt-5 grid gap-4 sm:grid-cols-2">{allCollections.map(c=>{const n=c.discoverySlugs.filter(s=>done.has(s)).length,pct=Math.round(100*n/c.discoverySlugs.length);return <Link key={c.slug} href={`/collections/${c.slug}`} className="rounded-2xl bg-white p-6 hover:shadow-md"><h3 className="font-bold">{c.emoji} {c.name}</h3><p className="mt-2 text-sm text-slate-600">{n} of {c.discoverySlugs.length} discoveries · {n===0?"Not started":pct===100?"🏆 Mastered":pct+"%"}</p><div role="progressbar" aria-label={c.name+" progress"} aria-valuemin={0} aria-valuemax={c.discoverySlugs.length} aria-valuenow={n} className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200"><div className="h-full rounded-full bg-emerald-700 transition-[width]" style={{width:pct+"%"}}/></div></Link>})}</div></section>
 <section className="mt-10"><div className="flex flex-wrap items-end justify-between gap-3"><div><h2 className="text-2xl font-black">Accomplishment history</h2><p className="mt-2 text-sm text-slate-600">Your recorded visits, newest dates first. Select one to edit or remove it.</p></div><div role="group" aria-label="Filter accomplishments" className="flex gap-1 rounded-xl bg-white p-1">{(["all","new","historical"] as const).map(f=><button key={f} onClick={()=>{setHistoryFilter(f);setShowAll(false)}} aria-pressed={historyFilter===f} className={`rounded-lg px-3 py-2 text-sm font-semibold ${historyFilter===f?"bg-[#163e32] text-white":"text-slate-600 hover:bg-emerald-50"}`}>{f==="all"?"All":f==="new"?"New":"Past visits"}</button>)}</div></div>
 {history.length?<div className="mt-5 space-y-3">{history.map(e=>{const d=allDiscoveries.find(x=>x.slug===e.discovery_slug);return <Link href={`/discoveries/${e.discovery_slug}`} key={e.discovery_slug} className="flex items-center justify-between gap-3 rounded-xl bg-white p-5 hover:shadow-md"><div><span className="font-bold">{d?.name??e.discovery_slug}</span><span className="mt-1 block text-sm text-slate-600">{e.completion_type==="new"?"✓ Completed":"↺ Past visit"} · {prettyDate(e.visited_on)}</span></div><span className="shrink-0 text-sm font-semibold text-emerald-800">View →</span></Link>})}</div>:<p className="mt-4 rounded-xl bg-white p-6 text-slate-600">{entries.length?"Nothing matches this filter.":"No completed discoveries yet."} <Link href="/collections" className="font-semibold text-emerald-800">Explore collections →</Link></p>}
 {sortedHistory.length>8&&<button onClick={()=>setShowAll(x=>!x)} className="mt-5 rounded-xl border border-emerald-900/20 bg-white px-5 py-3 font-semibold text-emerald-800">{showAll?"Show fewer":`Show all ${sortedHistory.length} accomplishments`}</button>}
 </section></>;
}
