import Link from "next/link";
import {allCollections,allDiscoveries} from "@/lib/catalog";
import {photoForCollection} from "@/lib/media";
import {PhotoImage} from "@/components/photo";
import HomeExperience from "@/components/home-experience";

export default function Home(){
 const photo=photoForCollection("oregon-volcanoes");
 return <main className="mx-auto max-w-6xl px-4 pb-12 pt-5 sm:px-5 md:pt-7">
  <section className="grid overflow-hidden rounded-[1.75rem] bg-[#123a2f] text-white shadow-sm lg:grid-cols-[1.04fr_0.96fr]">
   <div className="relative flex flex-col justify-center px-6 py-9 sm:px-9 lg:min-h-[330px] lg:px-11 lg:py-9">
    <div aria-hidden className="pointer-events-none absolute -left-20 -top-32 h-64 w-64 rounded-full border-[32px] border-white/5"/>
    <div className="relative">
     <p className="text-[11px] font-black uppercase tracking-[.23em] text-emerald-200">Your next adventure starts here</p>
     <h1 className="mt-3 text-4xl font-black leading-[1.04] tracking-tight sm:text-5xl">Go places.<br/>Collect stories.</h1>
     <p className="mt-4 max-w-lg text-sm leading-6 text-emerald-50 sm:text-base">Discover places that inspire you, save adventures for later, and celebrate every journey you complete.</p>
     <div className="mt-6 flex flex-wrap gap-3">
      <Link href="/map" className="hero-cta text-sm">Explore the map <span aria-hidden className="ml-2">→</span></Link>
      <Link href="/collections" className="inline-flex items-center justify-center rounded-full border border-white/60 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10">Browse collections</Link>
     </div>
     <div className="mt-6 flex flex-wrap gap-x-7 gap-y-2 border-t border-white/20 pt-4 text-sm text-emerald-50">
      <span><strong className="text-lg font-black text-white">{allCollections.length}</strong> collections</span>
      <span><strong className="text-lg font-black text-white">{allDiscoveries.length}</strong> unique discoveries</span>
      <span className="hidden sm:inline">✦ Oregon adventures</span>
     </div>
    </div>
   </div>
   <div className="relative h-44 overflow-hidden bg-[#276d58] sm:h-56 lg:h-full lg:min-h-[330px]">
    {photo&&<PhotoImage photo={photo} width={1200} priority className="absolute inset-0 h-full w-full object-cover"/>}
    <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#092a23]/35 to-transparent lg:bg-gradient-to-r lg:from-[#123a2f]/25 lg:to-transparent"/>
    <div className="absolute bottom-4 right-4 rounded-full bg-[#092a23]/80 px-3 py-1.5 text-xs font-semibold text-white">⌖ Mount Hood, Oregon</div>
   </div>
  </section>
  <HomeExperience/>
 </main>;
}
