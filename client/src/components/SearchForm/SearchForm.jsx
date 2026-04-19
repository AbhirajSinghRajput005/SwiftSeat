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
      <form onSubmit={handleSearch} className="bg-white p-3 rounded-xl shadow-card border border-surface-200 flex flex-col md:flex-row items-center gap-3 w-full">
        <div className="relative flex-1 w-full">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-500">
            <MapPin className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="From City"
            className="w-full pl-9 pr-4 py-2 bg-surface-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            value={formData.from}
            onChange={(e) => setFormData(prev => ({ ...prev, from: e.target.value }))}
            onFocus={() => setShowFromSuggestions(true)}
          />
        </div>

        <button type="button" onClick={handleSwap} className="p-2 rounded-full hover:bg-surface-100 text-brand-500 transition-colors">
          <ArrowRightLeft className="w-4 h-4" />
        </button>

        <div className="relative flex-1 w-full">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-500">
            <MapPin className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="To City"
            className="w-full pl-9 pr-4 py-2 bg-surface-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            value={formData.to}
            onChange={(e) => setFormData(prev => ({ ...prev, to: e.target.value }))}
            onFocus={() => setShowToSuggestions(true)}
          />
        </div>

        <div className="relative flex-1 w-full">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-500">
            <Calendar className="w-4 h-4" />
          </div>
          <input
            type="date"
            min={getMinDate()}
            className="w-full pl-9 pr-4 py-2 bg-surface-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            value={formData.date}
            onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
          />
        </div>

        <button type="submit" className="btn-primary py-2 px-6 w-full md:w-auto flex items-center justify-center gap-2">
          <Search className="w-4 h-4" />
          Search
        </button>
      </form>
    )
  }

  return (
    <div className="w-full max-w-5xl mx-auto">
      <form 
        onSubmit={handleSearch}
        className="bg-white rounded-2xl shadow-elevated border border-surface-200 overflow-hidden flex flex-col md:flex-row items-stretch"
      >
        {/* From */}
        <div className="relative flex-1 border-b md:border-b-0 md:border-r border-surface-200">
          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-brand-500">
            <MapPin className="w-6 h-6" />
          </div>
          <div className="pl-14 pr-6 py-5">
            <label className="block text-xs font-semibold text-surface-500 uppercase tracking-wider mb-1">From</label>
            <input
              type="text"
              placeholder="Enter City"
              className="w-full text-lg font-bold text-surface-900 placeholder:text-surface-400 focus:outline-none bg-transparent"
              value={formData.from}
              onChange={(e) => {
                setFormData({ ...formData, from: e.target.value })
                setShowFromSuggestions(true)
              }}
              onFocus={() => setShowFromSuggestions(true)}
              onBlur={() => setTimeout(() => setShowFromSuggestions(false), 200)}
            />
          </div>
          
          {showFromSuggestions && filteredFromCities.length > 0 && (
            <div className="absolute z-50 left-0 right-0 top-full bg-white border border-surface-200 shadow-elevated rounded-b-xl max-h-60 overflow-y-auto">
              {filteredFromCities.map(city => (
                <button
                  key={city.name}
                  type="button"
                  className="w-full text-left px-5 py-3 hover:bg-brand-50 flex items-center gap-3 transition-colors"
                  onClick={() => {
                    setFormData({ ...formData, from: city.name })
                    setShowFromSuggestions(false)
                  }}
                >
                  <MapPin className="w-4 h-4 text-surface-400" />
                  <div>
                    <p className="text-sm font-semibold text-surface-900">{city.name}</p>
                    <p className="text-xs text-surface-500">{city.state}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Swap Button */}
        <div className="relative flex items-center justify-center h-0 md:h-auto z-10">
          <button 
            type="button" 
            onClick={handleSwap}
            className="w-10 h-10 bg-white border border-surface-200 rounded-full shadow-card flex items-center justify-center text-brand-500 hover:bg-brand-500 hover:text-white transition-all duration-300 md:-mx-5"
          >
            <ArrowRightLeft className="w-5 h-5" />
          </button>
        </div>

        {/* To */}
        <div className="relative flex-1 border-b md:border-b-0 md:border-r border-surface-200">
          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-brand-500">
            <MapPin className="w-6 h-6" />
          </div>
          <div className="pl-14 pr-6 py-5">
            <label className="block text-xs font-semibold text-surface-500 uppercase tracking-wider mb-1">To</label>
            <input
              type="text"
              placeholder="Enter City"
              className="w-full text-lg font-bold text-surface-900 placeholder:text-surface-400 focus:outline-none bg-transparent"
              value={formData.to}
              onChange={(e) => {
                setFormData({ ...formData, to: e.target.value })
                setShowToSuggestions(true)
              }}
              onFocus={() => setShowToSuggestions(true)}
              onBlur={() => setTimeout(() => setShowToSuggestions(false), 200)}
            />
          </div>

          {showToSuggestions && filteredToCities.length > 0 && (
            <div className="absolute z-50 left-0 right-0 top-full bg-white border border-surface-200 shadow-elevated rounded-b-xl max-h-60 overflow-y-auto">
              {filteredToCities.map(city => (
                <button
                  key={city.name}
                  type="button"
                  className="w-full text-left px-5 py-3 hover:bg-brand-50 flex items-center gap-3 transition-colors"
                  onClick={() => {
                    setFormData({ ...formData, to: city.name })
                    setShowToSuggestions(false)
                  }}
                >
                  <MapPin className="w-4 h-4 text-surface-400" />
                  <div>
                    <p className="text-sm font-semibold text-surface-900">{city.name}</p>
                    <p className="text-xs text-surface-500">{city.state}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Date */}
        <div className="relative flex-1 border-b md:border-b-0 border-surface-200">
          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-brand-500">
            <Calendar className="w-6 h-6" />
          </div>
          <div className="pl-14 pr-6 py-5">
            <label className="block text-xs font-semibold text-surface-500 uppercase tracking-wider mb-1">Travel Date</label>
            <input
              type="date"
              min={getMinDate()}
              className="w-full text-lg font-bold text-surface-900 focus:outline-none bg-transparent"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>
        </div>

        {/* Search Button */}
        <button 
          type="submit"
          className="bg-brand-500 hover:bg-brand-600 text-white px-10 py-5 flex items-center justify-center gap-2 font-bold text-lg transition-all active:scale-95 md:w-auto"
        >
          <Search className="w-6 h-6" />
          SEARCH
        </button>
      </form>
    </div>
  )
}
