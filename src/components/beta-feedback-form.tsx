"use client";
import {useEffect,useState} from "react";
import Link from "next/link";
import {supabaseBrowser} from "@/lib/supabase/client";
type Category="idea"|"bug"|"confusing"|"other";
export default function BetaFeedbackForm(){
 const [userId,setUserId]=useState<string|null>(null),[loading,setLoading]=useState(true);
 const [category,setCategory]=useState<Category>("idea"),[message,setMessage]=useState("");
 const [busy,setBusy]=useState(false),[sent,setSent]=useState(false),[error,setError]=useState("");
 useEffect(()=>{
  const sb=supabaseBrowser();if(!sb){setLoading(false);return;}
  let active=true;
  void sb.auth.getUser().then(({data})=>{if(active){setUserId(data.user?.id??null);setLoading(false)}}).catch(()=>{if(active){setLoading(false);setError("We couldn't check your account. Please refresh and try again.")}});
  return()=>{active=false};
 },[]);
 async function submit(e:React.FormEvent<HTMLFormElement>){
  e.preventDefault();const sb=supabaseBrowser();const clean=message.trim();
  if(!sb||!userId||clean.length<10||clean.length>2000)return;
  setBusy(true);setError("");
  const {error}=await sb.from("beta_feedback").insert({user_id:userId,category,message:clean,page_path:null});
  if(error)setError("We couldn't save your feedback. Please try again or email us.");
  else{setSent(true);setMessage("");}
  setBusy(false);
 }
 if(loading)return <p role="status" className="mt-6 text-sm text-slate-600">Checking your sign-in...</p>;
 if(sent)return <section role="status" className="mt-7 rounded-2xl border border-emerald-200 bg-emerald-50 p-6"><h2 className="text-xl font-black text-emerald-950">Thanks for helping shape Quested!</h2><p className="mt-2 text-sm leading-6 text-emerald-900">Your feedback has been recorded.</p><button className="mt-4 text-sm font-bold text-emerald-800 underline" onClick={()=>setSent(false)}>Send another note</button></section>;
 if(!userId)return <section className="mt-7 rounded-2xl border border-emerald-200 bg-white p-6"><h2 className="text-lg font-black">Sign in to send feedback</h2><p className="mt-2 text-sm leading-6 text-slate-600">Sign-in helps us follow up on your feedback without asking you to share your email again.</p><Link href="/sign-in?next=/feedback" className="mt-4 inline-block rounded-full bg-[#163e32] px-5 py-3 text-sm font-bold text-white">Sign in →</Link><p className="mt-4 text-sm text-slate-600">Prefer email? <a href="mailto:quested.support@gmail.com?subject=Quested%20beta%20feedback" className="font-bold text-emerald-800 underline">Contact support</a>.</p></section>;
 return <form onSubmit={e=>void submit(e)} className="mt-7 space-y-5 rounded-2xl border border-emerald-950/10 bg-white p-6 shadow-sm">
  <div><label htmlFor="feedback-type" className="block text-sm font-bold">What would you like to share?</label><select id="feedback-type" value={category} onChange={e=>setCategory(e.target.value as Category)} className="mt-2 w-full rounded-xl border border-emerald-950/20 bg-white px-4 py-3 text-sm"><option value="idea">An idea or suggestion</option><option value="bug">Something isn't working</option><option value="confusing">Something is confusing</option><option value="other">Other feedback</option></select></div>
  <div><label htmlFor="feedback-message" className="block text-sm font-bold">Tell us more</label><textarea id="feedback-message" required minLength={10} maxLength={2000} rows={6} value={message} onChange={e=>setMessage(e.target.value)} placeholder="What happened? What would make Quested better?" className="mt-2 w-full rounded-xl border border-emerald-950/20 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-200"/><p className="mt-1 text-xs text-slate-500">10–2,000 characters. Please don't include sensitive personal information.</p></div>
  {error&&<p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-800">{error}</p>}
  <button disabled={busy||message.trim().length<10} className="w-full rounded-xl bg-[#163e32] px-5 py-3 font-bold text-white disabled:opacity-50" type="submit">{busy?"Sending...":"Send feedback"}</button>
  <p className="text-xs text-slate-500">Your note is private to the Quested team and associated with your account.</p>
 </form>;
}
