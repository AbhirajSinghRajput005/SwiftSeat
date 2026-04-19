import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Mail, Phone, ShieldCheck, Lock, CreditCard, ChevronLeft, Loader2, Info } from 'lucide-react'
import { useBooking } from '../../context/BookingContext'
import { useAuth } from '../../context/AuthContext'
import BookingSummary from '../../components/BookingSummary/BookingSummary'
import { bookingService } from '../../services/bookingService'

export default function Checkout() {
  const navigate = useNavigate()
  const { selectedRoute, selectedBus, selectedSeats, boardingPoint, droppingPoint, dispatch } = useBooking()
  const { user } = useAuth()
  
  const [passengers, setPassengers] = useState(
    (selectedSeats || []).map(seat => ({ name: '', age: '', gender: 'Male', seatId: seat.id }))
  )
  const [contactInfo, setContactInfo] = useState({
    email: user?.email || '',
    phone: user?.phone || '',
  })
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!selectedRoute || selectedSeats.length === 0) {
      navigate('/')
    }
  }, [selectedRoute, selectedSeats, navigate])

  const handlePassengerChange = (index, field, value) => {
    const updated = [...passengers]
    updated[index][field] = value
    setPassengers(updated)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setProcessing(true)
    setError('')

    try {
      const subtotal = selectedSeats.reduce((sum, seat) => sum + seat.price, 0)
      const totalAmount = subtotal + Math.round(subtotal * 0.05)

      const bookingData = {
        routeId: selectedRoute._id,
        busId: selectedBus._id,
        seats: selectedSeats.map(s => s.id),
        passengers: passengers.map(p => ({ 
          ...p, 
          age: parseInt(p.age) || 0 
        })),
        boardingPoint: { name: boardingPoint.name, time: boardingPoint.time },
        droppingPoint: { name: droppingPoint.name, time: droppingPoint.time },
        contactEmail: contactInfo.email,
        contactPhone: contactInfo.phone,
        totalAmount,
      }

      const result = await bookingService.createBooking(bookingData)
      
      // Simulate payment delay
      setTimeout(() => {
        setProcessing(false)
        // Clear booking state AFTER navigation
        dispatch({ type: 'RESET' })
        navigate(`/confirmation/${result.bookingId}`)
      }, 2000)
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong while booking.')
      setProcessing(false)
    }
  }

  if (!selectedRoute && !processing) return null

  return (
    <div className="bg-surface-50 min-h-screen pb-20">
      <div className="bg-white border-b border-surface-200 py-6">
        <div className="section-container flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-surface-100 rounded-full text-surface-600">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-extrabold text-surface-900">Passenger Details</h1>
        </div>
      </div>

      <div className="section-container py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 space-y-8">
            <form id="checkout-form" onSubmit={handleSubmit} className="space-y-8">
              {/* Passenger Forms */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <User className="w-5 h-5 text-brand-500" />
                  <h3 className="font-bold text-surface-900">Passenger Information</h3>
                </div>
                
                {passengers.map((p, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-2xl border border-surface-200 animate-fade-in-up" style={{ animationDelay: `${idx * 0.1}s` }}>
                    <div className="flex items-center gap-2 mb-6 pb-4 border-b border-surface-100">
                      <span className="w-6 h-6 bg-brand-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold">
                        {idx + 1}
                      </span>
                      <h4 className="font-bold text-surface-800">Passenger for Seat {p.seatId}</h4>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                      <div className="md:col-span-6 space-y-1">
                        <label className="text-xs font-bold text-surface-500 uppercase tracking-widest ml-1">Full Name</label>
                        <input
                          type="text"
                          required
                          className="input-field"
                          placeholder="As on ID card"
                          value={p.name}
                          onChange={(e) => handlePassengerChange(idx, 'name', e.target.value)}
                        />
                      </div>
                      <div className="md:col-span-2 space-y-1">
                        <label className="text-xs font-bold text-surface-500 uppercase tracking-widest ml-1">Age</label>
                        <input
                          type="number"
                          required
                          min="1"
                          max="120"
                          className="input-field"
                          placeholder="Age"
                          value={p.age}
                          onChange={(e) => handlePassengerChange(idx, 'age', e.target.value)}
                        />
                      </div>
                      <div className="md:col-span-4 space-y-1">
                        <label className="text-xs font-bold text-surface-500 uppercase tracking-widest ml-1">Gender</label>
                        <select
                          className="input-field cursor-pointer"
                          value={p.gender}
                          onChange={(e) => handlePassengerChange(idx, 'gender', e.target.value)}
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Contact Info */}
              <div className="bg-white p-8 rounded-2xl border border-surface-200">
                <div className="flex items-center gap-3 mb-6">
                  <Phone className="w-5 h-5 text-brand-500" />
                  <h3 className="font-bold text-surface-900">Contact Information</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-surface-500 uppercase tracking-widest ml-1">Email Address</label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400 group-focus-within:text-brand-500" />
                      <input
                        type="email"
                        required
                        className="input-field pl-12"
                        placeholder="name@example.com"
                        value={contactInfo.email}
                        onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-surface-500 uppercase tracking-widest ml-1">Phone Number</label>
                    <div className="relative group">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400 group-focus-within:text-brand-500" />
                      <input
                        type="tel"
                        required
                        className="input-field pl-12"
                        placeholder="9876543210"
                        value={contactInfo.phone}
                        onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-surface-50 rounded-xl flex items-center gap-3 text-xs text-surface-600">
                  <Info className="w-4 h-4 text-brand-500 flex-shrink-0" />
                  <p>Your ticket details will be sent to this email and phone number.</p>
                </div>
              </div>

              {/* Payment Mock */}
              <div className="bg-white p-8 rounded-2xl border border-surface-200">
                <div className="flex items-center gap-3 mb-6">
                  <CreditCard className="w-5 h-5 text-brand-500" />
                  <h3 className="font-bold text-surface-900">Payment Method</h3>
                </div>
                
                <div className="p-6 border-2 border-brand-100 bg-brand-50 rounded-2xl flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center">
                         <CreditCard className="w-6 h-6 text-brand-500" />
                      </div>
                      <div>
                         <p className="font-bold text-surface-900">Safe Payment Simulation</p>
                         <p className="text-xs text-surface-500">Secure transaction via SwiftPay Gateway</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-1 text-green-600 font-bold text-xs">
                      <Lock className="w-3 h-3" /> Encrypted
                   </div>
                </div>
                
                {error && (
                   <p className="mt-4 text-sm text-error font-medium flex items-center gap-2 animate-bounce-soft">
                      <ShieldCheck className="w-4 h-4" /> {error}
                   </p>
                )}
              </div>
            </form>
          </div>

          <aside className="lg:w-96">
            <BookingSummary 
              route={selectedRoute} 
              selectedSeats={selectedSeats}
              onProceed={() => document.getElementById('checkout-form').requestSubmit()}
              loading={processing}
            />
          </aside>
        </div>
      </div>

      {/* Loading Overlay */}
      {processing && (
        <div className="fixed inset-0 z-[100] bg-white/90 backdrop-blur-md flex flex-col items-center justify-center animate-fade-in">
           <div className="relative">
              <div className="w-24 h-24 border-4 border-brand-100 border-t-brand-500 rounded-full animate-spin"></div>
              <Bus className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-brand-500 animate-pulse" />
           </div>
           <h2 className="mt-8 text-2xl font-bold text-surface-900">Processing Payment...</h2>
           <p className="mt-2 text-surface-500">Please do not refresh the page or click back.</p>
        </div>
      )}
    </div>
  )
}
