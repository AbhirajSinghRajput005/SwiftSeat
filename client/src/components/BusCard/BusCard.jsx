import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Bus, Star, Clock, MapPin, Wifi, Battery, Coffee, Wind, Tv, Shield, ChevronRight } from 'lucide-react'
import { formatCurrency, formatTime } from '../../utils/helpers'

export default function BusCard({ route }) {
  const { bus, from, to, departureTime, arrivalTime, duration, basePrice, availableSeats } = route
  const [showAmenities, setShowAmenities] = useState(false)

  const amenityIcons = {
    'WiFi': <Wifi className="w-4 h-4" />,
    'Charging': <Battery className="w-4 h-4" />,
    'Blanket': <div className="w-4 h-4 border-2 border-current rounded-sm" />,
    'Water': <div className="w-4 h-4 border-b-2 border-current rounded-full" />,
    'Snacks': <Coffee className="w-4 h-4" />,
    'AC': <Wind className="w-4 h-4" />,
    'Track My Bus': <MapPin className="w-4 h-4" />,
    'Emergency Exit': <Shield className="w-4 h-4" />,
  }

  return (
    <div className="card hover:shadow-premium group overflow-hidden flex flex-col md:flex-row animate-fade-in-up bg-white rounded-[32px] transition-all duration-500">
      {/* Left Info */}
      <div className="flex-1 p-8">
        <div className="flex flex-wrap items-start justify-between gap-6 mb-8">
          <div>
            <h3 className="text-2xl font-black text-navy-charcoal mb-2 tracking-tight">{bus.operator}</h3>
            <div className="flex items-center gap-3">
              <span className="subheader bg-surface-100 px-3 py-1 rounded-full text-navy-charcoal border-0">{bus.type}</span>
              <div className="flex items-center gap-1.5 text-xs font-black text-white bg-green-500 px-3 py-1 rounded-full shadow-sm shadow-green-200">
                <Star className="w-3.5 h-3.5 fill-current" /> {bus.rating}
              </div>
              <span className="text-xs text-surface-500 font-bold">({bus.reviewCount} reviews)</span>
            </div>
          </div>
          
          <div className="text-right">
            <span className="subheader mb-1 block">Starting From</span>
            <p className="text-3xl font-black text-brand-500 tracking-tighter">{formatCurrency(basePrice)}</p>
          </div>
        </div>

        {/* Timeline */}
        <div className="flex items-center gap-10 mb-8 bg-surface-50 p-6 rounded-3xl border border-white">
          <div className="flex flex-col">
            <span className="text-2xl font-black text-navy-charcoal">{formatTime(departureTime)}</span>
            <span className="text-sm text-surface-500 font-bold tracking-tight">{from.city}</span>
          </div>
          
          <div className="flex-1 flex flex-col items-center gap-2">
            <span className="subheader">{duration}</span>
            <div className="w-full h-1 bg-surface-200 rounded-full relative">
              <div className="absolute top-1/2 left-0 -translate-y-1/2 w-3 h-3 rounded-full bg-surface-300 border-2 border-white shadow-sm"></div>
              <div className="absolute top-1/2 right-0 -translate-y-1/2 w-3 h-3 rounded-full bg-brand-500 border-2 border-white shadow-sm shadow-brand-200"></div>
            </div>
            <span className="text-[10px] font-black text-brand-500 uppercase tracking-widest">{availableSeats} SEATS LEFT</span>
          </div>

          <div className="flex flex-col text-right">
            <span className="text-2xl font-black text-navy-charcoal">{formatTime(arrivalTime)}</span>
            <span className="text-sm text-surface-500 font-bold tracking-tight">{to.city}</span>
          </div>
        </div>

        {/* Amenities Icons */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-4">
            {bus.amenities.slice(0, 5).map(amenity => (
              <div key={amenity} title={amenity} className="w-10 h-10 bg-white shadow-sm rounded-xl flex items-center justify-center text-surface-400 hover:text-brand-500 hover:scale-110 transition-all duration-300">
                {amenityIcons[amenity] || <Bus className="w-5 h-5" />}
              </div>
            ))}
            {bus.amenities.length > 5 && (
              <button 
                onClick={() => setShowAmenities(!showAmenities)}
                className="w-10 h-10 bg-white shadow-sm rounded-xl flex items-center justify-center text-xs font-black text-brand-500 hover:bg-brand-50 transition-all"
              >
                +{bus.amenities.length - 5}
              </button>
            )}
          </div>
          
          <div className="flex items-center gap-6">
             <button className="text-xs font-black text-surface-500 hover:text-navy-charcoal transition-colors uppercase tracking-widest">Track</button>
             <button className="text-xs font-black text-surface-500 hover:text-navy-charcoal transition-colors uppercase tracking-widest">Reviews</button>
          </div>
        </div>

        {showAmenities && (
          <div className="mt-6 p-6 bg-white rounded-3xl shadow-inner border border-surface-50 grid grid-cols-2 sm:grid-cols-4 gap-4 animate-fade-in">
            {bus.amenities.map(amenity => (
              <div key={amenity} className="flex items-center gap-3 text-xs font-bold text-navy-charcoal">
                <span className="text-brand-500">{amenityIcons[amenity] || <Bus className="w-4 h-4" />}</span>
                {amenity}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right Action */}
      <div className="md:w-56 bg-navy-charcoal p-8 flex flex-col justify-center items-center gap-6 relative">
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
        
        <Link 
          to={`/select-seat/${route._id}`}
          className="btn-primary w-full py-4 text-sm shadow-premium"
        >
          Select Seats <ChevronRight className="w-5 h-5" />
        </Link>
        <div className="flex flex-col items-center text-center">
          <p className="text-[10px] text-surface-400 font-bold uppercase tracking-[0.2em] mb-1">Guarantee</p>
          <p className="text-xs text-white/70 font-medium">No hidden fees</p>
        </div>
      </div>
    </div>
  )
}

