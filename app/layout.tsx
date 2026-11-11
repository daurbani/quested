import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
export const metadata: Metadata = { title: "Quested — Discover places. Complete collections.", description: "Discover places. Complete collections. Build your legend." };
export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) { return <html lang="en"><body><header className="border-b border-emerald-900/10 bg-white"><nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5"><Link href="/" className="text-2xl font-black tracking-tight">✦ Quested</Link><div className="flex gap-5 text-sm font-semibold"><Link href="/">Explore</Link><Link href="/collections">Collections</Link></div></nav></header>{children}<footer className="mx-auto max-w-6xl px-5 py-10 text-sm text-slate-500">Quested · Discover places. Complete collections. Build your legend.</footer></body></html>; }
