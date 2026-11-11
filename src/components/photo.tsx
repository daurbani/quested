import {commonsImageUrl,type MediaCredit} from "@/lib/media";
export function PhotoImage({photo,className="",width=1280}:{photo:MediaCredit;className?:string;width?:number}){
 return <img src={commonsImageUrl(photo,width)} alt={photo.alt} loading="lazy" decoding="async" referrerPolicy="no-referrer" className={className} style={{objectPosition:photo.position??"center"}}/>;
}
export function PhotoCredit({photo,light=false}:{photo:MediaCredit;light?:boolean}){
 return <span className={light?"text-white/80":"text-slate-500"}>
  Photo: <a href={photo.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:opacity-80">{photo.credit}</a>
  {" · "}<a href={photo.licenseUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:opacity-80">{photo.license}</a>
 </span>;
}
