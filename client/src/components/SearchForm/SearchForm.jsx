import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, Calendar, ArrowRightLeft, Search } from 'lucide-react'
import { busService } from '../../services/busService'
import { useBooking } from '../../context/BookingContext'
import { getMinDate, classNames } from '../../utils/helpers'

export default function SearchForm({ compact = false }) {
  const navigate = useNavigate()
  const { searchParams, dispatch } = useBooking()
  const [cities, setCities] = useState([])
  const [formData, setFormData] = useState({
    from: searchParams.from || '',
    to: searchParams.to || '',
    date: searchParams.date || getMinDate(),
  })
  const [showFromSuggestions, setShowFromSuggestions] = useState(false)
  const [showToSuggestions, setShowToSuggestions] = useState(false)

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const data = await busService.getCities()
        setCities(data)
      } catch (error) {
        console.error('Failed to fetch cities', error)
      }
    }
    fetchCities()
  }, [])

  const handleSwap = () => {
    setFormData(prev => ({ ...prev, from: prev.to, to: prev.from }))
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (!formData.from || !formData.to) return
    
    dispatch({ type: 'SET_SEARCH', payload: formData })
    navigate(`/search?from=${formData.from}&to=${formData.to}&date=${formData.date}`)
  }

  const filteredFromCities = cities.filter(city => 
    city.name.toLowerCase().includes(formData.from.toLowerCase())
  )

  const filteredToCities = cities.filter(city => 
    city.name.toLowerCase().includes(formData.to.toLowerCase())
  )

  if (compact) {
    return (
      <form onSubmit={handleSearch} className="glass p-2 rounded-2xl flex flex-col md:flex-row items-center gap-2 w-full">
        <div className="relative flex-1 w-full">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400">
            <MapPin className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="From"
            className="w-full pl-10 pr-4 py-3 bg-white/50 rounded-xl text-sm font-bold text-navy-charcoal focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            value={formData.from}
            onChange={(e) => setFormData(prev => ({ ...prev, from: e.target.value }))}
            onFocus={() => setShowFromSuggestions(true)}
          />
        </div>

        <button type="button" onClick={handleSwap} className="p-2 rounded-full hover:bg-white/80 text-brand-500 transition-all">
          <ArrowRightLeft className="w-4 h-4" />
        </button>

        <div className="relative flex-1 w-full">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400">
            <MapPin className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="To"
            className="w-full pl-10 pr-4 py-3 bg-white/50 rounded-xl text-sm font-bold text-navy-charcoal focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            value={formData.to}
            onChange={(e) => setFormData(prev => ({ ...prev, to: e.target.value }))}
            onFocus={() => setShowToSuggestions(true)}
          />
        </div>

        <button type="submit" className="btn-primary py-3 px-6 w-full md:w-auto flex items-center justify-center gap-2 shadow-sm">
          <Search className="w-4 h-4" />
          <span>Search</span>
        </button>
      </form>
    )
  }

  return (
    <div className="w-full">
      <form 
        onSubmit={handleSearch}
        className="glass rounded-[32px] overflow-hidden flex flex-col lg:flex-row items-stretch p-3 gap-2"
      >
        {/* From */}
        <div className="relative flex-[1.2] group">
          <div className="bg-white/50 group-focus-within:bg-white rounded-2xl transition-all duration-300">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-500 group-hover:scale-110 transition-transform">
              <MapPin className="w-6 h-6" />
            </div>
            <div className="pl-16 pr-8 py-6 text-left">
              <label className="subheader mb-1 block">From</label>
              <input
                type="text"
                placeholder="Enter City"
                className="w-full text-xl font-black text-navy-charcoal placeholder:text-surface-400 focus:outline-none bg-transparent"
                value={formData.from}
                onChange={(e) => {
                  setFormData({ ...formData, from: e.target.value })
                  setShowFromSuggestions(true)
                }}
                onFocus={() => setShowFromSuggestions(true)}
                onBlur={() => setTimeout(() => setShowFromSuggestions(false), 200)}
              />
            </div>
          </div>
          
          {showFromSuggestions && filteredFromCities.length > 0 && (
            <div className="absolute z-50 left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-elevated overflow-hidden border border-surface-100 max-h-64 overflow-y-auto animate-fade-in">
              {filteredFromCities.map(city => (
                <button
                  key={city.name}
                  type="button"
                  className="w-full text-left px-6 py-4 hover:bg-brand-50 flex items-center gap-4 transition-colors"
                  onClick={() => {
                    setFormData({ ...formData, from: city.name })
                    setShowFromSuggestions(false)
                  }}
                >
                  <div className="w-10 h-10 bg-surface-100 rounded-xl flex items-center justify-center text-surface-400 group-hover:text-brand-500">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-navy-charcoal">{city.name}</p>
                    <p className="text-xs text-surface-500 font-medium">{city.state}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Swap Button */}
        <div className="relative flex items-center justify-center lg:w-0 z-10">
          <button 
            type="button" 
            onClick={handleSwap}
            className="w-12 h-12 bg-white rounded-full shadow-premium flex items-center justify-center text-brand-500 hover:bg-brand-500 hover:text-white transition-all duration-300 lg:-mx-6 active:rotate-180"
          >
            <ArrowRightLeft className="w-6 h-6" />
          </button>
        </div>

        {/* To */}
        <div className="relative flex-[1.2] group">
          <div className="bg-white/50 group-focus-within:bg-white rounded-2xl transition-all duration-300">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-500 group-hover:scale-110 transition-transform">
              <MapPin className="w-6 h-6" />
            </div>
            <div className="pl-16 pr-8 py-6 text-left">
              <label className="subheader mb-1 block">To</label>
              <input
                type="text"
                placeholder="Enter City"
                className="w-full text-xl font-black text-navy-charcoal placeholder:text-surface-400 focus:outline-none bg-transparent"
                value={formData.to}
                onChange={(e) => {
                  setFormData({ ...formData, to: e.target.value })
                  setShowToSuggestions(true)
                }}
                onFocus={() => setShowToSuggestions(true)}
                onBlur={() => setTimeout(() => setShowToSuggestions(false), 200)}
              />
            </div>
          </div>

          {showToSuggestions && filteredToCities.length > 0 && (
            <div className="absolute z-50 left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-elevated overflow-hidden border border-surface-100 max-h-64 overflow-y-auto animate-fade-in">
              {filteredToCities.map(city => (
                <button
                  key={city.name}
                  type="button"
                  className="w-full text-left px-6 py-4 hover:bg-brand-50 flex items-center gap-4 transition-colors"
                  onClick={() => {
                    setFormData({ ...formData, to: city.name })
                    setShowToSuggestions(false)
                  }}
                >
                  <div className="w-10 h-10 bg-surface-100 rounded-xl flex items-center justify-center text-surface-400 group-hover:text-brand-500">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-navy-charcoal">{city.name}</p>
                    <p className="text-xs text-surface-500 font-medium">{city.state}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Date */}
        <div className="relative flex-1 group">
          <div className="bg-white/50 group-focus-within:bg-white rounded-2xl transition-all duration-300">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-500 group-hover:scale-110 transition-transform">
              <Calendar className="w-6 h-6" />
            </div>
            <div className="pl-16 pr-8 py-6 text-left">
              <label className="subheader mb-1 block">Date</label>
              <input
                type="date"
                min={getMinDate()}
                className="w-full text-xl font-black text-navy-charcoal focus:outline-none bg-transparent cursor-pointer"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Search Button */}
        <button 
          type="submit"
          className="btn-primary lg:px-12 py-6 flex items-center justify-center gap-3 text-xl font-black tracking-tight"
        >
          <Search className="w-7 h-7" />
          <span>SEARCH</span>
        </button>
      </form>
    </div>
  )
}

