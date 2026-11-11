export type Completion={discovery_slug:string;completion_type:"new"|"historical";visited_on:string|null;created_at:string};
export function localToday(){const d=new Date();return [d.getFullYear(),String(d.getMonth()+1).padStart(2,"0"),String(d.getDate()).padStart(2,"0")].join("-");}
export function prettyDate(date:string|null){return date?new Date(date+"T12:00:00").toLocaleDateString(undefined,{month:"short",day:"numeric",year:"numeric"}):"Date not specified";}
