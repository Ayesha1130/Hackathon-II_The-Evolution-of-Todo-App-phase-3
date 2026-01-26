'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      router.push('/tasks')
    }
  }, [router])

  return (
    <main className="min-h-screen bg-[#f8faf9]">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-emerald-50">
        <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
          <div className="text-2xl font-bold text-emerald-600 flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white shadow-md italic">T</div>
            <span className="tracking-tight text-slate-800">TaskFlow</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/login" className="text-slate-600 hover:text-emerald-600 font-medium transition-colors">Sign In</Link>
            <Link href="/signup" className="px-6 py-2.5 bg-emerald-500 text-white rounded-full hover:bg-emerald-600 shadow-lg shadow-emerald-200 transition-all font-semibold text-sm">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 mb-8">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">New: Smart Hashing v2.0</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-6 tracking-tight">
            Work Smarter, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-emerald-400 to-green-500">
              Live Better
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed italic">
            "The secret of getting ahead is getting started." 
            Organize your daily workflow with our light-green minty interface.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-16">
            <Link href="/signup" className="px-10 py-4 bg-emerald-500 text-white rounded-full text-lg font-bold hover:bg-emerald-600 hover:scale-105 transition-all shadow-xl shadow-emerald-100">
              Create Your First Task
            </Link>
          </div>

          {/* Abstract Shape for Decoration */}
          <div className="relative max-w-4xl mx-auto h-40 bg-gradient-to-b from-emerald-50/50 to-transparent rounded-t-[3rem] border-t border-x border-emerald-100/50">
             <p className="pt-10 text-emerald-300 font-mono text-sm uppercase tracking-[0.5em]">Dashboard Preview Coming Soon</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Why TaskFlow?</h2>
            <div className="w-20 h-1.5 bg-emerald-500 mx-auto rounded-full"></div>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            <FeatureCard title="Minty Fresh UI" desc="A calming light-green theme designed to keep you focused and stress-free." icon="🌱" />
            <FeatureCard title="Neon Backend" desc="Powered by Neon PostgreSQL for lightning fast data retrieval and safety." icon="⚡" />
            <FeatureCard title="Priority Tags" desc="Mark what's urgent and what can wait with simple, color-coded priorities." icon="🏷️" />
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-gradient-to-b from-white to-emerald-50 border-t border-emerald-100 pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2">
              <div className="text-2xl font-bold text-emerald-700 mb-5 flex items-center gap-2">
                <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white shadow-sm italic">T</div>
                TaskFlow
              </div>
              <p className="text-emerald-800/70 max-w-sm mb-6 leading-relaxed">
                Making productivity beautiful and simple. Built for hackers, students, and professionals who love clean, minty-fresh design.
              </p>
              <div className="flex gap-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 hover:bg-emerald-200 transition-colors cursor-pointer">
                    •
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-emerald-900 mb-5">Product</h4>
              <ul className="space-y-3 text-emerald-700/80 text-sm">
                <li><Link href="/signup" className="hover:text-emerald-900 transition-colors">Features</Link></li>
                <li><Link href="/login" className="hover:text-emerald-900 transition-colors">Integrations</Link></li>
                <li><a href="#" className="hover:text-emerald-900 transition-colors">Pricing</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-emerald-900 mb-5">Company</h4>
              <ul className="space-y-3 text-emerald-700/80 text-sm">
                <li><a href="#" className="hover:text-emerald-900 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-emerald-900 transition-colors">Github</a></li>
                <li><a href="#" className="hover:text-emerald-900 transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-emerald-200/50 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-emerald-700/60 text-sm font-medium italic">© 2026 TaskFlow. Stay Fresh, Stay Productive.</p>
            <div className="flex gap-8 text-emerald-700/60 text-sm font-medium">
              <a href="#" className="hover:text-emerald-900 transition-all">Twitter</a>
              <a href="#" className="hover:text-emerald-900 transition-all">LinkedIn</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

// FeatureCard ko Home function ke bahar rakhein
function FeatureCard({ title, desc, icon }: { title: string, desc: string, icon: string }) {
  return (
    <div className="group p-8 bg-[#fcfdfc] rounded-3xl border border-emerald-50 hover:border-emerald-200 hover:bg-white hover:shadow-2xl hover:shadow-emerald-100 transition-all duration-300">
      <div className="text-4xl mb-6 group-hover:scale-110 transition-transform duration-300">{icon}</div>
      <h3 className="text-xl font-bold mb-3 text-slate-800">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
    </div>
  )
}