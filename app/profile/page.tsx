import ProfileSettings from "@/components/profile-settings";
export const metadata={title:"Your profile | Quested"};
export default function ProfilePage(){return <main className="mx-auto max-w-3xl px-5 py-12"><p className="text-xs font-black uppercase tracking-widest text-emerald-700">Your identity</p><h1 className="mt-3 text-4xl font-black">Your profile</h1><p className="mt-3 mb-8 text-slate-600">Set how your name will appear when you share collections.</p><ProfileSettings/></main>;}
