import {createServerClient} from "@supabase/ssr";
import {NextResponse,type NextRequest} from "next/server";
export async function GET(request:NextRequest){
 const url=new URL(request.url),requested=url.searchParams.get("next")??"/my-quested";
 const next=requested.startsWith("/")&&!requested.startsWith("//")&&!requested.startsWith("/\\")?requested:"/my-quested";
 const code=url.searchParams.get("code"),supabaseUrl=process.env.NEXT_PUBLIC_SUPABASE_URL,key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
 if(!code||!supabaseUrl||!key)return NextResponse.redirect(new URL("/sign-in?error=callback",url.origin));
 const response=NextResponse.redirect(new URL(next,url.origin));
 const sb=createServerClient(supabaseUrl,key,{cookies:{getAll(){return request.cookies.getAll()},setAll(items){items.forEach(({name,value,options})=>{request.cookies.set(name,value);response.cookies.set(name,value,options)})}}});
 const {error}=await sb.auth.exchangeCodeForSession(code);
 if(error)return NextResponse.redirect(new URL("/sign-in?error=callback",url.origin));
 return response;
}
