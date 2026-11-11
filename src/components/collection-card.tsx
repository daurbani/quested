import Link from "next/link";
import type {Collection} from "@/lib/catalog";
import {getCollectionDiscoveries} from "@/lib/catalog";
import {photoForCollection} from "@/lib/media";
import {PhotoImage} from "@/components/photo";
export default function CollectionCard({collection}:{collection:Collection}){
 const photo=photoForCollection(collection.slug);
 const count=getCollectionDiscoveries(collection.slug).length;
 return <article className="group overflow-hidden rounded-[1.5rem] border border-emerald-950/10 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-xl">
 <Link href={`/collections/${collection.slug}`} className="block" aria-label={`Explore ${collection.name} collection`}>
  <div className="relative h-48 overflow-hidden bg-gradient-to-br from-[#163e32] to-[#47775e] sm:h-52">
   {photo?<PhotoImage photo={photo} width={960} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"/>:<span aria-hidden className="absolute inset-0 flex items-center justify-center text-6xl">{collection.emoji}</span>}
   <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent"/>
   <span className="absolute left-5 top-5 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-[#163e32]">{count} discoveries</span>
   <span aria-hidden className="absolute bottom-4 left-5 text-4xl drop-shadow-lg">{collection.emoji}</span>
  </div>
  <div className="p-6">
   <p className="text-xs font-bold uppercase tracking-[.16em] text-emerald-700">{collection.category}</p>
   <h3 className="mt-2 text-xl font-black tracking-tight group-hover:text-emerald-800">{collection.name}</h3>
   <p className="mt-3 min-h-18 text-sm leading-6 text-slate-600">{collection.description}</p>
   <span className="mt-5 inline-block font-bold text-emerald-800">Explore collection <span aria-hidden>→</span></span>
  </div>
 </Link>
 </article>;
}
