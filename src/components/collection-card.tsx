import Link from "next/link";
import type {Collection} from "@/lib/catalog";
import {getCollectionDiscoveries} from "@/lib/catalog";
import {photoForCollection} from "@/lib/media";
import {PhotoImage} from "@/components/photo";
type CardProgress={completed:number;total:number};
export default function CollectionCard({collection,variant="standard",progress}:{collection:Collection;variant?:"standard"|"compact";progress?:CardProgress}){
 const photo=photoForCollection(collection.slug);
 const count=getCollectionDiscoveries(collection.slug).length;
 const compact=variant==="compact";
 const pct=progress&&progress.total?Math.round(progress.completed/progress.total*100):0;
 const mastered=Boolean(progress&&progress.total>0&&progress.completed===progress.total);
 return <article className="group flex flex-col overflow-hidden rounded-2xl border border-emerald-950/10 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
  <Link href={`/collections/${collection.slug}`} className="flex h-full flex-col" aria-label={`Explore ${collection.name} collection`}>
   <div className={`relative overflow-hidden bg-gradient-to-br from-[#163e32] to-[#47775e] ${compact?"h-40":"h-48 sm:h-52"}`}>
    {photo?<PhotoImage photo={photo} width={960} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"/>:<span aria-hidden className="absolute inset-0 flex items-center justify-center text-6xl">{collection.emoji}</span>}
    <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent"/>
    <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-black text-[#163e32]">{count} discoveries</span>
    {mastered?<span className="absolute right-3 top-4 rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-950">🏆 MASTERED</span>:Boolean(progress&&progress.completed>0)&&<span className="absolute right-3 top-4 rounded-full bg-emerald-800 px-3 py-1 text-xs font-bold text-white">IN PROGRESS</span>}
   </div>
   <div className={`flex flex-1 flex-col ${compact?"p-5":"p-6"}`}>
    <p className="text-[11px] font-black uppercase tracking-[.13em] text-emerald-700">{collection.category}</p>
    <h3 className="mt-1.5 text-lg font-black tracking-tight group-hover:text-emerald-800">{collection.name}</h3>
    <p className={`mt-2 flex-1 text-sm leading-6 text-slate-600 ${compact?"line-clamp-2":"min-h-18"}`}>{collection.description}</p>
    {progress?<div className="mt-4">
      <div role="progressbar" aria-label={collection.name+" progress"} aria-valuemin={0} aria-valuemax={progress.total} aria-valuenow={progress.completed} className="h-2 overflow-hidden rounded-full bg-slate-200"><div className={`h-full rounded-full ${mastered?"bg-amber-500":"bg-emerald-700"}`} style={{width:pct+"%"}}/></div>
      <p className="mt-2 text-xs font-semibold text-slate-600">{mastered?"🏆 Mastered":`${pct}% · ${progress.completed} of ${progress.total} completed`}</p>
     </div>:<span className="mt-4 text-sm font-bold text-emerald-800 group-hover:underline">Explore collection →</span>}
   </div>
  </Link>
 </article>;
}
