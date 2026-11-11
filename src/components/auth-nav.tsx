"use client";
import {useEffect,useState} from "react";
import Link from "next/link";
import {isConfigured,supabaseBrowser} from "@/lib/supabase/client";
export default function AuthNav(){const [signedIn,setSignedIn]=useState(false);
useEffect(()=>{const sb=supabaseBrowser();if(!sb)return;let active=true;void sb.auth.getUser().then(({data})=>{if(active)setSignedIn(Boolean(data.user))});const {data:{subscription}}=sb.auth.onAuthStateChange((_event,session)=>{if(active)setSignedIn(Boolean(session?.user))});return()=>{active=false;subscription.unsubscribe()};},[]);
return <Link href={signedIn||!isConfigured()?"/my-quested":"/welcome"}>{signedIn?"My Quested":isConfigured()?"Get started":"My Quested"}</Link>;}
