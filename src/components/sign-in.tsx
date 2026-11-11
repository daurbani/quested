"use client";
import {useState} from "react";
import Link from "next/link";
import {isConfigured,supabaseBrowser} from "@/lib/supabase/client";
export default function SignIn({next}:{next:string}){
 const [busy,setBusy]=useState(false),[error,setError]=useState(""),[email,setEmail]=useState(""),[sent,setSent]=useState(false);
 const safeNext=next.startsWith("/")&&!next.startsWith("//")&&!next.startsWith("/\\")?next:"/my-quested";
 const redirectTo=()=>location.origin+"/auth/callback?next="+encodeURIComponent(safeNext);
 async function login(provider:"google"|"apple"){const sb=supabaseBrowser();if(!sb)return;setBusy(true);setError("");const {error}=await sb.auth.signInWithOAuth({provider,options:{redirectTo:redirectTo()}});if(error){setError(error.message);setBusy(false)}}
 async function emailLogin(){const sb=supabaseBrowser();if(!sb)return;setBusy(true);setError("");const {error}=await sb.auth.signInWithOtp({email,options:{emailRedirectTo:redirectTo()}});if(error)setError(error.message);else setSent(true);setBusy(false)}
 return <div className="mt-8 space-y-4">{isConfigured()?<>
 <form onSubmit={e=>{e.preventDefault();void emailLogin()}} className="rounded-xl border border-emerald-950/10 p-4">
 <label htmlFor="login-email" className="block text-sm font-semibold">Email sign-in link</label><input id="login-email" required type="email" autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" className="mt-2 w-full rounded-lg border border-emerald-950/20 px-4 py-3"/>
 <button disabled={busy} type="submit" className="mt-3 w-full rounded-xl bg-[#163e32] px-5 py-3 font-bold text-white disabled:opacity-50">Email me a sign-in link</button>{sent&&<p role="status" className="mt-3 text-sm text-emerald-800">Check your email for a sign-in link. Open it in this browser.</p>}</form>
 <p className="text-center text-sm text-slate-500">Or use a social account (once providers are configured)</p>
 <button disabled={busy} onClick={()=>void login("google")} className="w-full rounded-xl border border-emerald-950/20 bg-white px-5 py-3 font-bold disabled:opacity-50">Continue with Google</button><button disabled={busy} onClick={()=>void login("apple")} className="w-full rounded-xl border border-emerald-950/20 bg-white px-5 py-3 font-bold disabled:opacity-50">Continue with Apple</button>
 {error&&<p role="alert" className="text-sm text-red-700">{error}</p>}</>:<p className="rounded-xl bg-amber-50 p-5 text-sm text-amber-900">Accounts are being configured. You can still explore collections.</p>}<Link href="/collections" className="block text-center text-sm font-semibold text-emerald-800">Explore without an account →</Link></div>;
}
