"use client";
import {useEffect,useState} from "react";
import Link from "next/link";
import {supabaseBrowser} from "@/lib/supabase/client";
export default function PublicProfile({handle}:{handle:string}){
 const [profile,setProfile]=useState<{handle:string;display_name:string;bio:string}|null>(null),[loading,setLoading]=useState(true);
 useEffect(()=>{let active=true;const sb=supabaseBrowser();if(!sb){setLoading(false);return;}
  void sb.from("user_profiles").select("handle,display_name,bio").eq("handle",handle).maybeSingle().then(({data})=>{if(active){setProfile(data);setLoading(false);}});
  return()=>{active=false};
 },[handle]);
 if(loading)return <p className="text-slate-600">Loading profile…</p>;
 if(!profile)return <div><h1 className="text-3xl font-black">Profile not found</h1><Link className="mt-4 inline-block font-bold text-emerald-800" href="/collections">Browse collections →</Link></div>;
 return <><p className="text-xs font-black uppercase tracking-widest text-emerald-700">Quested adventurer</p><h1 className="mt-3 text-4xl font-black">{profile.display_name}</h1><p className="mt-2 text-slate-500">@{profile.handle}</p>{profile.bio&&<p className="mt-7 max-w-xl whitespace-pre-wrap leading-7 text-slate-700">{profile.bio}</p>}<p className="mt-9 rounded-xl bg-emerald-50 p-5 text-sm text-emerald-900">Collections shared by this adventurer will appear here in a future update. Personal visits and saved collections remain private.</p></>;
}
