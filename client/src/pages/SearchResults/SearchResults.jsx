import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Filter, SlidersHorizontal, Loader2, Bus as BusIcon, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react'
import { busService } from '../../services/busService'
import BusCard from '../../components/BusCard/BusCard'
import SearchForm from '../../components/SearchForm/SearchForm'
import { formatDate, classNames } from '../../utils/helpers'

export default function SearchResults() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [routes, setRoutes] = useState([])
  const [filteredRoutes, setFilteredRoutes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Filters
  const [filters, setFilters] = useState({
    busTypes: [],
    operators: [],
    departureTimes: [],
    maxPrice: 2000,
  })

  const from = searchParams.get('from')
  const to = searchParams.get('to')
  const date = searchParams.get('date')

  useEffect(() => {
    const fetchResults = async () => {
      if (!from || !to || !date) return
      
      setLoading(true)
      try {
        const data = await busService.searchBuses(from, to, date)
        setRoutes(data)
        setFilteredRoutes(data)
        setError(null)
      } catch (err) {
        setError('Failed to fetch bus routes. Please try again.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchResults()
  }, [from, to, date])

  useEffect(() => {
    let result = [...routes]
    
    if (filters.busTypes.length > 0) {
      result = result.filter(r => filters.busTypes.includes(r.bus.type))
    }
    
    if (filters.departureTimes.length > 0) {
      result = result.filter(r => {
        const hour = parseInt(r.departureTime.split(':')[0])
        if (filters.departureTimes.includes('morning') && hour >= 6 && hour < 12) return true
        if (filters.departureTimes.includes('afternoon') && hour >= 12 && hour < 18) return true
        if (filters.departureTimes.includes('evening') && hour >= 18 && hour < 23) return true
        if (filters.departureTimes.includes('night') && (hour >= 23 || hour < 6)) return true
        return false
      })
    }
    
    result = result.filter(r => r.basePrice <= filters.maxPrice)
    
    setFilteredRoutes(result)
  }, [filters, routes])

  const toggleBusType = (type) => {
    setFilters(prev => ({
      ...prev,
      busTypes: prev.busTypes.includes(type) 
        ? prev.busTypes.filter(t => t !== type)
        : [...prev.busTypes, type]
    }))
  }

  const toggleTime = (time) => {
    setFilters(prev => ({
      ...prev,
      departureTimes: prev.departureTimes.includes(time) 
        ? prev.departureTimes.filter(t => t !== time)
        : [...prev.departureTimes, time]
    }))
  }

  if (error) {
    return (
      <div className="section-container py-20 text-center">
        <AlertCircle className="w-16 h-16 text-error mx-auto mb-4" />
        <h2 className="text-4xl font-black text-navy-charcoal mb-4 tracking-tight">Oops! Something went wrong</h2>
        <p className="text-surface-600 mb-8 max-w-md mx-auto">{error}</p>
        <button onClick={() => window.location.reload()} className="btn-primary px-10">Try Again</button>
      </div>
    )
  }

  return (
    <div className="bg-surface-50 min-h-screen pb-32">
      {/* Top Fixed Search Bar - Refined Glass */}
      <div className="fixed top-28 left-0 right-0 z-40 px-6 sm:px-8 lg:px-12 pointer-events-none">
        <div className="max-w-7xl mx-auto glass rounded-[24px] pointer-events-auto shadow-premium border-white/40">
          <div className="flex items-center gap-6 h-20 px-8">
            <button onClick={() => navigate('/')} className="w-10 h-10 bg-white shadow-sm rounded-full flex items-center justify-center text-navy-charcoal hover:bg-brand-500 hover:text-white transition-all">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-black text-navy-charcoal tracking-tight">
                  {from}
                </h1>
                <ChevronRight className="w-4 h-4 text-surface-400" />
                <h1 className="text-xl font-black text-navy-charcoal tracking-tight">
                  {to}
                </h1>
              </div>
              <p className="subheader mt-1">{formatDate(date)}</p>
            </div>
            <div className="hidden lg:block">
               <button onClick={() => navigate('/')} className="btn-secondary py-2 px-6 rounded-full text-sm border-0">Modify Search</button>
            </div>
          </div>
        </div>
      </div>

      <div className="section-container pt-52 flex flex-col lg:flex-row gap-12">
        {/* Filters Sidebar */}
        <aside className="hidden lg:block w-80 flex-shrink-0 space-y-8">
          <div className="bg-white p-8 rounded-[32px] shadow-soft border-0">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black text-navy-charcoal flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-brand-500" /> Filters
              </h3>
              <button 
                onClick={() => setFilters({ busTypes: [], operators: [], departureTimes: [], maxPrice: 2000 })}
                className="text-xs font-black text-brand-500 hover:text-brand-600 uppercase tracking-widest"
              >
                Reset
              </button>
            </div>

            {/* Departure Time */}
            <div className="mb-10">
              <h4 className="subheader mb-5">Departure Time</h4>
              <div className="grid grid-cols-2 gap-3">
                {['Morning', 'Afternoon', 'Evening', 'Night'].map(time => (
                  <button
                    key={time}
                    onClick={() => toggleTime(time.toLowerCase())}
                    className={classNames(
                      "py-3 px-2 rounded-xl text-xs font-black transition-all border-0 shadow-sm",
                      filters.departureTimes.includes(time.toLowerCase())
                        ? "bg-brand-500 text-white shadow-brand-200"
                        : "bg-surface-50 text-surface-600 hover:bg-surface-100"
                    )}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            {/* Bus Type */}
            <div className="mb-10">
              <h4 className="subheader mb-5">Bus Type</h4>
              <div className="space-y-4">
                {['Volvo AC', 'AC Sleeper', 'AC Seater', 'Non-AC Sleeper'].map(type => (
                  <label key={type} className="flex items-center gap-4 cursor-pointer group">
                    <div className="relative flex items-center justify-center">
                      <input 
                        type="checkbox" 
                        className="peer sr-only"
                        checked={filters.busTypes.includes(type)}
                        onChange={() => toggleBusType(type)}
                      />
                      <div className="w-5 h-5 border-2 border-surface-200 rounded-md bg-white peer-checked:bg-brand-500 peer-checked:border-brand-500 transition-all"></div>
                      <div className="absolute opacity-0 peer-checked:opacity-100 transition-opacity">
                        <svg className="w-3 h-3 text-white fill-current" viewBox="0 0 20 20"><path d="M0 11l2-2 5 5L18 3l2 2L7 18z"/></svg>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-surface-700 group-hover:text-navy-charcoal transition-colors">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h4 className="subheader">Max Price</h4>
                <span className="text-sm font-black text-brand-500">₹{filters.maxPrice}</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="2000" 
                step="50"
                value={filters.maxPrice}
                onChange={(e) => setFilters({ ...filters, maxPrice: parseInt(e.target.value) })}
                className="w-full h-1.5 bg-surface-100 rounded-lg appearance-none cursor-pointer accent-brand-500"
              />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-brand-500 to-brand-600 p-8 rounded-[32px] text-white relative overflow-hidden shadow-premium">
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
             <div className="relative z-10">
               <h4 className="text-xl font-black mb-3">First Booking?</h4>
               <p className="text-sm text-brand-100 mb-6 font-medium leading-relaxed">Get 20% OFF using code <br /><span className="font-black text-white text-lg">SWIFT20</span></p>
               <button className="bg-white text-brand-500 text-sm font-black py-4 px-6 rounded-2xl w-full shadow-lg shadow-black/5 hover:scale-[1.02] transition-transform">Apply Coupon</button>
             </div>
          </div>
        </aside>

        {/* Results Main Area */}
        <main className="flex-1">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4 px-2">
            <h2 className="text-2xl font-black text-navy-charcoal">
              {loading ? 'Searching for best routes...' : `${filteredRoutes.length} Buses available`}
            </h2>
            {!loading && (
              <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow-sm">
                <span className="subheader !text-xs">Sort by</span>
                <select className="bg-transparent text-sm font-black text-navy-charcoal focus:outline-none cursor-pointer">
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Earliest Departure</option>
                  <option>Latest Departure</option>
                  <option>Top Rated</option>
                </select>
              </div>
            )}
          </div>

          {loading ? (
            <div className="space-y-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white p-8 rounded-[32px] shadow-soft border-0 space-y-6">
                  <div className="flex justify-between items-center">
                    <div className="h-8 w-64 skeleton"></div>
                    <div className="h-8 w-32 skeleton"></div>
                  </div>
                  <div className="h-32 w-full skeleton rounded-3xl"></div>
                  <div className="flex gap-4">
                    <div className="h-10 w-10 skeleton rounded-xl"></div>
                    <div className="h-10 w-10 skeleton rounded-xl"></div>
                    <div className="h-10 w-10 skeleton rounded-xl"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredRoutes.length > 0 ? (
            <div className="space-y-8 animate-fade-in">
              {filteredRoutes.map(route => (
                <BusCard key={route._id} route={route} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-[40px] p-24 text-center shadow-soft border-0 animate-fade-in">
              <div className="w-24 h-24 bg-surface-50 rounded-[32px] flex items-center justify-center mx-auto mb-8">
                <BusIcon className="w-12 h-12 text-surface-200" />
              </div>
              <h3 className="text-3xl font-black text-navy-charcoal mb-4">No buses found</h3>
              <p className="text-surface-500 mb-10 max-w-sm mx-auto font-medium">We couldn't find any buses for this route on the selected date. Try another date or route.</p>
              <button 
                onClick={() => navigate('/')} 
                className="btn-primary px-12 py-5 rounded-full"
              >
                Modify Search
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

