import Link from "next/link";
import {notFound} from "next/navigation";
import {allCollections,getCollection,getCollectionDiscoveries} from "@/lib/catalog";
import DiscoveryFilter from "@/components/discovery-filter";
import CollectionProgress from "@/components/collection-progress";
import {photoForCollection} from "@/lib/media";
import {PhotoImage,PhotoCredit} from "@/components/photo";
export function generateStaticParams(){return allCollections.map(c=>({slug:c.slug}));}
export default async function CollectionDetail({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const c=getCollection(slug);if(!c)notFound();const list=getCollectionDiscoveries(slug);const photo=photoForCollection(slug);return <main className="mx-auto max-w-5xl px-5 py-12">
<Link href="/collections" className="font-semibold text-emerald-800">← All collections</Link>
<section className="relative isolate mt-7 overflow-hidden rounded-3xl bg-[#163e32] px-7 py-12 text-white md:px-12 md:py-16">{photo&&<div aria-hidden className="absolute inset-0"><PhotoImage photo={photo} width={1400} priority className="h-full w-full object-cover"/></div>}<div aria-hidden className="absolute inset-0 bg-gradient-to-r from-[#092a23]/95 via-[#092a23]/80 to-[#092a23]/30"/><div className="relative"><div className="text-6xl" aria-hidden>{c.emoji}</div><p className="mt-7 text-sm uppercase tracking-widest text-emerald-200">{c.category}</p><h1 className="mt-3 text-4xl font-black">{c.name}</h1><p className="mt-5 max-w-2xl text-lg text-emerald-100">{c.description}</p><p className="mt-6 inline-block rounded-full bg-white/15 px-4 py-2 text-sm font-semibold">{list.length} discoveries</p><CollectionProgress slugs={list.map(d=>d.slug)}/></div>{photo&&<div className="relative mt-5 text-[10px]"><PhotoCredit photo={photo} light/></div>}</section>
<section className="mt-10"><div className="mb-5"><h2 className="text-2xl font-black">Discoveries in this collection</h2><p className="mt-2 text-sm text-slate-600">Each completed place contributes to every collection it belongs to.</p></div><DiscoveryFilter discoveries={list}/></section></main>;}
