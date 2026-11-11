"use client";
import {useEffect,useMemo,useState} from "react";
import Link from "next/link";
import {allCollections,getCollectionDiscoveries} from "@/lib/catalog";
import {supabaseBrowser} from "@/lib/supabase/client";
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
  }).catch(()=>{if(active){setError("We couldn’t load your account.");setStatus("error")}});
  return()=>{active=false};
 },[]);
 const collections=useMemo(()=>featured.map(slug=>allCollections.find(c=>c.slug===slug)).filter((c):c is (typeof allCollections)[number]=>Boolean(c)),[]);
 return <div>
  <div className="rounded-3xl bg-[#153e32] px-6 py-8 text-white sm:px-10 sm:py-10">
   <p className="text-xs font-bold uppercase tracking-[.2em] text-emerald-200">Your adventure starts here</p>
   <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">{status==="ready"&&completed>0?"Welcome back to Quested.":"Welcome to Quested."}</h1>
   <p className="mt-4 max-w-2xl text-base leading-7 text-emerald-50">Explore curated outdoor challenges, record places you have already visited, and see one accomplishment count toward every collection it belongs to.</p>
   <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold"><span className="rounded-full bg-white/15 px-3 py-2">✓ Your past adventures count</span><span className="rounded-full bg-white/15 px-3 py-2">✓ No GPS needed to get started</span><span className="rounded-full bg-white/15 px-3 py-2">✓ Free early beta</span></div>
  </div>
  {status==="loading"&&<p role="status" className="mt-6 text-sm text-slate-600">Checking your account...</p>}
  {status==="signed-out"&&<section className="mt-5 rounded-2xl border border-emerald-200 bg-white p-6">
   <h2 className="text-xl font-black">First, create your adventure record</h2>
   <p className="mt-2 text-sm leading-6 text-slate-600">Enter your email and open the sign-in link we send you. No password required. New accounts are created automatically.</p>
   <Link href="/sign-in?next=/welcome" className="mt-4 inline-flex rounded-full bg-[#163e32] px-6 py-3 text-sm font-bold text-white hover:bg-emerald-900">Get started with email →</Link>
   <p className="mt-3 text-xs text-slate-500">You can explore without an account. Sign-in is required only to save discoveries.</p>
  </section>}
  {status==="error"&&<section role="alert" className="mt-5 rounded-xl bg-amber-50 p-5 text-sm text-amber-900">{error} <Link href="/sign-in?next=/welcome" className="font-bold underline">Sign in again</Link></section>}
  {status==="ready"&&<section className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
   <p className="text-xs font-black uppercase tracking-widest text-emerald-800">✓ You’re signed in</p>
   <p className="mt-2 font-semibold text-emerald-950">{completed>0?`You already have ${completed} ${completed===1?"discovery":"discoveries"} in your adventure record. Keep going!`:"Your Quested account is ready. Start by adding a place you’ve visited."}</p>
   {completed>0&&<Link href="/my-quested" className="mt-3 inline-block text-sm font-bold text-emerald-800 underline">Go to My Quested →</Link>}
  </section>}
  <section className="mt-8" aria-label="How Quested works">
   <p className="text-xs font-bold uppercase tracking-[.17em] text-emerald-800">Three easy steps</p>
   <div className="mt-3 grid gap-3 sm:grid-cols-3">
    {[["01","Pick a collection","Choose a theme that interests you, from local parks to alpine peaks."],["02","Record a discovery","Open a place you’ve visited. Tap “Add or edit past visit”—the date is optional."],["03","Watch your progress grow","Every recorded visit advances all collections that include that place."]].map(([number,title,description])=><div key={number} className="rounded-2xl bg-white p-5 shadow-sm"><span className="text-xs font-black text-emerald-800">{number}</span><h2 className="mt-2 text-lg font-black">{title}</h2><p className="mt-2 text-sm leading-6 text-slate-600">{description}</p></div>)}
   </div>
  </section>
  <section className="mt-9">
   <div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[.17em] text-emerald-800">Choose where to begin</p><h2 className="mt-2 text-2xl font-black">Your first collection</h2><p className="mt-2 text-sm text-slate-600">Pick something familiar. Historical visits count, and you can explore every collection.</p></div><Link href="/collections" className="text-sm font-bold text-emerald-800 hover:underline">View all collections →</Link></div>
   <div className="mt-5 grid gap-4 sm:grid-cols-2">{collections.map(c=>{const photo=photoForCollection(c.slug);return <Link href={`/collections/${c.slug}`} key={c.slug} className="group flex gap-4 rounded-2xl border border-emerald-950/10 bg-white p-3 shadow-sm hover:border-emerald-500 hover:shadow-md">
    <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-emerald-100">{photo?<PhotoImage photo={photo} width={300} className="h-full w-full object-cover"/>:<div className="flex h-full items-center justify-center text-4xl">{c.emoji}</div>}</div>
    <div className="flex min-w-0 flex-1 flex-col justify-center"><h3 className="font-black group-hover:text-emerald-800">{c.name}</h3><p className="mt-1 text-xs leading-5 text-slate-600">{getCollectionDiscoveries(c.slug).length} discoveries · {c.category}</p><span className="mt-2 text-xs font-black text-emerald-800">Explore this collection →</span></div>
   </Link>})}</div>
  </section>
  <section className="mt-8 rounded-2xl border border-emerald-200 bg-white p-6">
   <p className="text-xs font-black uppercase tracking-widest text-emerald-800">An easy first example</p>
   <h2 className="mt-2 text-xl font-black">Already been to Pittock Mansion?</h2>
   <p className="mt-2 text-sm leading-6 text-slate-600">Record your visit once, and it contributes to both Portland Explorer and Portland Viewpoints. Start with an easy, familiar destination.</p>
   <Link href="/discoveries/pittock-mansion" className="mt-4 inline-block text-sm font-bold text-emerald-800 underline">See how a discovery works →</Link>
  </section>
  <p className="mt-7 text-center text-xs leading-5 text-slate-500">Quested is an early beta with an Oregon-focused catalog. We’re improving it with feedback from the first explorers.</p>
 </div>;
}
