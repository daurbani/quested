"use client";
import {useEffect,useMemo,useState} from "react";
import {supabaseBrowser} from "@/lib/supabase/client";
export default function CollectionProgress({slugs}:{slugs:string[]}){
 const sb=supabaseBrowser();const [count,setCount]=useState<number|null>(null);
 const key=slugs.join(",");
 const known=useMemo(()=>key.split(",").filter(Boolean),[key]);
 useEffect(()=>{if(!sb)return;let active=true;void sb.auth.getUser().then(async({data})=>{if(!data.user||!active)return;const {data:rows,error}=await sb.from("user_discoveries").select("discovery_slug").eq("user_id",data.user.id).in("discovery_slug",known);if(active&&!error)setCount(rows?.length??0)});return()=>{active=false};},[sb,known]);
 if(count===null)return null;const pct=known.length?Math.round(count/known.length*100):0;
 return <div className="mt-6"><div className="mb-2 flex justify-between text-sm font-semibold text-white"><span>Your progress</span><span>{count} / {known.length} · {pct}%</span></div><div role="progressbar" aria-label="Collection progress" aria-valuemin={0} aria-valuemax={known.length} aria-valuenow={count} className="h-2 overflow-hidden rounded-full bg-white/30"><div className="h-full bg-emerald-200 transition-[width]" style={{width:pct+"%"}}/></div></div>;
}
