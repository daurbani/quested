"use client";
import {useEffect,useMemo,useState} from "react";
import Link from "next/link";
import {allCollections,type Collection} from "@/lib/catalog";
import {supabaseBrowser} from "@/lib/supabase/client";
import CollectionCard from "@/components/collection-card";
import {photoForCollection} from "@/lib/media";
import {PhotoImage} from "@/components/photo";

type LoadState="loading"|"guest"|"signed-in"|"error";
type Progress={collection:Collection;completed:number;total:number;percent:number};
function QuickCard({href,eyebrow,title,description,photoSlug,icon,progress}:{href:string;eyebrow:string;title:string;description:string;photoSlug?:string;icon?:string;progress?:number}){
 const photo=photoSlug?photoForCollection(photoSlug):undefined;
 return <Link href={href} className="group flex min-w-[250px] flex-1 items-center gap-3 rounded-2xl border border-emerald-950/10 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:min-w-0">
  {photo?<div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-emerald-100"><PhotoImage photo={photo} width={300} className="h-full w-full object-cover"/></div>:<span aria-hidden className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-4xl">{icon??"✦"}</span>}
  <div className="min-w-0 flex-1">
   <p className="text-[10px] font-black uppercase tracking-[.13em] text-emerald-800">{eyebrow}</p>
   <h3 className="mt-1 line-clamp-2 text-sm font-black leading-5 sm:text-base">{title}</h3>
   {progress!==undefined&&<div role="progressbar" aria-label={title+" progress"} aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress} className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-200"><div className="h-full rounded-full bg-emerald-700" style={{width:progress+"%"}}/></div>}
   <p className="mt-1 text-xs leading-5 text-slate-600">{description}</p>
  </div><span aria-hidden className="text-lg font-bold text-emerald-700 group-hover:translate-x-1">→</span>
 </Link>;
}
export default function HomeExperience(){
 const [state,setState]=useState<LoadState>("loading");
 const [done,setDone]=useState<Set<string>>(()=>new Set());
 useEffect(()=>{
  const sb=supabaseBrowser();
  if(!sb){setState("guest");return;}
  let active=true;
  void sb.auth.getUser().then(async({data,error})=>{
   if(!active)return;
   if(error||!data.user){setState("guest");return;}
   const result=await sb.from("user_discoveries").select("discovery_slug").eq("user_id",data.user.id);
   if(!active)return;
   if(result.error){setState("error");return;}
   setDone(new Set((result.data??[]).map(row=>row.discovery_slug as string)));
   setState("signed-in");
  }).catch(()=>{if(active)setState("error")});
  return()=>{active=false};
 },[]);
 const progress=useMemo<Progress[]>(()=>allCollections.map(collection=>{
  const total=collection.discoverySlugs.length;
  const completed=collection.discoverySlugs.filter(slug=>done.has(slug)).length;
  return {collection,completed,total,percent:total?Math.round(completed/total*100):0};
 }),[done]);
 const mastered=progress.filter(p=>p.total>0&&p.completed===p.total);
 const active=progress.filter(p=>p.completed>0&&p.completed<p.total).sort((a,b)=>b.percent-a.percent||b.completed-a.completed)[0];
 const recommended=progress.find(p=>p.completed===0)?.collection??allCollections[0];
 const featured=allCollections.find(c=>c.slug==="columbia-gorge-waterfalls")??allCollections[0];
 const signedIn=state==="signed-in";
 const showPersonalProgress=signedIn&&done.size>0;
 return <>
  <section className="mt-5" aria-label="Adventure shortcuts">
   <div className="flex gap-3 overflow-x-auto pb-2 sm:grid sm:grid-cols-3 sm:overflow-visible">
    {showPersonalProgress&&active?<QuickCard href={`/collections/${active.collection.slug}`} eyebrow="Continue your progress" title={active.collection.name} description={`${active.completed} of ${active.total} discoveries · ${active.total-active.completed} to go`} photoSlug={active.collection.slug} progress={active.percent}/>:
     <QuickCard href={`/collections/${recommended.slug}`} eyebrow={showPersonalProgress?"Your next challenge":"Start exploring"} title={recommended.name} description={`${recommended.discoverySlugs.length} places to discover`} photoSlug={recommended.slug}/>}
    <QuickCard href={`/collections/${featured.slug}`} eyebrow="Featured collection" title={featured.name} description="Discover remarkable falls across the Gorge." photoSlug={featured.slug}/>
    {signedIn?<QuickCard href="/my-quested" eyebrow="Hall of Fame" title={mastered.length? `${mastered.length} ${mastered.length===1?"collection":"collections"} mastered`:"Your achievements"} description={mastered.length?"See your earned milestones.":"Every adventure adds to your story."} icon="🏆"/>:
     <QuickCard href="/sign-in?next=/my-quested" eyebrow="Make it yours" title="Track your discoveries" description="Save visits and earn collection achievements." icon="🏆"/>}
   </div>
   {state==="error"&&<p className="mt-2 text-xs text-slate-500">Your personal progress is temporarily unavailable. Collections are still open to explore.</p>}
  </section>
  <section className="mt-7 rounded-2xl border border-emerald-200 bg-white p-5 sm:flex sm:items-center sm:justify-between"><div><p className="text-xs font-black uppercase tracking-widest text-emerald-700">New · Adventure Map</p><h2 className="mt-2 text-xl font-black">Find somewhere new to explore</h2><p className="mt-2 text-sm text-slate-600">Browse 57 Oregon destinations on a map and save the ones you want to visit.</p></div><Link href="/map" className="mt-4 inline-flex shrink-0 items-center justify-center rounded-full bg-[#163e32] px-5 py-3 text-sm font-bold !text-white hover:bg-[#205846] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 sm:mt-0" style={{color:"#ffffff"}}>Open map →</Link></section>
  <section className="pt-9 pb-6 sm:pt-10">
   <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
    <div><p className="text-xs font-black uppercase tracking-[.18em] text-emerald-700">Explore Oregon</p>
     <h2 className="mt-2 text-3xl font-black tracking-tight">Popular collections</h2>
     <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">Mountains, waterfalls, city viewpoints and coastal escapes—curated adventures across Oregon.</p>
    </div>
    <Link href="/collections" className="text-sm font-black text-emerald-800 hover:underline">View all collections →</Link>
   </div>
   <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {allCollections.map(collection=>{
     const item=progress.find(p=>p.collection.slug===collection.slug);
     return <CollectionCard key={collection.slug} collection={collection} variant="compact" progress={signedIn?item?{completed:item.completed,total:item.total}:undefined:undefined}/>;
    })}
   </div>
   <p className="mt-6 text-xs text-slate-500">Every place counts once in your history—even when it advances multiple collections.</p>
  </section>
 </>;
}
