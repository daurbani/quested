"use client";
import {useEffect,useState} from "react";
import Link from "next/link";
import {supabaseBrowser} from "@/lib/supabase/client";

type Profile={user_id:string;handle:string;display_name:string;bio:string};
export default function ProfileSettings(){
 const [userId,setUserId]=useState<string|null>(null);
 const [profile,setProfile]=useState<Profile|null>(null);
 const [handle,setHandle]=useState(""),[name,setName]=useState(""),[bio,setBio]=useState("");
 const [loading,setLoading]=useState(true),[busy,setBusy]=useState(false),[message,setMessage]=useState("");
 useEffect(()=>{const sb=supabaseBrowser();if(!sb){setLoading(false);return;}let active=true;
  void sb.auth.getUser().then(async({data,error})=>{
   if(!active)return;
   if(error||!data.user){setLoading(false);return;}
   setUserId(data.user.id);
   const result=await sb.from("user_profiles").select("user_id,handle,display_name,bio").eq("user_id",data.user.id).maybeSingle();
   if(!active)return;
   if(result.error)setMessage("Profiles are temporarily unavailable. Please try again later.");
   else if(result.data){const p=result.data as Profile;setProfile(p);setHandle(p.handle);setName(p.display_name);setBio(p.bio);}
   setLoading(false);
  }).catch(()=>{if(active){setLoading(false);setMessage("Could not load your profile.");}});
  return()=>{active=false};
 },[]);
 async function save(e:React.FormEvent){e.preventDefault();if(!userId||busy)return;
  const cleanHandle=handle.trim().toLowerCase(),cleanName=name.trim(),cleanBio=bio.trim();
  if(!/^[a-z0-9][a-z0-9_-]{2,29}$/.test(cleanHandle)){setMessage("Choose a handle 3–30 characters long using lowercase letters, numbers, _ or -.");return;}
  if(cleanName.length<1||cleanName.length>60||cleanBio.length>280){setMessage("Use a name of 1–60 characters and a bio under 280 characters.");return;}
  const sb=supabaseBrowser();if(!sb)return;setBusy(true);setMessage("");
  // Never allow browsers to update or assign another user's profile.
  const payload={user_id:userId,handle:cleanHandle,display_name:cleanName,bio:cleanBio};
  const result=profile
   ?await sb.from("user_profiles").update({handle:cleanHandle,display_name:cleanName,bio:cleanBio}).eq("user_id",userId).select("user_id,handle,display_name,bio").single()
   :await sb.from("user_profiles").insert(payload).select("user_id,handle,display_name,bio").single();
  setBusy(false);
  if(result.error){setMessage(result.error.code==="23505"?"That handle is already taken. Try another.":"Could not save your profile. Please try again.");return;}
  setProfile(result.data as Profile);setMessage("Profile saved.");
 }
 if(loading)return <p className="text-slate-600">Loading profile…</p>;
 if(!userId)return <p>Sign in to set up your profile. <Link href="/sign-in?next=/profile" className="font-bold text-emerald-800 underline">Sign in →</Link></p>;
 return <div className="rounded-2xl border border-emerald-950/10 bg-white p-6">
  <p className="text-sm text-slate-600">Create a public identity for collections you share. Your email and private adventure history are never shown on this profile.</p>
  <form onSubmit={e=>void save(e)} className="mt-6 space-y-5">
   <label className="block text-sm font-bold">Display name<input required maxLength={60} value={name} onChange={e=>setName(e.target.value)} placeholder="Your name" className="mt-2 w-full rounded-xl border border-slate-300 p-3 font-normal"/></label>
   <label className="block text-sm font-bold">Public handle<input required minLength={3} maxLength={30} value={handle} onChange={e=>setHandle(e.target.value.toLowerCase())} placeholder="trailname" autoCapitalize="none" autoCorrect="off" className="mt-2 w-full rounded-xl border border-slate-300 p-3 font-normal"/><span className="mt-1 block text-xs font-normal text-slate-500">Lowercase letters, numbers, underscores and hyphens. Your profile URL will be /u/{handle||"trailname"}.</span></label>
   <label className="block text-sm font-bold">About you (optional)<textarea maxLength={280} rows={3} value={bio} onChange={e=>setBio(e.target.value)} placeholder="What adventures inspire you?" className="mt-2 w-full rounded-xl border border-slate-300 p-3 font-normal"/></label>
   <button type="submit" disabled={busy} className="rounded-full bg-[#163e32] px-6 py-3 text-sm font-bold text-white disabled:opacity-50">{busy?"Saving…":profile?"Update profile":"Create public profile"}</button>
  </form>
  {message&&<p role="status" className="mt-4 text-sm text-emerald-900">{message}</p>}
  {profile&&<Link className="mt-4 inline-block text-sm font-bold text-emerald-800 underline" href={`/u/${profile.handle}`}>View public profile →</Link>}
 </div>;
}
