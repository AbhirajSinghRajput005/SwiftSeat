import { Bus, MapPin, Calendar, Clock, ChevronRight } from 'lucide-react'
import { formatCurrency, formatTime, formatDate } from '../../utils/helpers'

export default function BookingSummary({ route, selectedSeats, onProceed, loading = false, showButton = true }) {
  const { bus, from, to, departureTime, date, basePrice } = route
  
  const subtotal = selectedSeats.reduce((sum, seat) => sum + seat.price, 0)
  const tax = Math.round(subtotal * 0.05) // 5% GST
  const total = subtotal + tax

  return (
    <div className="bg-white rounded-2xl shadow-card border border-surface-200 overflow-hidden sticky top-32">
      {/* Header */}
      <div className="bg-brand-500 p-6 text-white">
        <h3 className="font-bold text-lg mb-4">Journey Summary</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
              <Bus className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-bold">{bus.operator}</p>
              <p className="text-[10px] text-brand-100 uppercase font-medium">{bus.type}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-bold">{formatDate(date)}</p>
              <p className="text-[10px] text-brand-100 uppercase font-medium">Departure at {formatTime(departureTime)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="p-6 space-y-6">
        {/* Route */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-surface-300"></div>
            <div className="w-px h-6 border-l border-dashed border-surface-300"></div>
            <div className="w-2 h-2 rounded-full bg-brand-500"></div>
          </div>
          <div className="flex flex-col gap-3 flex-1">
             <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-surface-900">{from.city}</span>
                <span className="text-[10px] text-surface-400">{formatTime(departureTime)}</span>
             </div>
             <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-surface-900">{to.city}</span>
                <span className="text-[10px] text-surface-400">Approx. 7h later</span>
             </div>
          </div>
        </div>

        {/* Selected Seats */}
        <div>
          <h4 className="text-[10px] font-bold text-surface-400 uppercase tracking-widest mb-3">Selected Seats</h4>
          {selectedSeats.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {selectedSeats.map(seat => (
                <span key={seat.id} className="bg-surface-100 text-surface-800 text-xs font-bold px-3 py-1.5 rounded-lg border border-surface-200">
                  {seat.id}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-surface-400 italic">No seats selected yet</p>
          )}
        </div>

        {/* Price Breakdown */}
        <div className="space-y-2 pt-4 border-t border-surface-100">
          <div className="flex justify-between text-sm">
            <span className="text-surface-500">Base Fare ({selectedSeats.length} Seats)</span>
            <span className="font-semibold text-surface-900">{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-surface-500">Tax & Fees (5%)</span>
            <span className="font-semibold text-surface-900">{formatCurrency(tax)}</span>
          </div>
          <div className="flex justify-between text-lg font-extrabold pt-2 border-t border-surface-100 mt-2">
            <span className="text-surface-900">Total</span>
            <span className="text-brand-500">{formatCurrency(total)}</span>
          </div>
        </div>

        {/* Action */}
        {showButton && (
          <button
            disabled={selectedSeats.length === 0 || loading}
            onClick={onProceed}
            className="btn-primary w-full py-4 flex items-center justify-center gap-2"
          >
            {loading ? 'Processing...' : (
              <>
                Proceed to Checkout <ChevronRight className="w-5 h-5" />
              </>
            )}
          </button>
        )}
      </div>

      <div className="bg-surface-50 p-4 border-t border-surface-100 text-center">
         <p className="text-[10px] text-surface-400 font-medium">Safe & Secure Booking with 256-bit SSL</p>
      </div>
    </div>
  )
}
