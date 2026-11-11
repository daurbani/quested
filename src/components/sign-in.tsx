"use client";
import {useState} from "react";
import Link from "next/link";
import {isConfigured,supabaseBrowser} from "@/lib/supabase/client";
export default function SignIn({next}:{next:string}){
 const [busy,setBusy]=useState(false),[error,setError]=useState(""),[email,setEmail]=useState(""),[sent,setSent]=useState(false);
 const safeNext=next.startsWith("/")&&!next.startsWith("//")&&!next.startsWith("/\\")?next:"/welcome";
 const redirectTo=()=>location.origin+"/auth/callback?next="+encodeURIComponent(safeNext);
 async function emailLogin(){
  const sb=supabaseBrowser();if(!sb)return;
  setBusy(true);setError("");
  const {error}=await sb.auth.signInWithOtp({email:email.trim(),options:{emailRedirectTo:redirectTo(),shouldCreateUser:true}});
  if(error)setError(error.message);else setSent(true);
  setBusy(false);
 }
 return <div className="mt-7">
  {isConfigured()?<>
   {sent?<div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6" role="status">
    <p className="text-2xl">✉️</p><h2 className="mt-2 text-xl font-black text-emerald-950">Check your email</h2>
    <p className="mt-3 text-sm leading-6 text-emerald-950">We sent a secure link to <strong>{email.trim()}</strong>. Open it to finish signing in.</p>
    <p className="mt-3 text-sm leading-6 text-emerald-900">If you don't see it, check spam or promotions. Use the same browser for the smoothest experience.</p>
    <button type="button" onClick={()=>setSent(false)} className="mt-5 text-sm font-bold text-emerald-800 underline">Use a different email or send another link</button>
   </div>:<form onSubmit={e=>{e.preventDefault();void emailLogin()}} className="rounded-2xl border border-emerald-950/10 p-5">
    <label htmlFor="login-email" className="block text-sm font-bold">Your email address</label>
    <input id="login-email" required type="email" autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" className="mt-2 w-full rounded-xl border border-emerald-950/20 bg-white px-4 py-3 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-200"/>
    <button disabled={busy} type="submit" className="mt-4 w-full rounded-xl bg-[#163e32] px-5 py-3 font-black text-white hover:bg-emerald-900 disabled:opacity-50">{busy?"Sending...":"Continue with email →"}</button>
    <p className="mt-3 text-xs leading-5 text-slate-600">No password needed. We'll email you a sign-in link, and create your account if you're new.</p>
   </form>}
   {error&&<p role="alert" className="mt-4 rounded-lg bg-red-50 p-4 text-sm text-red-800">{error}</p>}
  </>:<p className="rounded-xl bg-amber-50 p-5 text-sm text-amber-900">Account sign-in is temporarily unavailable. You can still explore collections.</p>}
  <Link href="/collections" className="mt-5 block text-center text-sm font-bold text-emerald-800">Explore without signing in →</Link>
 </div>;
}
