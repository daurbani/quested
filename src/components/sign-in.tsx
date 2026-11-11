"use client";
import {useState} from "react";
import Link from "next/link";
import {isConfigured,supabaseBrowser} from "@/lib/supabase/client";
export default function SignIn({next}:{next:string}){
 const [busy,setBusy]=useState(false),[error,setError]=useState(""),[email,setEmail]=useState(""),[sent,setSent]=useState(false);
 const safeNext=next.startsWith("/")&&!next.startsWith("//")&&!next.startsWith("/\\")?next:"/welcome";
 const googleEnabled=process.env.NEXT_PUBLIC_ENABLE_GOOGLE_OAUTH==="true";
 const redirectTo=()=>location.origin+"/auth/callback?next="+encodeURIComponent(safeNext);
 async function googleLogin(){
  const sb=supabaseBrowser();if(!sb||!googleEnabled)return;
  setBusy(true);setError("");
  const {error}=await sb.auth.signInWithOAuth({provider:"google",options:{redirectTo:redirectTo()}});
  if(error){setError(error.message);setBusy(false)}
 }
 async function emailLogin(){
  const sb=supabaseBrowser();if(!sb)return;
  setBusy(true);setError("");
  const {error}=await sb.auth.signInWithOtp({email:email.trim(),options:{emailRedirectTo:redirectTo(),shouldCreateUser:true}});
  if(error)setError(error.message);else setSent(true);
  setBusy(false);
 }
 return <div className="mt-7">
  {isConfigured()?<>
   {googleEnabled&&!sent&&<div className="mb-5">
    <button type="button" disabled={busy} onClick={()=>void googleLogin()} className="flex w-full items-center justify-center gap-3 rounded-xl border border-emerald-950/20 bg-white px-5 py-3.5 font-bold text-[#19322b] shadow-sm hover:bg-slate-50 disabled:opacity-50">
     <svg aria-hidden="true" width="20" height="20" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 5.38 6.51 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.25 5.48-4.76 7.18l7.73 6C44.42 38.03 46.98 31.88 46.98 24.55z"/><path fill="#FBBC05" d="M10.53 28.59A14.47 14.47 0 0 1 9.75 24c0-1.59.27-3.13.76-4.59l-7.98-6.2A23.9 23.9 0 0 0 0 24c0 3.88.93 7.55 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.91-5.8l-7.73-6c-2.14 1.44-4.88 2.3-8.18 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.97 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
     Continue with Google
    </button>
    <div className="mt-5 flex items-center gap-3 text-xs text-slate-500"><span className="h-px flex-1 bg-slate-200"/><span>or continue with email</span><span className="h-px flex-1 bg-slate-200"/></div>
   </div>}
   {sent?<div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6" role="status">
    <p className="text-2xl">✉️</p><h2 className="mt-2 text-xl font-black text-emerald-950">Check your email</h2>
    <p className="mt-3 text-sm leading-6 text-emerald-950">We sent a secure link to <strong>{email.trim()}</strong>. Open it to finish signing in.</p>
    <p className="mt-3 text-sm leading-6 text-emerald-900">If you don’t see it, check spam or promotions. Use the same browser for the smoothest experience.</p>
    <button type="button" onClick={()=>setSent(false)} className="mt-5 text-sm font-bold text-emerald-800 underline">Use a different email or send another link</button>
   </div>:<form onSubmit={e=>{e.preventDefault();void emailLogin()}} className="rounded-2xl border border-emerald-950/10 p-5">
    <label htmlFor="login-email" className="block text-sm font-bold">Your email address</label>
    <input id="login-email" required type="email" autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" className="mt-2 w-full rounded-xl border border-emerald-950/20 bg-white px-4 py-3 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-200"/>
    <button disabled={busy} type="submit" className="mt-4 w-full rounded-xl bg-[#163e32] px-5 py-3 font-black text-white hover:bg-emerald-900 disabled:opacity-50">{busy?"Sending...":"Continue with email →"}</button>
    <p className="mt-3 text-xs leading-5 text-slate-600">No password needed. We’ll email you a sign-in link, and create your account if you’re new.</p>
   </form>}
   {error&&<p role="alert" className="mt-4 rounded-lg bg-red-50 p-4 text-sm text-red-800">{error}</p>}
  </>:<p className="rounded-xl bg-amber-50 p-5 text-sm text-amber-900">Account sign-in is temporarily unavailable. You can still explore collections.</p>}
  <Link href="/collections" className="mt-5 block text-center text-sm font-bold text-emerald-800">Explore without signing in →</Link>
 </div>;
}
