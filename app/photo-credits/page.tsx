import Link from "next/link";
import {photos} from "@/lib/media";
export const metadata={title:"Photo credits · Quested",description:"Photo sources, creators, and reuse licenses for Quested imagery."};
export default function PhotoCredits(){
 return <main className="mx-auto max-w-3xl px-5 py-12">
  <Link href="/" className="text-sm font-semibold text-emerald-800 hover:underline">← Back to Quested</Link>
  <h1 className="mt-8 text-4xl font-black">Photo credits</h1>
  <p className="mt-4 text-slate-600">Quested uses photography from Wikimedia Commons. We appreciate the creators who make their work available for reuse. Photos may be cropped to fit the design.</p>
  <div className="mt-8 divide-y divide-slate-200 rounded-2xl bg-white px-6">
   {Object.entries(photos).map(([slug,photo])=><section className="py-5" key={slug}>
    <h2 className="font-bold">{photo.alt}</h2>
    <p className="mt-1 text-sm text-slate-600">By {photo.credit} · <a href={photo.licenseUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-emerald-800 underline">{photo.license}</a></p>
    <a href={photo.sourceUrl} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-sm font-semibold text-emerald-800 hover:underline">View original image and license details ↗</a>
   </section>)}
  </div>
 </main>;
}
