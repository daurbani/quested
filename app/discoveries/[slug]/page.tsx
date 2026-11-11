import Link from "next/link";
import {notFound} from "next/navigation";
import {allDiscoveries,getDiscovery,getDiscoveryCollections} from "@/lib/catalog";
import {getDiscoveryDetail} from "@/lib/discovery-details";
import CompletionControls from "@/components/completion-controls";
export function generateStaticParams(){return allDiscoveries.map(d=>({slug:d.slug}));}
export default async function DiscoveryDetailPage({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params;
 const d=getDiscovery(slug);if(!d)notFound();
 const related=getDiscoveryCollections(slug);
 const detail=getDiscoveryDetail(slug);
 return <main className="mx-auto max-w-5xl px-5 py-12">
  <Link href="/collections" className="text-sm font-semibold text-emerald-800 hover:underline">← Explore collections</Link>
  <section className="relative mt-7 overflow-hidden rounded-3xl bg-gradient-to-br from-[#163e32] via-[#276d58] to-[#3c8063] px-7 py-14 text-white md:px-12 md:py-20">
   <div aria-hidden className="pointer-events-none absolute -bottom-40 -right-24 h-96 w-96 rounded-full border-[55px] border-white/5"/>
   <p className="relative text-sm font-bold uppercase tracking-[.16em] text-emerald-200">{detail?.eyebrow??d.region}</p>
   <h1 className="relative mt-4 max-w-3xl text-4xl font-black tracking-tight md:text-6xl">{d.name}</h1>
   <p className="relative mt-5 max-w-2xl text-lg leading-8 text-emerald-50">{detail?.description??d.summary}</p>
   <div className="relative mt-6 flex flex-wrap gap-2">
    <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold">{d.region}</span>
    {(detail?.activities??[]).map(activity=><span key={activity} className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold">{activity}</span>)}
   </div>
  </section>
  <div className="mt-8 grid gap-7 md:grid-cols-[minmax(0,1fr)_310px]">
   <div className="space-y-6">
    <CompletionControls slug={slug} collections={related}/>
    <section className="rounded-2xl bg-white p-7 shadow-sm">
     <div className="flex flex-wrap items-center justify-between gap-2"><h2 className="text-2xl font-black">Discover the place</h2>{detail&&<span className="text-xs font-semibold text-emerald-800">Reviewed editorial profile</span>}</div>
     <p className="mt-4 leading-8 text-slate-700">{detail?.description??d.summary}</p>
     {detail?.highlights&&<><h3 className="mt-7 font-bold">What makes it special</h3><ul className="mt-3 space-y-2">{detail.highlights.map(h=><li key={h} className="flex gap-2 text-sm leading-6 text-slate-700"><span aria-hidden className="text-emerald-700">✦</span>{h}</li>)}</ul></>}
    </section>
    <section className="rounded-2xl bg-white p-7 shadow-sm"><h2 className="text-xl font-black">Plan your visit</h2>
     <p className="mt-3 leading-7 text-slate-700">{detail?.whatToKnow??"Destination details are still being researched. Check official local resources for conditions, access and any permit requirements."}</p>
     {detail?.officialUrl&&<a href={detail.officialUrl} target="_blank" rel="noopener noreferrer" className="mt-5 inline-block font-semibold text-emerald-800 hover:underline">Read the official guidance ↗</a>}
     <p className="mt-4 text-xs leading-5 text-slate-500">Information is a planning starting point, not live conditions or route guidance. Always check current access, weather, safety and permit information.</p>
    </section>
   </div>
   <aside className="space-y-5">
    <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
     <p className="text-xs font-bold uppercase tracking-widest text-emerald-800">One discovery, many collections</p>
     <h2 className="mt-2 text-2xl font-black text-emerald-950">{related.length} {related.length===1?"collection":"collections"}</h2>
     <p className="mt-2 text-sm leading-6 text-emerald-900">Record this place once. Its completion counts automatically in every collection below—no joining required.</p>
    </section>
    <section className="rounded-2xl bg-white p-6 shadow-sm">
     <h2 className="text-lg font-black">Collections this advances</h2>
     <div className="mt-4 flex flex-col gap-3">{related.map(c=><Link key={c.slug} href={`/collections/${c.slug}`} className="rounded-xl border border-emerald-950/10 p-4 hover:border-emerald-700"><span aria-hidden>{c.emoji}</span> <span className="font-bold">{c.name}</span><span className="mt-2 block text-xs text-slate-500">{c.discoverySlugs.length} places</span><span className="mt-2 block text-sm font-semibold text-emerald-800">Explore collection →</span></Link>)}</div>
    </section>
    {detail&&<p className="px-2 text-xs leading-5 text-slate-500">Destination information drawn from {detail.sourceName}. Access details can change.</p>}
   </aside>
  </div>
 </main>;
}