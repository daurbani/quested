import Link from "next/link";
import { allCollections, getCollectionDiscoveries } from "@/lib/catalog";
export default function Home(){return <main className="mx-auto max-w-6xl px-5 py-12">
<section className="relative overflow-hidden rounded-3xl bg-[#163e32] px-7 py-14 text-white md:px-14 md:py-20">
<div aria-hidden className="pointer-events-none absolute -right-20 -bottom-32 h-96 w-96 rounded-full border-[48px] border-white/5"/>
<p className="relative mb-4 text-sm font-bold uppercase tracking-[.2em] text-emerald-200">Your next adventure starts here</p>
<h1 className="relative max-w-2xl text-4xl font-black tracking-tight md:text-6xl">Where to next?</h1>
<p className="relative mt-5 max-w-xl text-lg leading-8 text-emerald-100">Discover remarkable places, complete curated collections, and build your legend.</p>
<Link href="/collections" className="hero-cta relative mt-8">Explore collections <span className="ml-2" aria-hidden>→</span></Link></section>
<section className="py-12"><div className="mb-6 flex flex-wrap items-end justify-between gap-3">
<div><p className="text-sm font-bold uppercase tracking-widest text-emerald-700">Start exploring</p><h2 className="mt-2 text-3xl font-black">Oregon collections</h2></div>
<span className="text-sm text-slate-500">{allCollections.length} collections · {allCollections.reduce((n,c)=>n+getCollectionDiscoveries(c.slug).length,0)} discoveries</span></div>
<div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{allCollections.map(c=><Link key={c.slug} href={`/collections/${c.slug}`} className="group overflow-hidden rounded-2xl border border-emerald-950/10 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
<div className="flex h-28 items-center justify-between bg-gradient-to-br from-emerald-100 to-teal-50 px-7"><span className="text-5xl" aria-hidden>{c.emoji}</span><span className="rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-emerald-900">{getCollectionDiscoveries(c.slug).length} places</span></div>
<div className="p-6"><p className="text-xs font-bold uppercase tracking-widest text-emerald-700">{c.category}</p>
<h3 className="mt-2 text-xl font-bold">{c.name}</h3><p className="mt-3 min-h-16 text-sm leading-6 text-slate-600">{c.description}</p>
<span className="mt-5 inline-block font-semibold text-emerald-800 group-hover:underline">Explore collection →</span></div></Link>)}</div>
<p className="mt-5 text-xs text-slate-500">Starter discovery catalog: destinations and details are being reviewed for the beta.</p></section></main>;}
