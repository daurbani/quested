"use client";
import {useEffect,useMemo,useState} from "react";
import Link from "next/link";
import {allCollections} from "@/lib/catalog";
import {supabaseBrowser} from "@/lib/supabase/client";
type Tab="in-progress"|"saved"|"created";
type Draft={id:string;title:string;description:string};
export default function MyCollections(){
 const [tab,setTab]=useState<Tab>("in-progress"),[signedIn,setSignedIn]=useState(false),[loading,setLoading]=useState(true);
 const [done,setDone]=useState<Set<string>>(()=>new Set()),[saved,setSaved]=useState<Set<string>>(()=>new Set()),[drafts,setDrafts]=useState<Draft[]>([]),[error,setError]=useState("");
 useEffect(()=>{const sb=supabaseBrowser();if(!sb){setLoading(false);return;}let active=true;
  void sb.auth.getUser().then(async({data,error})=>{
   if(!active)return;
   if(error||!data.user){setLoading(false);return;}
   setSignedIn(true);
   const [history,favorites,owned]=await Promise.all([
    sb.from("user_discoveries").select("discovery_slug").eq("user_id",data.user.id),
    sb.from("user_saved_collections").select("collection_slug").eq("user_id",data.user.id),
    sb.from("user_collections").select("id,title,description").eq("owner_id",data.user.id).order("created_at",{ascending:false})
   ]);
   if(!active)return;
   if(history.error)setError("Progress could not be loaded.");
   else setDone(new Set((history.data??[]).map(row=>row.discovery_slug as string)));
   if(favorites.error||owned.error)setError("Saved and created collections are unavailable until the database update is applied.");
   if(!favorites.error)setSaved(new Set((favorites.data??[]).map(row=>row.collection_slug as string)));
   if(!owned.error)setDrafts(owned.data??[]);
   setLoading(false);
  }).catch(()=>{if(active){setLoading(false);setError("Could not load collections.");}});
  return()=>{active=false};
 },[]);
 const items=useMemo(()=>allCollections.map(c=>{
  const n=c.discoverySlugs.filter(slug=>done.has(slug)).length;
  return {collection:c,n,percent:c.discoverySlugs.length?Math.round(100*n/c.discoverySlugs.length):0};
 }).filter(row=>tab==="in-progress"?row.n>0&&row.n<row.collection.discoverySlugs.length:tab==="saved"?saved.has(row.collection.slug):false),[tab,done,saved]);
 if(loading)return <p className="text-slate-600">Loading collections…</p>;
 if(!signedIn)return <div className="rounded-xl bg-white p-6">Sign in to save and organize collections. <Link href="/sign-in?next=/my-collections" className="font-bold text-emerald-800 underline">Sign in →</Link></div>;
 return <><div role="tablist" aria-label="Your collection groups" className="flex flex-wrap gap-2">
  {([["in-progress","In Progress"],["saved","Saved"],["created","Created"]] as const).map(([key,title])=><button key={key} type="button" role="tab" aria-selected={tab===key} onClick={()=>setTab(key)} className={`rounded-full px-5 py-3 text-sm font-bold ${tab===key?"bg-[#163e32] text-white":"border border-emerald-950/10 bg-white text-emerald-950"}`}>{title}</button>)}
 </div>
 {error&&<p role="alert" className="mt-5 rounded-lg bg-amber-50 p-4 text-sm text-amber-900">{error}</p>}
 {tab==="created"?<section className="mt-6">
  {drafts.length?<div className="grid gap-4 sm:grid-cols-2">{drafts.map(d=><div key={d.id} className="rounded-xl bg-white p-6"><p className="text-xs font-bold uppercase tracking-wide text-slate-500">Private draft</p><h2 className="mt-2 text-xl font-bold">{d.title}</h2><p className="mt-2 text-sm text-slate-600">{d.description}</p></div>)}</div>:<div className="rounded-2xl border border-emerald-950/10 bg-white p-8"><h2 className="text-xl font-black">Your collections will live here.</h2><p className="mt-3 text-sm text-slate-600">Next up: create your own collection by choosing discoveries from the Quested catalog, then share it with friends. Creation is not enabled yet.</p></div>}
 </section>:items.length?<div className="mt-6 grid gap-4 sm:grid-cols-2">{items.map(({collection:c,n,percent})=><Link key={c.slug} href={`/collections/${c.slug}`} className="rounded-2xl border border-emerald-950/10 bg-white p-6 hover:shadow-md"><h2 className="text-lg font-black">{c.emoji} {c.name}</h2><p className="mt-2 text-sm text-slate-600">{n} of {c.discoverySlugs.length} completed · {percent}%</p><div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200"><div className="h-full rounded-full bg-emerald-700" style={{width:percent+"%"}}/></div><p className="mt-4 text-sm font-bold text-emerald-800">Explore collection →</p></Link>)}</div>:
 <div className="mt-6 rounded-2xl bg-white p-8"><h2 className="text-xl font-black">{tab==="saved"?"No saved collections yet":"No collections in progress yet"}</h2><p className="mt-2 text-sm text-slate-600">{tab==="saved"?"Save any Quested collection to keep it here.":"Complete a discovery to start making progress in its collections."}</p><Link href="/collections" className="mt-4 inline-block font-bold text-emerald-800 underline">Explore Quested collections →</Link></div>}
 </>;
}
