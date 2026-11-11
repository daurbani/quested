"use client";
import {useEffect} from "react";
import {supabaseBrowser} from "@/lib/supabase/client";
import {recordBetaEvent} from "@/lib/beta-analytics";
// Measures authenticated sessions once per browser tab, without third-party cookies.
export default function BetaSessionTracker(){
 useEffect(()=>{
  const sb=supabaseBrowser();if(!sb)return;
  let cancelled=false;
  void sb.auth.getUser().then(({data})=>{
   if(cancelled||!data.user)return;
   try{
    const key="quested-beta-session:"+data.user.id;
    if(sessionStorage.getItem(key))return;
    sessionStorage.setItem(key,"1");
    void recordBetaEvent(data.user.id,"session_started");
   }catch{/* Storage unavailable: skip optional event. */}
  });
  return()=>{cancelled=true};
 },[]);
 return null;
}
