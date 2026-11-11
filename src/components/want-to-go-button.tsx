"use client";
import {useEffect,useState} from "react";
import Link from "next/link";
import {supabaseBrowser} from "@/lib/supabase/client";
type Props={slug:string;compact?:boolean;saved?:boolean;onChanged?:(saved:boolean)=>void};
export default function WantToGoButton({slug,compact=false,saved:controlled,onChanged}:Props){
 const [localSaved,setLocalSaved]=useState(false),[signedIn,setSignedIn]=useState<boolean|null>(null),[busy,setBusy]=useState(false),[error,setError]=useState("");
 const saved=controlled??localSaved;
 useEffect(()=>{let active=true;const sb=supabaseBrowser();if(!sb){setSignedIn(false);return;}
  void sb.auth.getUser().then(async({data})=>{if(!active)return;const id=data.user?.id;if(!id){setSignedIn(false);return;}setSignedIn(true);if(controlled!==undefined)return;
   const result=await sb.from("user_want_to_go").select("discovery_slug").eq("user_id",id).eq("discovery_slug",slug).maybeSingle();
   if(active&&!result.error)setLocalSaved(Boolean(result.data));
  }).catch(()=>{if(active)setSignedIn(false)});
  return()=>{active=false};
 },[slug,controlled]);
 async function toggle(){
  const sb=supabaseBrowser();if(!sb)return;setBusy(true);setError("");
  const {data}=await sb.auth.getUser();const userId=data.user?.id;if(!userId){setSignedIn(false);setBusy(false);return;}
  const response=saved?await sb.from("user_want_to_go").delete().eq("user_id",userId).eq("discovery_slug",slug):await sb.from("user_want_to_go").insert({user_id:userId,discovery_slug:slug});
  if(response.error)setError("Could not update your list. Try again.");
  else{setLocalSaved(!saved);onChanged?.(!saved);}
  setBusy(false);
 }
 const style=compact?"rounded-full border border-emerald-900/20 bg-white px-4 py-2 text-xs font-bold text-emerald-900 hover:bg-emerald-50":"w-full rounded-xl border border-emerald-900/20 bg-white px-5 py-3 text-sm font-bold text-emerald-900 hover:bg-emerald-50";
 if(signedIn===false)return <Link href={"/sign-in?next="+encodeURIComponent("/discoveries/"+slug)} className={"inline-flex items-center justify-center "+style}>☆ Want to go · Sign in</Link>;
 return <div><button type="button" disabled={busy||signedIn===null} onClick={()=>void toggle()} aria-pressed={saved} className={style+" disabled:opacity-50"}>{saved?"★ On your Want to Go list":"☆ Want to go"}</button>{error&&<p role="alert" className="mt-2 text-xs text-red-700">{error}</p>}</div>;
}
