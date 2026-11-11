import Link from "next/link";
import {allCollections,getCollectionDiscoveries} from "@/lib/catalog";
export default function Collections(){return <main className="mx-auto max-w-6xl px-5 py-12">
<p className="text-sm font-bold uppercase tracking-widest text-emerald-700">The catalog</p><h1 className="mt-3 text-4xl font-black">Explore collections</h1><p className="mt-4 max-w-2xl text-slate-600">Curated destinations across Oregon. Pick a collection and find your next place to explore.</p>
<div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{allCollections.map(c=><Link href={`/collections/${c.slug}`} key={c.slug} className="group overflow-hidden rounded-2xl border border-emerald-950/10 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
<div className="flex h-24 items-center justify-between bg-gradient-to-br from-emerald-100 to-teal-50 px-7"><span className="text-5xl" aria-hidden>{c.emoji}</span><span className="text-xs font-bold text-emerald-800">{getCollectionDiscoveries(c.slug).length} discoveries</span></div>
<div className="p-7"><p className="text-xs font-bold uppercase tracking-widest text-emerald-700">{c.category}</p><h2 className="mt-2 text-xl font-bold">{c.name}</h2><p className="mt-3 text-sm leading-6 text-slate-600">{c.description}</p><p className="mt-5 font-semibold text-emerald-800 group-hover:underline">View collection →</p></div></Link>)}</div>
</main>;}
