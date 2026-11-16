import PublicProfile from "@/components/public-profile";
export default async function PublicProfilePage({params}:{params:Promise<{handle:string}>}){const {handle}=await params;return <main className="mx-auto max-w-3xl px-5 py-12"><PublicProfile handle={handle}/></main>;}
