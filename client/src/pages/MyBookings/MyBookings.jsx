import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Ticket as TicketIcon, Calendar, MapPin, ChevronRight, AlertCircle, Loader2, Search, XCircle } from 'lucide-react'
import { bookingService } from '../../services/bookingService'
import { formatCurrency, formatDate, formatTime, classNames } from '../../utils/helpers'

export default function MyBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('upcoming') // 'upcoming', 'past', 'cancelled'

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    setLoading(true)
    try {
      const data = await bookingService.getMyBookings()
      setBookings(data)
    } catch (err) {
      console.error('Failed to fetch bookings', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return
    
    try {
      await bookingService.cancelBooking(id)
      fetchBookings()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel booking')
    }
  }

  const filteredBookings = bookings.filter(b => {
    const travelDate = new Date(b.route.date)
    const now = new Date()
    now.setHours(0, 0, 0, 0)
    
    if (b.status === 'cancelled') return activeTab === 'cancelled'
    if (travelDate >= now) return activeTab === 'upcoming'
    return activeTab === 'past'
  })

  return (
    <div className="bg-surface-100 min-h-screen pb-20">
      <div className="bg-white border-b border-surface-200 py-10">
        <div className="section-container">
          <h1 className="text-3xl font-extrabold text-surface-900 mb-6">My Bookings</h1>
          
          {/* Tabs */}
          <div className="flex gap-1 p-1 bg-surface-100 rounded-2xl w-fit">
            <TabButton 
              active={activeTab === 'upcoming'} 
              onClick={() => setActiveTab('upcoming')}
              label="Upcoming" 
              count={bookings.filter(b => b.status !== 'cancelled' && new Date(b.route.date) >= new Date().setHours(0,0,0,0)).length}
            />
            <TabButton 
              active={activeTab === 'past'} 
              onClick={() => setActiveTab('past')}
              label="Completed" 
              count={bookings.filter(b => b.status !== 'cancelled' && new Date(b.route.date) < new Date().setHours(0,0,0,0)).length}
            />
            <TabButton 
              active={activeTab === 'cancelled'} 
              onClick={() => setActiveTab('cancelled')}
              label="Cancelled" 
              count={bookings.filter(b => b.status === 'cancelled').length}
            />
          </div>
        </div>
      </div>

      <div className="section-container py-12">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-brand-500 animate-spin mb-4" />
            <p className="text-surface-500 font-bold">Loading your journeys...</p>
          </div>
        ) : filteredBookings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredBookings.map(booking => (
              <BookingCard 
                key={booking._id} 
                booking={booking} 
                onCancel={() => handleCancel(booking._id)} 
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[2rem] p-20 text-center border border-surface-200 animate-fade-in shadow-sm">
            <div className="w-20 h-20 bg-surface-100 rounded-full flex items-center justify-center mx-auto mb-6">
               <TicketIcon className="w-10 h-10 text-surface-300" />
            </div>
            <h3 className="text-2xl font-bold text-surface-900 mb-2">No {activeTab} bookings</h3>
            <p className="text-surface-500 mb-8">You haven't made any bookings in this category yet.</p>
            <Link to="/" className="btn-primary inline-flex items-center gap-2">
              <Search className="w-4 h-4" /> Plan a Trip
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

function TabButton({ active, onClick, label, count }) {
  return (
    <button
      onClick={onClick}
      className={classNames(
        "px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2",
        active ? "bg-white shadow-sm text-brand-500" : "text-surface-500 hover:text-surface-700 hover:bg-white/50"
      )}
    >
      {label}
      {count > 0 && (
        <span className={classNames(
          "w-5 h-5 rounded-full flex items-center justify-center text-[10px]",
          active ? "bg-brand-500 text-white" : "bg-surface-200 text-surface-600"
        )}>
          {count}
        </span>
      )}
    </button>
  )
}

function BookingCard({ booking, onCancel }) {
  const { route, bus, seats, status, bookingId, totalAmount } = booking
  const isPast = new Date(route.date) < new Date().setHours(0,0,0,0)
  const isCancelled = status === 'cancelled'

  return (
    <div className="bg-white rounded-[2rem] border border-surface-200 overflow-hidden shadow-sm hover:shadow-card transition-all flex flex-col group animate-fade-in-up">
      <div className="p-6 md:p-8 flex-1">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center text-brand-500">
                <BusIcon />
             </div>
             <div>
                <h4 className="font-bold text-surface-900">{bus.operator}</h4>
                <p className="text-[10px] text-surface-500 font-bold uppercase tracking-wider">{bus.type}</p>
             </div>
          </div>
          <span className={classNames(
            "badge font-bold px-3 py-1",
            isCancelled ? "bg-error-light/50 text-error" : isPast ? "bg-surface-100 text-surface-600" : "bg-success-light text-success-dark"
          )}>
            {status.toUpperCase()}
          </span>
        </div>

        <div className="flex items-center justify-between mb-8 bg-surface-50 p-4 rounded-2xl">
           <div className="text-center flex-1">
              <p className="text-[10px] font-bold text-surface-400 uppercase tracking-widest mb-1">From</p>
              <p className="font-bold text-surface-900">{route.from.city}</p>
              <p className="text-xs text-brand-500 font-bold">{formatTime(route.departureTime)}</p>
           </div>
           <div className="px-4 flex flex-col items-center text-surface-300">
              <ChevronRight className="w-6 h-6" />
           </div>
           <div className="text-center flex-1">
              <p className="text-[10px] font-bold text-surface-400 uppercase tracking-widest mb-1">To</p>
              <p className="font-bold text-surface-900">{route.to.city}</p>
              <p className="text-xs text-accent-500 font-bold">{formatTime(route.arrivalTime)}</p>
           </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
           <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-surface-400" />
              <span className="text-xs font-bold text-surface-700">{formatDate(route.date)}</span>
           </div>
           <div className="flex items-center gap-2">
              <TicketIcon className="w-4 h-4 text-surface-400" />
              <span className="text-xs font-bold text-surface-700">{seats.join(', ')}</span>
           </div>
        </div>
      </div>

      <div className="bg-surface-50 p-4 border-t border-surface-100 flex items-center justify-between">
         <div className="text-xs font-bold text-surface-400">
            ID: <span className="text-surface-700 uppercase tracking-tight">{bookingId}</span>
         </div>
         <div className="flex items-center gap-3">
            {!isCancelled && !isPast && (
              <button 
                onClick={onCancel}
                className="text-xs font-bold text-error hover:underline flex items-center gap-1"
              >
                <XCircle className="w-3 h-3" /> Cancel
              </button>
            )}
            <Link 
              to={isCancelled ? '#' : `/confirmation/${bookingId}`}
              className={classNames(
                "text-xs font-bold flex items-center gap-1 transition-all",
                isCancelled ? "text-surface-300 cursor-not-allowed" : "text-brand-500 hover:gap-2"
              )}
            >
              {isCancelled ? 'Details Unavailable' : 'View Ticket'} <ChevronRight className="w-4 h-4" />
            </Link>
         </div>
      </div>
    </div>
  )
}

function BusIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-1.1 0-2 .9-2 2v7c0 1.1.9 2 2 2h10"/><circle cx="7" cy="17" r="2"/><circle cx="15" cy="17" r="2"/><path d="M10 10v4"/><path d="M5 10h5"/><path d="M2 10v5"/></svg>
  )
}
