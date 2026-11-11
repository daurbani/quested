"use client";
import {useEffect,useMemo,useState} from "react";
import Link from "next/link";
import {allCollections,getCollectionDiscoveries} from "@/lib/catalog";
import {supabaseBrowser} from "@/lib/supabase/client";
import {recordBetaEvent} from "@/lib/beta-analytics";
import {photoForCollection} from "@/lib/media";
import {PhotoImage} from "@/components/photo";
type Status="loading"|"signed-out"|"ready"|"error";
const featured=["portland-explorer","oregon-volcanoes","columbia-gorge-waterfalls","oregon-coast-highlights"];
export default function WelcomeExperience(){
 const [status,setStatus]=useState<Status>("loading");
 const [completed,setCompleted]=useState(0);
 const [error,setError]=useState("");
 useEffect(()=>{
  const sb=supabaseBrowser();
  if(!sb){setStatus("signed-out");return;}
  let active=true;
  void sb.auth.getUser().then(async({data,error})=>{
   if(!active)return;
   if(error){setError("We couldn’t confirm your session. Try signing in again.");setStatus("error");return;}
   if(!data.user){setStatus("signed-out");return;}
   const result=await sb.from("user_discoveries").select("discovery_slug").eq("user_id",data.user.id);
   if(!active)return;
   if(result.error){setError("Your account is ready, but saved discoveries couldn’t be loaded.");setStatus("error");return;}
   setCompleted(new Set((result.data??[]).map(row=>row.discovery_slug)).size);
   setStatus("ready");
   try{const key="quested-welcome-viewed:"+data.user.id;if(!sessionStorage.getItem(key)){sessionStorage.setItem(key,"1");void recordBetaEvent(data.user.id,"welcome_viewed")}}catch{}
  }).catch(()=>{if(active){setError("We couldn’t load your account.");setStatus("error")}});
  return()=>{active=false};
 },[]);
 const collections=useMemo(()=>featured.map(slug=>allCollections.find(c=>c.slug===slug)).filter((c):c is (typeof allCollections)[number]=>Boolean(c)),[]);
 return <div>
  <div className="rounded-3xl bg-[#153e32] px-6 py-8 text-white sm:px-10 sm:py-10">
   <p className="text-xs font-bold uppercase tracking-[.2em] text-emerald-200">Your adventure starts here</p>
   <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">{status==="ready"&&completed>0?"Welcome back to Quested.":"Welcome to Quested."}</h1>
   <p className="mt-4 max-w-2xl text-base leading-7 text-emerald-50">Discover remarkable places to explore, save adventures to your Want to Go list, and celebrate the places you’ve already experienced.</p>
   <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold"><span className="rounded-full bg-white/15 px-3 py-2">✓ Your past adventures count</span><span className="rounded-full bg-white/15 px-3 py-2">✓ No GPS needed to get started</span><span className="rounded-full bg-white/15 px-3 py-2">✓ Free early beta</span></div>
  </div>
  {status==="loading"&&<p role="status" className="mt-6 text-sm text-slate-600">Checking your account...</p>}
  {status==="signed-out"&&<section className="mt-5 rounded-2xl border border-emerald-200 bg-white p-6">
   <h2 className="text-xl font-black">Make your adventures yours</h2>
   <p className="mt-2 text-sm leading-6 text-slate-600">Use Google when available, or enter your email and follow the sign-in link. No password required. New accounts are created automatically.</p>
   <Link href="/sign-in?next=/welcome" className="mt-4 inline-flex rounded-full bg-[#163e32] px-6 py-3 text-sm font-bold text-white hover:bg-emerald-900">Create your account →</Link>
   <p className="mt-3 text-xs text-slate-500">You can browse the map and collections without an account. Sign in to save your Want to Go list and completed discoveries.</p>
  </section>}
  {status==="error"&&<section role="alert" className="mt-5 rounded-xl bg-amber-50 p-5 text-sm text-amber-900">{error} <Link href="/sign-in?next=/welcome" className="font-bold underline">Sign in again</Link></section>}
  {status==="ready"&&<section className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
   <p className="text-xs font-black uppercase tracking-widest text-emerald-800">✓ You’re signed in</p>
   <p className="mt-2 font-semibold text-emerald-950">{completed>0?`You already have ${completed} ${completed===1?"discovery":"discoveries"} in your adventure record. Keep going!`:"Your Quested account is ready. Find a place that inspires you and add it to Want to Go."}</p>
   {completed>0&&<Link href="/my-quested" className="mt-3 inline-block text-sm font-bold text-emerald-800 underline">Go to My Quested →</Link>}
  </section>}
  <section className="mt-8" aria-label="How Quested works">
   <p className="text-xs font-bold uppercase tracking-[.17em] text-emerald-800">Three easy steps</p>
   <div className="mt-3 grid gap-3 sm:grid-cols-3">
    {[["01","Discover what inspires you","Explore the adventure map and collections to find somewhere you’d love to go."],["02","Save your next adventure","Tap “Want to go” on a discovery to build a personal list of places to explore."],["03","Get out there and celebrate","After your adventure—or for places you’ve already visited—record a completion and watch your collections grow."]].map(([number,title,description])=><div key={number} className="rounded-2xl bg-white p-5 shadow-sm"><span className="text-xs font-black text-emerald-800">{number}</span><h2 className="mt-2 text-lg font-black">{title}</h2><p className="mt-2 text-sm leading-6 text-slate-600">{description}</p></div>)}
   </div>
  </section>
  <section className="mt-7 rounded-2xl bg-[#163e32] p-6 text-white sm:flex sm:items-center sm:justify-between sm:gap-5"><div><p className="text-xs font-black uppercase tracking-widest text-emerald-200">Start exploring</p><h2 className="mt-2 text-2xl font-black text-white">Find your next adventure on the map</h2><p className="mt-2 text-sm leading-6 text-emerald-50">Browse places across Oregon and southwest Washington. See what catches your eye.</p></div><Link href="/map" className="mt-4 inline-flex shrink-0 rounded-full bg-white px-5 py-3 text-sm font-black text-[#163e32] sm:mt-0">Explore map →</Link></section>
  <section className="mt-9">
   <div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[.17em] text-emerald-800">Find your starting point</p><h2 className="mt-2 text-2xl font-black">Explore an adventure collection</h2><p className="mt-2 text-sm text-slate-600">Start with a place that sparks your curiosity. You can explore everything, save future adventures, and count past visits too.</p></div><Link href="/collections" className="text-sm font-bold text-emerald-800 hover:underline">View all collections →</Link></div>
   <div className="mt-5 grid gap-4 sm:grid-cols-2">{collections.map(c=>{const photo=photoForCollection(c.slug);return <Link href={`/collections/${c.slug}`} key={c.slug} className="group flex gap-4 rounded-2xl border border-emerald-950/10 bg-white p-3 shadow-sm hover:border-emerald-500 hover:shadow-md">
    <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-emerald-100">{photo?<PhotoImage photo={photo} width={300} className="h-full w-full object-cover"/>:<div className="flex h-full items-center justify-center text-4xl">{c.emoji}</div>}</div>
    <div className="flex min-w-0 flex-1 flex-col justify-center"><h3 className="font-black group-hover:text-emerald-800">{c.name}</h3><p className="mt-1 text-xs leading-5 text-slate-600">{getCollectionDiscoveries(c.slug).length} discoveries · {c.category}</p><span className="mt-2 text-xs font-black text-emerald-800">Explore this collection →</span></div>
   </Link>})}</div>
  </section>
  <section className="mt-8 rounded-2xl border border-emerald-200 bg-white p-6">
   <p className="text-xs font-black uppercase tracking-widest text-emerald-800">From inspiration to accomplishment</p>
   <h2 className="mt-2 text-xl font-black">Pittock Mansion: go next—or remember when you went</h2>
   <p className="mt-2 text-sm leading-6 text-slate-600">Add Pittock Mansion to Want to Go for a future outing, or record a past visit. A completed visit counts toward both Portland Explorer and Portland Viewpoints.</p>
   <Link href="/discoveries/pittock-mansion" className="mt-4 inline-block text-sm font-bold text-emerald-800 underline">See how a discovery works →</Link>
  </section>
  <p className="mt-7 text-center text-xs leading-5 text-slate-500">Quested is an early beta with an Oregon-focused catalog. We’re improving it with feedback from the first explorers.</p>
 </div>;
}
