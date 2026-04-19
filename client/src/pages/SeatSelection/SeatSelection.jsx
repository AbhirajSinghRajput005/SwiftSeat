import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ChevronLeft, MapPin, Clock, Info, ShieldCheck, Star } from 'lucide-react'
import { busService } from '../../services/busService'
import SeatMap from '../../components/SeatMap/SeatMap'
import BookingSummary from '../../components/BookingSummary/BookingSummary'
import { useBooking } from '../../context/BookingContext'
import { formatTime, formatDate, classNames } from '../../utils/helpers'

export default function SeatSelection() {
  const { routeId } = useParams()
  const navigate = useNavigate()
  const { dispatch, selectedSeats, boardingPoint, droppingPoint } = useBooking()
  
  const [route, setRoute] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchRoute = async () => {
      try {
        const data = await busService.getRouteDetails(routeId)
        setRoute(data)
        // Reset booking state for this new route
        dispatch({ type: 'SET_ROUTE', payload: data })
        dispatch({ type: 'SET_BUS', payload: data.bus })
        dispatch({ type: 'SET_SEATS', payload: [] })
        dispatch({ type: 'SET_BOARDING', payload: data.boardingPoints[0] })
        dispatch({ type: 'SET_DROPPING', payload: data.droppingPoints[0] })
      } catch (err) {
        setError('Failed to load bus details.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchRoute()
  }, [routeId, dispatch])

  const handleToggleSeat = (seat) => {
    if (selectedSeats.length >= 6 && !selectedSeats.find(s => s.id === seat.id)) {
      alert('You can only select up to 6 seats.')
      return
    }
    dispatch({ type: 'TOGGLE_SEAT', payload: seat })
  }

  const handleProceed = () => {
    if (selectedSeats.length === 0) return
    navigate('/checkout')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-brand-100 border-t-brand-500 rounded-full animate-spin" />
          <p className="text-surface-500 font-bold animate-pulse">Designing your bus...</p>
        </div>
      </div>
    )
  }

  if (!route) return null

  return (
    <div className="bg-surface-50 min-h-screen pb-20">
      {/* Page Header */}
      <div className="bg-white border-b border-surface-200 py-6">
        <div className="section-container">
          <div className="flex items-center gap-4 mb-6">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-surface-100 rounded-full text-surface-600">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-2xl font-extrabold text-surface-900">{route.bus.operator}</h1>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-xs font-bold text-surface-500 bg-surface-100 px-2 py-0.5 rounded uppercase tracking-wider">{route.bus.type}</span>
                <div className="flex items-center gap-1 text-xs font-bold text-green-600">
                   <Star className="w-3 h-3 fill-current" /> {route.bus.rating} Rating
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-y-4 gap-x-12 p-6 bg-brand-50 rounded-2xl border border-brand-100">
             <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-brand-500" />
                <div>
                   <p className="text-xs font-bold text-surface-500 uppercase">From</p>
                   <p className="text-sm font-bold text-surface-900">{route.from.city}</p>
                </div>
             </div>
             <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-brand-500" />
                <div>
                   <p className="text-xs font-bold text-surface-500 uppercase">Departure</p>
                   <p className="text-sm font-bold text-surface-900">{formatTime(route.departureTime)}, {formatDate(route.date)}</p>
                </div>
             </div>
             <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-brand-500" />
                <div>
                   <p className="text-xs font-bold text-surface-500 uppercase">To</p>
                   <p className="text-sm font-bold text-surface-900">{route.to.city}</p>
                </div>
             </div>
          </div>
        </div>
      </div>

      <div className="section-container py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Area: Seat Map & Points */}
          <div className="flex-1 space-y-8">
            <SeatMap 
              bus={route.bus} 
              bookedSeats={route.bookedSeats} 
              selectedSeats={selectedSeats}
              onToggleSeat={handleToggleSeat}
            />

            {/* Points Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Boarding */}
              <div className="bg-white p-6 rounded-2xl border border-surface-200">
                <h3 className="font-bold text-surface-900 mb-6 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-brand-500" /> Boarding Point
                </h3>
                <div className="space-y-3">
                  {route.boardingPoints.map((point) => (
                    <button
                      key={point.name}
                      onClick={() => dispatch({ type: 'SET_BOARDING', payload: point })}
                      className={classNames(
                        "w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between",
                        boardingPoint?.name === point.name
                          ? "bg-brand-50 border-brand-500 ring-1 ring-brand-500"
                          : "bg-white border-surface-200 hover:border-brand-300"
                      )}
                    >
                      <div>
                        <p className="text-sm font-bold text-surface-900">{point.name}</p>
                        <p className="text-[10px] text-surface-500 mt-1">{point.address}</p>
                      </div>
                      <span className="text-xs font-bold text-brand-500">{formatTime(point.time)}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Dropping */}
              <div className="bg-white p-6 rounded-2xl border border-surface-200">
                <h3 className="font-bold text-surface-900 mb-6 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-accent-500" /> Dropping Point
                </h3>
                <div className="space-y-3">
                  {route.droppingPoints.map((point) => (
                    <button
                      key={point.name}
                      onClick={() => dispatch({ type: 'SET_DROPPING', payload: point })}
                      className={classNames(
                        "w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between",
                        droppingPoint?.name === point.name
                          ? "bg-accent-50 border-accent-500 ring-1 ring-accent-500"
                          : "bg-white border-surface-200 hover:border-accent-300"
                      )}
                    >
                      <div>
                        <p className="text-sm font-bold text-surface-900">{point.name}</p>
                        <p className="text-[10px] text-surface-500 mt-1">{point.address}</p>
                      </div>
                      <span className="text-xs font-bold text-accent-500">{formatTime(point.time)}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar: Summary */}
          <aside className="lg:w-96">
            <BookingSummary 
              route={route} 
              selectedSeats={selectedSeats}
              onProceed={handleProceed}
            />
            
            <div className="mt-6 space-y-4">
              <div className="bg-green-50 p-4 rounded-xl flex items-center gap-3 border border-green-100">
                <ShieldCheck className="w-5 h-5 text-green-600" />
                <p className="text-[10px] text-green-700 font-medium leading-relaxed">
                  <span className="font-bold">Safe Journey!</span> We partner only with verified operators following all safety protocols.
                </p>
              </div>
              <div className="bg-surface-200/50 p-4 rounded-xl flex items-center gap-3 border border-surface-200">
                <Info className="w-5 h-5 text-surface-500" />
                <p className="text-[10px] text-surface-600 font-medium leading-relaxed">
                  <span className="font-bold">Cancellation:</span> Free cancellation until 4 hours before departure.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
