'use client';

import { Button } from '@/components/ui/button';
import { BarChart } from 'lucide-react';
import Link from 'next/link';

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-cyan-950 to-teal-950 text-white">
      <header className="bg-black/40 backdrop-blur-md border-b border-cyan-400/30 p-4 flex items-center justify-between shadow-lg shadow-cyan-500/10">
        <h1 className="text-white font-bold text-xl md:text-2xl">
          Analytics
        </h1>
        <Button asChild variant="outline">
          <Link href="/">Back to Avatar</Link>
        </Button>
      </header>
      <main className="container mx-auto py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <BarChart className="w-16 h-16 mx-auto mb-4 text-cyan-400" />
            <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Analytics Dashboard
            </h2>
            <p className="mt-4 text-lg text-cyan-200/80">
              Visualize your application's data.
            </p>
          </div>
          <div className="bg-slate-900/50 backdrop-blur-sm border-cyan-400/20 border rounded-lg p-8 text-center">
            <p className="text-cyan-100/90">
              Charts and data visualizations will be displayed here.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
