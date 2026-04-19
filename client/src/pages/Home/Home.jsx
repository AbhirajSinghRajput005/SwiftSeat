import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Bus, ShieldCheck, Zap, Clock, Star, Users, Map as MapIcon, ChevronRight } from 'lucide-react'
import SearchForm from '../../components/SearchForm/SearchForm'
import { busService } from '../../services/busService'
import { formatCurrency } from '../../utils/helpers'

export default function Home() {
  const [popularRoutes, setPopularRoutes] = useState([
    { from: 'Hyderabad', to: 'Bangalore', price: 850, duration: '7h 30m' },
    { from: 'Mumbai', to: 'Pune', price: 350, duration: '3h 30m' },
    { from: 'Delhi', to: 'Jaipur', price: 550, duration: '5h 30m' },
    { from: 'Bangalore', to: 'Chennai', price: 750, duration: '6h 00m' },
    { from: 'Chennai', to: 'Hyderabad', price: 900, duration: '9h 00m' },
    { from: 'Mumbai', to: 'Goa', price: 1200, duration: '10h 00m' },
  ])

  const stats = [
    { label: 'Happy Travelers', value: '2M+', icon: Users },
    { label: 'Bus Operators', value: '500+', icon: Bus },
    { label: 'Routes Covered', value: '10K+', icon: MapIcon },
    { label: 'Average Rating', value: '4.8/5', icon: Star },
  ]

  const features = [
    { 
      title: 'Lightning Fast', 
      desc: 'Book your bus tickets in under 30 seconds with our optimized flow.',
      icon: Zap,
      color: 'bg-yellow-100 text-yellow-600'
    },
    { 
      title: 'Secure Payments', 
      desc: '100% secure payment gateway with multiple payment options.',
      icon: ShieldCheck,
      color: 'bg-green-100 text-green-600'
    },
    { 
      title: '24/7 Support', 
      desc: 'Our dedicated support team is always ready to help you on your journey.',
      icon: Clock,
      color: 'bg-blue-100 text-blue-600'
    }
  ]

  return (
    <div className="animate-fade-in font-body">
      {/* Hero Section - Premium Image Background */}
      <section className="relative pt-40 pb-64 overflow-hidden min-h-[90vh] flex items-center">
        {/* Background Image with Overlays */}
        <div className="absolute inset-0 -z-10">
          <img 
            src="/hero-bus.jpg" 
            alt="Premium SwiftSeat Bus" 
            className="w-full h-full object-cover scale-105 animate-float opacity-90"
            style={{ animationDuration: '20s' }}
          />
          {/* Multi-layered Overlays for Premium Feel */}
          <div className="absolute inset-0 bg-gradient-to-b from-navy-charcoal/40 via-transparent to-white"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-white/40 via-transparent to-transparent"></div>
          
          {/* Subtle Grainy Texture */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] mix-blend-overlay"></div>
        </div>

        <div className="section-container text-center relative z-10">
          <div className="max-w-4xl mx-auto mb-16">
            <span className="subheader mb-6 inline-block animate-fade-in-up bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/30 text-navy-charcoal shadow-sm">
              The Gold Standard of Bus Travel
            </span>
            <h1 className="text-6xl md:text-[92px] font-black text-navy-charcoal leading-[0.95] mb-10 animate-fade-in-up tracking-tighter drop-shadow-sm">
              Your Next Journey <br /> Starts <span className="text-gradient">Swiftly</span>
            </h1>
            <p className="text-xl md:text-3xl text-navy-charcoal/80 font-bold animate-fade-in-up stagger-1 max-w-2xl mx-auto leading-relaxed">
              Experience India's most refined bus booking platform. <br className="hidden md:block" /> Fast, reliable, and remarkably premium.
            </p>
          </div>

          {/* Floating Search Card - High Contrast Glass */}
          <div className="relative z-30 animate-fade-in-up stagger-2 max-w-5xl mx-auto shadow-2xl">
            <SearchForm />
          </div>
        </div>
      </section>

      {/* Stats Counter Bar - Enhanced Floating */}
      <section className="relative -mt-32 z-40">
        <div className="section-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="glass !bg-white/80 p-10 rounded-[40px] flex flex-col items-center text-center hover:scale-[1.05] hover:-translate-y-2 transition-all duration-500 group animate-fade-in-up shadow-premium" style={{ animationDelay: `${0.4 + idx * 0.1}s` }}>
                <div className="w-16 h-16 bg-white shadow-soft rounded-2xl flex items-center justify-center text-navy-charcoal mb-5 group-hover:bg-brand-500 group-hover:text-white group-hover:rotate-6 transition-all duration-300">
                  <stat.icon className="w-8 h-8" />
                </div>
                <h3 className="text-4xl font-black text-navy-charcoal mb-1 tracking-tighter">{stat.value}</h3>
                <p className="subheader !text-[11px]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Routes - Stripe Style */}
      <section className="py-40 bg-white">
        <div className="section-container">
          <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-4">
            <div className="text-left">
              <span className="subheader mb-3 block">Curated Journeys</span>
              <h2 className="text-5xl md:text-6xl font-black text-navy-charcoal tracking-tight">Popular Routes</h2>
            </div>
            <Link to="/search" className="flex items-center gap-3 text-brand-500 font-black hover:gap-4 transition-all group text-lg">
              Explore All Routes <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {popularRoutes.map((route, idx) => (
              <Link 
                key={idx} 
                to={`/search?from=${route.from}&to=${route.to}&date=${new Date().toISOString().split('T')[0]}`}
                className="group card-hover p-10 bg-white relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-40 h-40 bg-brand-50/50 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-brand-100 transition-colors"></div>
                
                <div className="flex justify-between items-start mb-10 relative z-10">
                  <div>
                    <p className="subheader mb-3">Starting from</p>
                    <div className="flex items-center gap-4">
                      <span className="font-black text-3xl text-navy-charcoal tracking-tighter">{route.from}</span>
                      <ArrowRightLeft className="w-6 h-6 text-surface-300 group-hover:text-brand-500 transition-colors icon-brand" />
                      <span className="font-black text-3xl text-navy-charcoal tracking-tighter">{route.to}</span>
                    </div>
                  </div>
                  <div className="bg-brand-50 px-5 py-2.5 rounded-2xl shadow-sm">
                    <span className="text-brand-500 font-black text-xl">{formatCurrency(route.price)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between relative z-10 pt-6 border-t border-surface-100">
                  <span className="flex items-center gap-2 text-surface-500 font-bold">
                    <Clock className="w-5 h-5" /> {route.duration}
                  </span>
                  <span className="text-navy-charcoal font-black flex items-center gap-1 opacity-0 group-hover:opacity-100 group-hover:text-brand-500 transition-all transform group-hover:translate-x-0 -translate-x-4">
                    Book Journey <ChevronRight className="w-5 h-5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - Modern Minimal */}
      <section className="py-40 bg-surface-50 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-surface-200 to-transparent"></div>
        
        <div className="section-container relative z-10">
          <div className="text-center mb-24">
            <span className="subheader mb-4 inline-block">SwiftSeat Excellence</span>
            <h2 className="text-5xl md:text-6xl font-black text-navy-charcoal tracking-tight">Why Choose Us?</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-20">
            {features.map((feature, idx) => (
              <div key={idx} className="flex flex-col items-center text-center group">
                <div className={`w-28 h-28 ${feature.color.split(' ')[0]} rounded-[40px] flex items-center justify-center mb-10 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-premium`}>
                  <feature.icon className={`w-12 h-12 ${feature.color.split(' ')[1]}`} />
                </div>
                <h3 className="text-3xl font-black text-navy-charcoal mb-5 tracking-tight">{feature.title}</h3>
                <p className="text-surface-600 text-xl leading-relaxed font-medium">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Ultra Premium */}
      <section className="py-40 bg-white">
        <div className="section-container">
          <div className="bg-navy-charcoal rounded-[80px] p-20 md:p-40 relative overflow-hidden flex flex-col items-center text-center text-white shadow-elevated">
            {/* High-end Glowing Overlays */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-500/10 rounded-full blur-[150px] -mr-96 -mt-96"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent-500/10 rounded-full blur-[120px] -ml-64 -mb-64 animate-pulse-soft"></div>
            
            <span className="subheader text-brand-400 mb-10 relative z-10">Join the Elite Club</span>
            <h2 className="text-5xl md:text-[100px] font-black mb-12 relative z-10 leading-[0.9] tracking-tighter">
              Ready to travel <br /> in style?
            </h2>
            <p className="text-white/60 text-2xl md:text-3xl mb-16 max-w-3xl relative z-10 font-medium leading-relaxed">
              Experience the future of bus travel. <br /> Secure your seat on a SwiftSeat journey today.
            </p>
            <div className="flex flex-col sm:flex-row gap-8 relative z-10 w-full justify-center items-center">
              <Link to="/register" className="btn-primary text-xl px-16 py-6 rounded-full w-full sm:w-auto shadow-2xl">
                Create Free Account
              </Link>
              <Link to="/search" className="bg-white/10 hover:bg-white/20 backdrop-blur-xl text-white font-black px-16 py-6 rounded-full text-xl transition-all active:scale-95 border border-white/20 w-full sm:w-auto">
                Browse Routes
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function ArrowRightLeft({ className }) {
  return (
    <svg 
      className={className} 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="3" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M16 3L21 8L16 13" />
      <path d="M21 8H3" />
      <path d="M8 21L3 16L8 11" />
      <path d="M3 16H21" />
    </svg>
  )
}


