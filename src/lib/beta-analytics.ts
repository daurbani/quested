"use client";
import {supabaseBrowser} from "@/lib/supabase/client";
export type BetaEvent="session_started"|"welcome_viewed"|"discovery_saved"|"collection_mastered";
// Non-blocking: never prevent an activity if optional measurement fails.
export async function recordBetaEvent(userId:string,eventName:BetaEvent,detail?:string){
 const sb=supabaseBrowser();if(!sb)return;
 try{await sb.from("beta_events").insert({user_id:userId,event_name:eventName,event_detail:detail?.slice(0,120)??null});}
 catch{/* Analytics must never affect normal app use. */}
}
