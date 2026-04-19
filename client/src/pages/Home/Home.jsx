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
    <div className="animate-fade-in">
      {/* Hero Section - Design B Style */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        {/* Warm Geometric Background */}
        <div className="absolute inset-0 -z-10 bg-[#FFF9F8]">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-brand-50 to-transparent rounded-l-[100px] opacity-60"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-100/40 rounded-full blur-3xl"></div>
          <div className="absolute top-20 right-20 w-32 h-32 bg-accent-100/40 rounded-full blur-2xl"></div>
          
          {/* Abstract Shapes */}
          <div className="absolute top-1/4 right-1/4 w-12 h-12 border-4 border-brand-200 rounded-lg rotate-12 opacity-40"></div>
          <div className="absolute bottom-1/4 left-1/3 w-8 h-8 bg-brand-200/50 rounded-full opacity-40"></div>
        </div>

        <div className="section-container text-center">
          <div className="max-w-3xl mx-auto mb-12">
            <h1 className="text-4xl md:text-6xl font-extrabold text-surface-900 leading-tight mb-6 animate-fade-in-up">
              Your Next Journey Starts <span className="text-brand-500">Swiftly</span>
            </h1>
            <p className="text-lg md:text-xl text-surface-600 font-medium animate-fade-in-up stagger-1">
              India's premium bus booking platform with real-time tracking, 
              verified operators, and instant confirmations.
            </p>
          </div>

          <div className="animate-fade-in-up stagger-2">
            <SearchForm />
          </div>
        </div>
      </section>

      {/* Stats Counter Bar */}
      <section className="relative -mt-12 z-20">
        <div className="section-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl shadow-card border border-surface-100 flex flex-col items-center text-center hover-lift transition-all animate-fade-in-up" style={{ animationDelay: `${0.3 + idx * 0.1}s` }}>
                <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center text-brand-500 mb-3">
                  <stat.icon className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-surface-900">{stat.value}</h3>
                <p className="text-sm text-surface-500 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Routes */}
      <section className="py-24 bg-white">
        <div className="section-container">
          <div className="flex items-end justify-between mb-12">
            <div className="text-left">
              <h2 className="text-3xl font-bold text-surface-900 mb-2">Popular Routes</h2>
              <p className="text-surface-600">Top destinations travelers are exploring right now</p>
            </div>
            <Link to="/search" className="hidden md:flex items-center gap-1 text-brand-500 font-bold hover:gap-2 transition-all">
              View All Routes <ChevronRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularRoutes.map((route, idx) => (
              <Link 
                key={idx} 
                to={`/search?from=${route.from}&to=${route.to}&date=${new Date().toISOString().split('T')[0]}`}
                className="group card-hover p-6 border-b-4 border-b-transparent hover:border-b-brand-500"
              >
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-lg text-surface-900">{route.from}</span>
                    <ArrowRightLeft className="w-4 h-4 text-surface-400" />
                    <span className="font-bold text-lg text-surface-900">{route.to}</span>
                  </div>
                  <span className="text-brand-500 font-bold">{formatCurrency(route.price)}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-surface-500">
                  <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {route.duration}</span>
                  <span className="group-hover:text-brand-500 transition-colors font-semibold flex items-center gap-1">
                    Book Now <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-surface-50">
        <div className="section-container text-center">
          <h2 className="text-3xl font-bold text-surface-900 mb-16">Why Choose SwiftSeat?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {features.map((feature, idx) => (
              <div key={idx} className="flex flex-col items-center text-center group">
                <div className={`w-20 h-20 ${feature.color} rounded-3xl flex items-center justify-center mb-6 transform group-hover:rotate-12 transition-transform duration-300`}>
                  <feature.icon className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-surface-900 mb-3">{feature.title}</h3>
                <p className="text-surface-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="section-container">
          <div className="bg-brand-500 rounded-[40px] p-12 md:p-20 relative overflow-hidden flex flex-col items-center text-center text-white">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/5 rounded-full -ml-32 -mb-32"></div>
            
            <h2 className="text-3xl md:text-5xl font-extrabold mb-6 relative z-10">
              Ready to start your journey?
            </h2>
            <p className="text-brand-100 text-lg md:text-xl mb-10 max-w-2xl relative z-10">
              Join millions of happy travelers and experience the most reliable bus booking platform in India.
            </p>
            <Link to="/register" className="bg-white text-brand-500 font-bold px-10 py-4 rounded-full text-lg hover:shadow-elevated transition-all active:scale-95 relative z-10">
              Create Free Account
            </Link>
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
      strokeWidth="2" 
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
