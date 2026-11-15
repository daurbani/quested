import type {Metadata} from "next";
import Link from "next/link";
import {allDiscoveries,allCollections} from "@/lib/catalog";
import GlobalDiscoverySearch from "@/components/global-discovery-search";
export const metadata:Metadata={title:"Search Discoveries | Quested",description:"Search every Quested adventure by name, region, activity, or collection."};
export default function DiscoveriesPage(){
 return <main className="mx-auto max-w-6xl px-4 py-10 sm:px-5">
  <p className="text-xs font-black uppercase tracking-[.2em] text-emerald-700">Find your next adventure</p>
  <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">Discover places</h1>
  <p className="mt-4 max-w-2xl text-slate-600">Explore {allDiscoveries.length} unique places across {allCollections.length} collections. Search for a destination, region, activity, or collection — no sign-in required.</p>
  <GlobalDiscoverySearch/>
  <p className="mt-8 text-sm text-slate-600">Prefer to browse? <Link href="/collections" className="font-bold text-emerald-800 underline">Explore collections</Link> or <Link href="/map" className="font-bold text-emerald-800 underline">view the map</Link>.</p>
 </main>;
}
