import SignIn from "@/components/sign-in";
export default async function SignInPage({searchParams}:{searchParams:Promise<{next?:string;error?:string}>}){const q=await searchParams;return <main className="mx-auto max-w-lg px-5 py-10 sm:py-16"><section className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
 <p className="text-xs font-bold uppercase tracking-[.17em] text-emerald-700">Join the Quested beta</p>
 <h1 className="mt-3 text-3xl font-black">Start your adventure record</h1>
 <p className="mt-3 leading-7 text-slate-600">Save places you've explored, see your progress across collections, and earn recognition for completing challenges.</p>
 {q.error&&<p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">Sign-in did not finish. Please try again.</p>}
 <SignIn next={q.next??"/welcome"}/>
 </section>
 <p className="mt-5 text-center text-xs leading-5 text-slate-500">Quested is in early beta. Your saved discoveries are private to your account.</p>
 </main>;}
