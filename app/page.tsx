import Link from "next/link";
import {allCollections,allDiscoveries} from "@/lib/catalog";
import CollectionCard from "@/components/collection-card";
import {photoForCollection} from "@/lib/media";
import {PhotoImage,PhotoCredit} from "@/components/photo";
export default function Home(){
 const photo=photoForCollection("portland-explorer");
 return <main className="mx-auto max-w-6xl px-5 py-10 md:py-12">
  <section className="relative isolate overflow-hidden rounded-[2rem] bg-[#163e32] text-white">
   {photo&&<div aria-hidden className="absolute inset-0"><PhotoImage photo={photo} width={1600} className="h-full w-full object-cover"/></div>}
   <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-[#092a23]/95 via-[#092a23]/80 to-[#092a23]/25"/>
   <div className="relative px-7 pb-24 pt-20 md:px-14 md:pb-32 md:pt-28">
    <p className="text-xs font-bold uppercase tracking-[.24em] text-emerald-100">Your next adventure starts here</p>
    <h1 className="mt-5 max-w-2xl text-5xl font-black leading-[1.05] tracking-tight md:text-7xl">Go places.<br/>Collect stories.</h1>
    <p className="mt-6 max-w-xl text-lg leading-8 text-emerald-50">Discover remarkable places, complete curated collections, and watch one adventure advance multiple goals.</p>
    <div className="mt-9 flex flex-wrap gap-3">
     <Link href="/collections" className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 font-black text-[#163e32] hover:bg-emerald-100">Explore collections <span className="ml-2" aria-hidden>→</span></Link>
     <Link href="/my-quested" className="inline-flex items-center justify-center rounded-full border border-white/60 px-6 py-3 font-bold text-white hover:bg-white/10">My Quested</Link>
    </div>
   </div>
   {photo&&<div className="absolute bottom-4 right-5 text-[10px]"><PhotoCredit photo={photo} light/></div>}
  </section>
  <section className="pt-14 pb-10">
   <div className="mb-8 flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-[.2em] text-emerald-700">Choose your next chapter</p><h2 className="mt-2 text-3xl font-black tracking-tight md:text-4xl">Explore Oregon</h2><p className="mt-3 max-w-xl text-slate-600">From neighborhood trails to rugged volcanic summits, find a challenge that feels like yours.</p></div><p className="text-sm text-slate-600">{allCollections.length} collections · {allDiscoveries.length} unique discoveries</p></div>
   <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{allCollections.map(c=><CollectionCard collection={c} key={c.slug}/>)}</div>
   <p className="mt-7 text-xs text-slate-500">Our beta catalog is expanding. Every place counts once in your history, even when it belongs to more than one collection.</p>
  </section>
 </main>;
}
