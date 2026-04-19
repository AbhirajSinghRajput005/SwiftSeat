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
    'Blanket': <div className="w-4 h-4 border-2 border-current rounded-sm" />, // Simplification
    'Water': <div className="w-4 h-4 border-b-2 border-current rounded-full" />,
    'Snacks': <Coffee className="w-4 h-4" />,
    'AC': <Wind className="w-4 h-4" />,
    'Track My Bus': <MapPin className="w-4 h-4" />,
    'Emergency Exit': <Shield className="w-4 h-4" />,
  }

  return (
    <div className="card-hover overflow-hidden flex flex-col md:flex-row animate-fade-in-up">
      {/* Left Info */}
      <div className="flex-1 p-6">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div>
            <h3 className="text-xl font-bold text-surface-900 mb-1">{bus.operator}</h3>
            <div className="flex items-center gap-2">
              <span className="badge bg-surface-100 text-surface-700 text-xs">{bus.type}</span>
              <div className="flex items-center gap-1 text-xs font-bold text-white bg-green-500 px-2 py-0.5 rounded">
                <Star className="w-3 h-3 fill-current" /> {bus.rating}
              </div>
              <span className="text-xs text-surface-500">({bus.reviewCount} reviews)</span>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-xs font-bold text-surface-500 uppercase tracking-wider mb-1">Price</p>
            <p className="text-2xl font-extrabold text-brand-500">{formatCurrency(basePrice)}</p>
            <p className="text-[10px] text-surface-400 font-medium">all inclusive</p>
          </div>
        </div>

        {/* Timeline */}
        <div className="flex items-center gap-8 mb-6">
          <div className="flex flex-col">
            <span className="text-lg font-bold text-surface-900">{formatTime(departureTime)}</span>
            <span className="text-xs text-surface-500 font-medium">{from.city}</span>
          </div>
          
          <div className="flex-1 flex flex-col items-center gap-1">
            <span className="text-[10px] font-bold text-surface-400 uppercase tracking-widest">{duration}</span>
            <div className="w-full h-px bg-surface-200 relative">
              <div className="absolute top-1/2 left-0 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-surface-300"></div>
              <div className="absolute top-1/2 right-0 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-brand-500"></div>
            </div>
            <span className="text-[10px] text-surface-500 font-medium">{availableSeats} seats left</span>
          </div>

          <div className="flex flex-col text-right">
            <span className="text-lg font-bold text-surface-900">{formatTime(arrivalTime)}</span>
            <span className="text-xs text-surface-500 font-medium">{to.city}</span>
          </div>
        </div>

        {/* Amenities Icons */}
        <div className="flex items-center justify-between border-t border-surface-100 pt-4">
          <div className="flex items-center gap-3">
            {bus.amenities.slice(0, 4).map(amenity => (
              <div key={amenity} title={amenity} className="text-surface-400 hover:text-brand-500 transition-colors">
                {amenityIcons[amenity] || <Bus className="w-4 h-4" />}
              </div>
            ))}
            {bus.amenities.length > 4 && (
              <button 
                onClick={() => setShowAmenities(!showAmenities)}
                className="text-[10px] font-bold text-brand-500 hover:underline"
              >
                +{bus.amenities.length - 4} More
              </button>
            )}
          </div>
          
          <div className="flex items-center gap-4">
             <button className="text-xs font-bold text-accent-500 hover:text-accent-600">Track</button>
             <button className="text-xs font-bold text-accent-500 hover:text-accent-600">Reviews</button>
          </div>
        </div>

        {showAmenities && (
          <div className="mt-4 p-3 bg-surface-50 rounded-lg grid grid-cols-2 sm:grid-cols-4 gap-2 animate-fade-in">
            {bus.amenities.map(amenity => (
              <div key={amenity} className="flex items-center gap-2 text-[10px] font-medium text-surface-600">
                <span className="text-brand-500">{amenityIcons[amenity] || <Bus className="w-3 h-3" />}</span>
                {amenity}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right Action */}
      <div className="md:w-48 bg-surface-50 md:border-l border-surface-100 p-6 flex flex-col justify-center items-center gap-4">
        <Link 
          to={`/select-seat/${route._id}`}
          className="btn-primary w-full py-2 px-0 text-sm flex items-center justify-center gap-1"
        >
          Select Seats <ChevronRight className="w-4 h-4" />
        </Link>
        <p className="text-[10px] text-surface-500 font-medium text-center">
          No hidden fees on SwiftSeat
        </p>
      </div>
    </div>
  )
}
