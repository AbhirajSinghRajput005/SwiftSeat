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
        <h2 className="text-2xl font-bold text-surface-900 mb-2">Oops! Something went wrong</h2>
        <p className="text-surface-600 mb-6">{error}</p>
        <button onClick={() => window.location.reload()} className="btn-primary">Try Again</button>
      </div>
    )
  }

  return (
    <div className="bg-surface-100 min-h-screen pb-20">
      {/* Top Fixed Search Bar */}
      <div className="bg-white border-b border-surface-200 py-4 sticky top-16 z-30 shadow-sm">
        <div className="section-container flex items-center gap-4">
          <button onClick={() => navigate('/')} className="p-2 hover:bg-surface-100 rounded-full text-surface-600">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-surface-900">
              {from} to {to}
            </h1>
            <p className="text-xs text-surface-500 font-medium">{formatDate(date)}</p>
          </div>
          <button className="md:hidden btn-outline py-1 px-3 text-xs flex items-center gap-1">
            <Filter className="w-3 h-3" /> Filter
          </button>
        </div>
      </div>

      <div className="section-container py-8 flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="hidden lg:block w-72 flex-shrink-0 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-card border border-surface-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-surface-900 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-brand-500" /> Filters
              </h3>
              <button 
                onClick={() => setFilters({ busTypes: [], operators: [], departureTimes: [], maxPrice: 2000 })}
                className="text-xs font-bold text-brand-500 hover:text-brand-600"
              >
                Clear All
              </button>
            </div>

            {/* Departure Time */}
            <div className="mb-8">
              <h4 className="text-xs font-bold text-surface-400 uppercase tracking-widest mb-4">Departure Time</h4>
              <div className="grid grid-cols-2 gap-2">
                {['Morning', 'Afternoon', 'Evening', 'Night'].map(time => (
                  <button
                    key={time}
                    onClick={() => toggleTime(time.toLowerCase())}
                    className={classNames(
                      "py-2 px-1 rounded-lg text-[10px] font-bold border transition-all text-center",
                      filters.departureTimes.includes(time.toLowerCase())
                        ? "bg-brand-500 border-brand-500 text-white"
                        : "bg-white border-surface-200 text-surface-600 hover:border-brand-500"
                    )}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            {/* Bus Type */}
            <div className="mb-8">
              <h4 className="text-xs font-bold text-surface-400 uppercase tracking-widest mb-4">Bus Type</h4>
              <div className="space-y-3">
                {['Volvo AC', 'AC Sleeper', 'AC Seater', 'Non-AC Sleeper'].map(type => (
                  <label key={type} className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 rounded border-surface-300 text-brand-500 focus:ring-brand-500"
                      checked={filters.busTypes.includes(type)}
                      onChange={() => toggleBusType(type)}
                    />
                    <span className="text-sm text-surface-700 group-hover:text-surface-900 transition-colors">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-xs font-bold text-surface-400 uppercase tracking-widest">Max Price</h4>
                <span className="text-xs font-bold text-brand-500">₹{filters.maxPrice}</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="2000" 
                step="50"
                value={filters.maxPrice}
                onChange={(e) => setFilters({ ...filters, maxPrice: parseInt(e.target.value) })}
                className="w-full h-1.5 bg-surface-200 rounded-lg appearance-none cursor-pointer accent-brand-500"
              />
            </div>
          </div>
          
          <div className="bg-brand-500 p-6 rounded-2xl text-white relative overflow-hidden">
             <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
             <h4 className="font-bold mb-2">First Booking?</h4>
             <p className="text-xs text-brand-100 mb-4">Get 20% OFF using code <span className="font-bold text-white">SWIFT20</span></p>
             <button className="bg-white text-brand-500 text-xs font-bold py-2 px-4 rounded-lg w-full">Apply Now</button>
          </div>
        </aside>

        {/* Results Main Area */}
        <main className="flex-1 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-bold text-surface-900">
              {loading ? 'Finding buses...' : `${filteredRoutes.length} Buses found`}
            </h2>
            {!loading && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-surface-500">Sort by:</span>
                <select className="bg-transparent text-xs font-bold text-surface-900 focus:outline-none cursor-pointer">
                  <option>Price (Low to High)</option>
                  <option>Price (High to Low)</option>
                  <option>Departure (Earliest)</option>
                  <option>Departure (Latest)</option>
                  <option>Ratings</option>
                </select>
              </div>
            )}
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white p-6 rounded-2xl border border-surface-200 space-y-4">
                  <div className="flex justify-between">
                    <div className="h-6 w-48 skeleton"></div>
                    <div className="h-6 w-24 skeleton"></div>
                  </div>
                  <div className="h-12 w-full skeleton"></div>
                  <div className="h-8 w-32 skeleton"></div>
                </div>
              ))}
            </div>
          ) : filteredRoutes.length > 0 ? (
            <div className="space-y-4">
              {filteredRoutes.map(route => (
                <BusCard key={route._id} route={route} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-20 text-center border border-surface-200 animate-fade-in">
              <BusIcon className="w-16 h-16 text-surface-200 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-surface-900 mb-2">No buses found</h3>
              <p className="text-surface-500 mb-6">We couldn't find any buses for this route on the selected date.</p>
              <button 
                onClick={() => navigate('/')} 
                className="btn-primary"
              >
                Change Search
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
