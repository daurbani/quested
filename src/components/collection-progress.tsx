"use client";
import {useEffect,useMemo,useState} from "react";
import Link from "next/link";
import {supabaseBrowser} from "@/lib/supabase/client";
export default function CollectionProgress({slugs,name,emoji}:{slugs:string[];name:string;emoji:string}){
 const sb=supabaseBrowser();
 const [count,setCount]=useState<number|null>(null);
 const [copied,setCopied]=useState(false);
 const key=slugs.join(",");
 const known=useMemo(()=>key.split(",").filter(Boolean),[key]);
 useEffect(()=>{if(!sb||known.length===0)return;let active=true;void sb.auth.getUser().then(async({data})=>{if(!data.user||!active)return;const {data:rows,error}=await sb.from("user_discoveries").select("discovery_slug").eq("user_id",data.user.id).in("discovery_slug",known);if(active&&!error)setCount(rows?.length??0)});return()=>{active=false};},[sb,known]);
 if(count===null)return null;
 const pct=known.length?Math.round(count/known.length*100):0;
 const finished=count===known.length&&known.length>0;
 async function share(){
  const message=`🏆 I completed the ${name} collection on Quested — all ${known.length} discoveries! Explore the challenge: ${location.href}`;
  try{await navigator.clipboard.writeText(message);setCopied(true)}catch{setCopied(false)}
 }
 return <div className="mt-6">
  <div className="mb-2 flex justify-between gap-3 text-sm font-semibold text-white"><span>Your progress</span><span>{count} / {known.length} · {pct}%</span></div>
  <div role="progressbar" aria-label="Collection progress" aria-valuemin={0} aria-valuemax={known.length} aria-valuenow={count} className="h-2 overflow-hidden rounded-full bg-white/30"><div className="h-full rounded-full bg-emerald-200 transition-[width]" style={{width:pct+"%"}}/></div>
  {finished&&<div role="status" className="quested-celebration relative mt-7 overflow-hidden rounded-2xl border border-amber-200/70 bg-gradient-to-br from-[#fff7de] via-[#ffedb1] to-[#f7d47c] p-6 text-[#453113] shadow-lg">
   <div aria-hidden className="quested-sparkle absolute right-6 top-2 text-2xl">✦</div>
   <div aria-hidden className="quested-sparkle absolute right-14 bottom-5 text-3xl" style={{animationDelay:"0.6s"}}>✧</div>
   <div className="relative flex items-start gap-4">
    <span aria-hidden className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-4 border-amber-600/40 bg-amber-200 text-4xl shadow-sm">🏆</span>
    <div><p className="text-xs font-black uppercase tracking-[.18em] text-amber-900">Collection mastered</p>
     <h2 className="mt-1 text-2xl font-black">{emoji} {name}</h2>
     <p className="mt-2 text-sm leading-6">Every discovery completed. You have earned this collection achievement!</p>
    </div>
   </div>
   <div className="relative mt-5 flex flex-wrap items-center gap-4">
    <button type="button" onClick={()=>void share()} className="rounded-full bg-[#453113] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#67461c]">{copied?"✓ Copied to clipboard":"Share achievement"}</button>
    <Link href="/my-quested" className="text-sm font-bold text-[#453113] underline underline-offset-4">View your achievements</Link>
   </div>
  </div>}
 </div>;
}
