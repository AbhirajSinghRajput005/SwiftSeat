import { QRCodeSVG } from 'qrcode.react'
import { Bus, MapPin, Calendar, Clock, User, Phone, CheckCircle, Download, Share2 } from 'lucide-react'
import { formatCurrency, formatTime, formatDate } from '../../utils/helpers'

export default function Ticket({ booking }) {
  const { route, bus, seats, passengers, boardingPoint, droppingPoint, totalAmount, bookingId } = booking

  return (
    <div className="max-w-3xl mx-auto">
      {/* Action Buttons */}
      <div className="flex justify-end gap-3 mb-6 no-print">
        <button className="btn-outline flex items-center gap-2 py-2 px-4 text-xs font-bold" onClick={() => window.print()}>
          <Download className="w-4 h-4" /> Download Ticket
        </button>
        <button className="btn-outline flex items-center gap-2 py-2 px-4 text-xs font-bold">
          <Share2 className="w-4 h-4" /> Share
        </button>
      </div>

      {/* Ticket Container */}
      <div className="bg-white rounded-3xl shadow-elevated border border-surface-200 overflow-hidden flex flex-col md:flex-row print:shadow-none print:border">
        {/* Main Content */}
        <div className="flex-[2] p-8 md:p-10 border-b md:border-b-0 md:border-r border-dashed border-surface-300 relative">
          {/* Brand Header */}
          <div className="flex justify-between items-start mb-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Bus className="w-6 h-6 text-brand-500" />
                <span className="font-heading font-extrabold text-xl tracking-tight">Swift<span className="text-brand-500">Seat</span></span>
              </div>
              <p className="text-[10px] font-bold text-surface-400 uppercase tracking-widest">Digital Boarding Pass</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-surface-400 uppercase tracking-widest mb-1">Booking ID</p>
              <p className="text-sm font-bold text-surface-900">{bookingId}</p>
            </div>
          </div>

          {/* Route Info */}
          <div className="flex items-center justify-between mb-10 bg-surface-50 p-6 rounded-2xl">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-surface-400 uppercase mb-1">From</span>
              <span className="text-xl font-extrabold text-surface-900">{route.from.city}</span>
              <span className="text-sm font-bold text-brand-500 mt-1">{formatTime(route.departureTime)}</span>
            </div>
            
            <div className="flex flex-col items-center flex-1 px-4">
              <Bus className="w-5 h-5 text-surface-300 mb-1" />
              <div className="w-full h-px border-t-2 border-dashed border-surface-200 relative">
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2">
                    <span className="text-[10px] font-bold text-surface-400 uppercase tracking-widest">{route.duration}</span>
                 </div>
              </div>
              <span className="text-[10px] text-surface-400 font-medium mt-1">{formatDate(route.date)}</span>
            </div>

            <div className="flex flex-col text-right">
              <span className="text-xs font-bold text-surface-400 uppercase mb-1">To</span>
              <span className="text-xl font-extrabold text-surface-900">{route.to.city}</span>
              <span className="text-sm font-bold text-accent-500 mt-1">{formatTime(route.arrivalTime)}</span>
            </div>
          </div>

          {/* Bus & Seats */}
          <div className="grid grid-cols-2 gap-8 mb-10">
            <div>
              <p className="text-[10px] font-bold text-surface-400 uppercase tracking-widest mb-2">Bus Details</p>
              <p className="text-sm font-bold text-surface-900">{bus.operator}</p>
              <p className="text-xs text-surface-500 mt-0.5">{bus.type}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-surface-400 uppercase tracking-widest mb-2">Seat Numbers</p>
              <div className="flex flex-wrap gap-1">
                {seats.map(s => (
                  <span key={s} className="bg-brand-50 text-brand-600 px-2 py-0.5 rounded font-bold text-sm border border-brand-100">{s}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Points */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex gap-3">
              <MapPin className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] font-bold text-surface-400 uppercase tracking-widest mb-1">Boarding At</p>
                <p className="text-xs font-bold text-surface-900">{boardingPoint.name}</p>
                <p className="text-[10px] text-surface-500 mt-0.5">{boardingPoint.time}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <MapPin className="w-4 h-4 text-accent-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] font-bold text-surface-400 uppercase tracking-widest mb-1">Dropping At</p>
                <p className="text-xs font-bold text-surface-900">{droppingPoint.name}</p>
                <p className="text-[10px] text-surface-500 mt-0.5">{droppingPoint.time}</p>
              </div>
            </div>
          </div>

          {/* Passenger List */}
          <div className="mt-10 pt-6 border-t border-surface-100">
             <p className="text-[10px] font-bold text-surface-400 uppercase tracking-widest mb-4">Passengers</p>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {passengers.map((p, i) => (
                  <div key={i} className="flex items-center gap-3 text-xs">
                     <div className="w-6 h-6 bg-surface-100 rounded-full flex items-center justify-center text-surface-600 font-bold">{i+1}</div>
                     <span className="font-bold text-surface-900">{p.name}</span>
                     <span className="text-surface-500">({p.age}, {p.gender})</span>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Side Bar (Stub) */}
        <div className="flex-1 bg-surface-50 p-8 flex flex-col items-center justify-between relative overflow-hidden">
           {/* Perforated edge circles */}
           <div className="hidden md:block absolute left-0 top-0 bottom-0 w-4 ticket-edge -ml-2"></div>
           
           <div className="text-center w-full">
              <div className="bg-white p-4 rounded-2xl shadow-sm inline-block mb-6 border border-surface-200">
                 <QRCodeSVG value={bookingId} size={120} />
              </div>
              <p className="text-[10px] font-bold text-surface-400 uppercase tracking-widest mb-1">Scan for Boarding</p>
              <p className="text-xs font-bold text-surface-900">Show this QR to the Driver</p>
           </div>

           <div className="w-full space-y-4 pt-10 mt-10 border-t border-surface-200">
              <div className="flex justify-between items-center">
                 <span className="text-[10px] font-bold text-surface-400 uppercase tracking-widest">Amount Paid</span>
                 <span className="text-lg font-extrabold text-brand-500">{formatCurrency(totalAmount)}</span>
              </div>
              <div className="flex items-center gap-2 text-green-600 font-bold text-[10px] justify-center bg-green-50 py-2 rounded-lg">
                 <CheckCircle className="w-3 h-3" /> VERIFIED PAYMENT
              </div>
           </div>
        </div>
      </div>
    </div>
  )
}
