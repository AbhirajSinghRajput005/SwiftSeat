import { useState } from 'react'
import { Bus, User, Info } from 'lucide-react'
import { classNames } from '../../utils/helpers'

export default function SeatMap({ bus, bookedSeats = [], selectedSeats = [], onToggleSeat }) {
  const [activeDeck, setActiveDeck] = useState('lower') // 'lower' or 'upper'
  
  const hasUpperDeck = bus.seatLayout.upperDeck && bus.seatLayout.upperDeck.seats.length > 0
  const layout = activeDeck === 'lower' ? bus.seatLayout.lowerDeck : bus.seatLayout.upperDeck

  // Group seats by row for easier rendering
  const rows = Array.from({ length: layout.rows }, (_, r) => {
    return layout.seats.filter(s => s.row === r).sort((a, b) => a.col - b.col)
  })

  const getSeatStatus = (seatId) => {
    if (bookedSeats.includes(seatId)) return 'booked'
    if (selectedSeats.find(s => s.id === seatId)) return 'selected'
    return 'available'
  }

  return (
    <div className="bg-white p-6 rounded-2xl border border-surface-200">
      <div className="flex items-center justify-between mb-8">
        <h3 className="font-bold text-surface-900 flex items-center gap-2">
          <Bus className="w-5 h-5 text-brand-500" /> Select Your Seats
        </h3>
        
        {hasUpperDeck && (
          <div className="flex p-1 bg-surface-100 rounded-xl">
            <button
              onClick={() => setActiveDeck('lower')}
              className={classNames(
                "px-4 py-1.5 rounded-lg text-xs font-bold transition-all",
                activeDeck === 'lower' ? "bg-white shadow-sm text-brand-500" : "text-surface-500 hover:text-surface-700"
              )}
            >
              Lower Deck
            </button>
            <button
              onClick={() => setActiveDeck('upper')}
              className={classNames(
                "px-4 py-1.5 rounded-lg text-xs font-bold transition-all",
                activeDeck === 'upper' ? "bg-white shadow-sm text-brand-500" : "text-surface-500 hover:text-surface-700"
              )}
            >
              Upper Deck
            </button>
          </div>
        )}
      </div>

      {/* Bus Layout Container */}
      <div className="relative border-4 border-surface-200 rounded-[2rem] p-8 max-w-[300px] mx-auto bg-surface-50">
        {/* Front Section */}
        <div className="flex justify-between items-center mb-10 pb-6 border-b border-surface-200">
          <div className="w-10 h-10 border-2 border-surface-300 rounded-full flex items-center justify-center text-surface-400">
             <div className="w-6 h-6 border-4 border-current rounded-full"></div> {/* Steering Wheel */}
          </div>
          <div className="text-[10px] font-bold text-surface-400 uppercase tracking-widest">Front</div>
        </div>

        {/* Seats Grid */}
        <div className="space-y-4">
          {rows.map((row, rIdx) => (
            <div key={rIdx} className="flex justify-between gap-2">
               {/* This logic assumes a standard bus layout where we might have aisles */}
               {/* For simplicity, we just render the seats provided in the layout data */}
               {row.map((seat) => {
                 const status = getSeatStatus(seat.id)
                 return (
                   <button
                     key={seat.id}
                     disabled={status === 'booked'}
                     onClick={() => onToggleSeat(seat)}
                     className={classNames(
                       "relative transition-all duration-200",
                       seat.type === 'sleeper' ? "w-12 h-20" : "w-10 h-10",
                       "rounded-lg border-2 flex items-center justify-center",
                       status === 'booked' 
                        ? "bg-surface-200 border-surface-300 text-surface-400 cursor-not-allowed" 
                        : status === 'selected'
                        ? "bg-success border-success text-white scale-105 shadow-elevated"
                        : seat.isWomenOnly
                        ? "bg-pink-50 border-pink-200 text-pink-500 hover:border-pink-500"
                        : "bg-white border-surface-300 text-surface-600 hover:border-brand-500 hover:bg-brand-50"
                     )}
                   >
                     <span className="text-[10px] font-bold">{seat.id}</span>
                     {seat.isWomenOnly && status !== 'selected' && (
                       <div className="absolute -top-1 -right-1 w-2 h-2 bg-pink-500 rounded-full"></div>
                     )}
                   </button>
                 )
               })}
            </div>
          ))}
        </div>

        {/* Back Section */}
        <div className="mt-10 pt-6 border-t border-surface-200 text-center">
           <div className="text-[10px] font-bold text-surface-400 uppercase tracking-widest">Back</div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-10 pt-6 border-t border-surface-100 grid grid-cols-2 sm:grid-cols-4 gap-4">
        <LegendItem status="available" label="Available" />
        <LegendItem status="selected" label="Selected" />
        <LegendItem status="booked" label="Booked" />
        <LegendItem status="women" label="Women Only" />
      </div>

      <div className="mt-6 p-4 bg-brand-50 rounded-xl flex gap-3 text-xs text-brand-700">
        <Info className="w-4 h-4 flex-shrink-0" />
        <p>Click on a seat to select it. You can select up to 6 seats at once.</p>
      </div>
    </div>
  )
}

function LegendItem({ status, label }) {
  const styles = {
    available: "bg-white border-surface-300",
    selected: "bg-success border-success",
    booked: "bg-surface-200 border-surface-300",
    women: "bg-pink-50 border-pink-200",
  }
  
  return (
    <div className="flex items-center gap-2">
      <div className={classNames("w-4 h-4 rounded border-2", styles[status])}></div>
      <span className="text-xs font-medium text-surface-600">{label}</span>
    </div>
  )
}
