"use client";
import {useMemo,useState} from "react";
import Link from "next/link";
import type {Discovery} from "@/lib/catalog";
export default function DiscoveryFilter({discoveries}:{discoveries:Discovery[]}){const [query,setQuery]=useState("");const visible=useMemo(()=>discoveries.filter(d=>(d.name+" "+d.region+" "+d.summary).toLowerCase().includes(query.trim().toLowerCase())),[discoveries,query]);return <div>
<label className="mb-4 block"><span className="sr-only">Search discoveries in this collection</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search discoveries..." className="w-full rounded-xl border border-emerald-950/15 bg-white px-4 py-3 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-200"/></label>
<p className="mb-4 text-sm text-slate-500">{visible.length} {visible.length===1?"place":"places"}</p>
<div className="grid gap-3 sm:grid-cols-2">{visible.map(d=><Link key={d.slug} href={`/discoveries/${d.slug}`} className="group flex gap-4 rounded-xl border border-emerald-950/10 bg-white p-5 shadow-sm hover:border-emerald-600 hover:shadow-md"><span aria-hidden className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-sm font-bold text-emerald-800">{discoveries.indexOf(d)+1}</span><div><h3 className="font-bold group-hover:underline">{d.name}</h3><p className="mt-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">{d.region}</p><p className="mt-2 text-sm leading-6 text-slate-600">{d.summary}</p></div></Link>)}</div>
{visible.length===0&&<p className="rounded-xl bg-white p-8 text-center text-slate-600">No discoveries match your search.</p>}
</div>;}
