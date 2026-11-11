import {allCollections,allDiscoveries} from "@/lib/catalog";
import CollectionCard from "@/components/collection-card";
export default function Collections(){return <main className="mx-auto max-w-6xl px-5 py-12">
 <p className="text-xs font-black uppercase tracking-[.2em] text-emerald-700">The adventure catalog</p>
 <h1 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">Explore collections</h1>
 <p className="mt-4 max-w-2xl text-slate-600">Curated paths through Oregon, from city viewpoints to volcanic summits. Complete a place once and earn progress across every collection it belongs to.</p>
 <div className="mt-6 text-sm font-semibold text-emerald-900">{allCollections.length} collections · {allDiscoveries.length} unique discoveries</div>
 <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{allCollections.map(c=><CollectionCard key={c.slug} collection={c}/>)}</div>
 </main>;}
