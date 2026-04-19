import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { CheckCircle, ArrowRight, Download, Printer, Home } from 'lucide-react'
import Ticket from '../../components/Ticket/Ticket'
import { bookingService } from '../../services/bookingService'

export default function Confirmation() {
  const { bookingId } = useParams()
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const data = await bookingService.getBookingById(bookingId)
        setBooking(data)
      } catch (err) {
        console.error('Failed to load booking details.')
      } finally {
        setLoading(false)
      }
    }
    fetchBooking()
  }, [bookingId])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="w-10 h-10 border-4 border-brand-100 border-t-brand-500 rounded-full animate-spin" />
      </div>
    )
  }

  if (!booking) return null

  return (
    <div className="bg-surface-50 min-h-screen pb-24">
      {/* Success Celebration Header */}
      <div className="bg-white border-b border-surface-200 py-16 text-center">
        <div className="section-container">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6 animate-check-mark">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-surface-900 mb-4 animate-fade-in-up">
            Booking Confirmed!
          </h1>
          <p className="text-surface-600 text-lg max-w-xl mx-auto animate-fade-in-up stagger-1">
            Your journey with <span className="font-bold text-surface-900">{booking.bus.operator}</span> is confirmed. 
            A confirmation has been sent to <span className="text-brand-500 font-bold">{booking.contactEmail}</span>.
          </p>
        </div>
      </div>

      <div className="section-container mt-[-40px] relative z-10">
        <div className="animate-fade-in-up stagger-2">
          <Ticket booking={booking} />
        </div>

        {/* Next Steps */}
        <div className="max-w-3xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-up stagger-3">
          <Link to="/my-bookings" className="group bg-white p-8 rounded-3xl border border-surface-200 shadow-card hover:border-brand-500 transition-all flex items-center justify-between">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-surface-100 rounded-2xl flex items-center justify-center text-surface-600 group-hover:bg-brand-50 group-hover:text-brand-500 transition-colors">
                  <Printer className="w-6 h-6" />
               </div>
               <div>
                  <h3 className="font-bold text-surface-900">Manage Booking</h3>
                  <p className="text-xs text-surface-500">View, print or cancel your ticket</p>
               </div>
            </div>
            <ArrowRight className="w-5 h-5 text-surface-300 group-hover:text-brand-500 group-hover:translate-x-1 transition-all" />
          </Link>

          <Link to="/" className="group bg-white p-8 rounded-3xl border border-surface-200 shadow-card hover:border-accent-500 transition-all flex items-center justify-between">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-surface-100 rounded-2xl flex items-center justify-center text-surface-600 group-hover:bg-accent-50 group-hover:text-accent-500 transition-colors">
                  <Home className="w-6 h-6" />
               </div>
               <div>
                  <h3 className="font-bold text-surface-900">Book Another</h3>
                  <p className="text-xs text-surface-500">Start planning your next trip</p>
               </div>
            </div>
            <ArrowRight className="w-5 h-5 text-surface-300 group-hover:text-accent-500 group-hover:translate-x-1 transition-all" />
          </Link>
        </div>
      </div>

      {/* Confetti Celebration Simulation */}
      <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <div 
            key={i}
            className="absolute animate-confetti opacity-0"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              backgroundColor: ['#ff4d3d', '#1565C0', '#27AE60', '#F39C12'][Math.floor(Math.random() * 4)],
              width: `${Math.random() * 8 + 4}px`,
              height: `${Math.random() * 8 + 4}px`,
              borderRadius: Math.random() > 0.5 ? '50%' : '2px',
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${Math.random() * 2 + 1}s`
            }}
          />
        ))}
      </div>
    </div>
  )
}
