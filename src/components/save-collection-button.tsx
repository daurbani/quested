"use client";
import {useEffect,useState} from "react";
import Link from "next/link";
import {supabaseBrowser} from "@/lib/supabase/client";
export default function SaveCollectionButton({slug}:{slug:string}){
 const [userId,setUserId]=useState<string|null>(null),[saved,setSaved]=useState(false),[loading,setLoading]=useState(true),[busy,setBusy]=useState(false),[error,setError]=useState("");
 useEffect(()=>{const sb=supabaseBrowser();if(!sb){setLoading(false);return;}let active=true;
  void sb.auth.getUser().then(async({data,error})=>{
   if(!active)return;
   if(error||!data.user){setLoading(false);return;}
   setUserId(data.user.id);
   const result=await sb.from("user_saved_collections").select("collection_slug").eq("user_id",data.user.id).eq("collection_slug",slug).maybeSingle();
   if(!active)return;
   if(result.error)setError("Collection saving is temporarily unavailable.");
   else setSaved(Boolean(result.data));
   setLoading(false);
  }).catch(()=>{if(active){setLoading(false);setError("Collection saving is temporarily unavailable.");}});
  return()=>{active=false};
 },[slug]);
 async function toggle(){if(!userId||busy)return;const sb=supabaseBrowser();if(!sb)return;
  setBusy(true);setError("");
  const result=saved
   ?await sb.from("user_saved_collections").delete().eq("user_id",userId).eq("collection_slug",slug)
   :await sb.from("user_saved_collections").insert({user_id:userId,collection_slug:slug});
  if(result.error)setError("Could not update this collection. Please try again.");
  else setSaved(!saved);
  setBusy(false);
 }
 if(loading)return null;
 if(!userId)return <Link href={`/sign-in?next=/collections/${slug}`} className="mt-5 inline-block rounded-full border border-white/50 px-5 py-2.5 text-sm font-bold text-white hover:bg-white/10">Sign in to save collection</Link>;
 return <div className="mt-5"><button type="button" onClick={()=>void toggle()} disabled={busy} aria-pressed={saved} className="rounded-full border border-white/50 bg-white/10 px-5 py-2.5 text-sm font-bold text-white hover:bg-white/20 disabled:opacity-60">{busy?"Updating…":saved?"✓ Saved to My Collections":"☆ Save collection"}</button>{error&&<p role="alert" className="mt-2 text-xs text-amber-100">{error}</p>}</div>;
}
