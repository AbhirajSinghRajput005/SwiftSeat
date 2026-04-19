import { useState, useEffect } from 'react'
import { 
  LayoutDashboard, Bus, Map as MapIcon, Users, Ticket, 
  Plus, Search, Filter, MoreVertical, Edit, Trash2, 
  TrendingUp, TrendingDown, Clock, CheckCircle, XCircle, AlertCircle
} from 'lucide-react'
import { adminService } from '../../services/adminService'
import { formatCurrency, formatDate, classNames } from '../../utils/helpers'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [data, setData] = useState({
    stats: null,
    users: [],
    bookings: [],
    buses: [],
    routes: [],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    setLoading(true)
    try {
      const stats = await adminService.getDashboard()
      const [users, bookings, buses, routes] = await Promise.all([
        adminService.getAllUsers(),
        adminService.getAllBookings(),
        adminService.getAllBuses(),
        adminService.getAllRoutes(),
      ])
      setData({ stats, users, bookings, buses, routes })
    } catch (err) {
      console.error('Failed to fetch admin data', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteBus = async (id) => {
    if (!window.confirm('Are you sure you want to delete this bus?')) return
    try {
      await adminService.deleteBus(id)
      fetchDashboardData()
    } catch (err) {
      alert('Failed to delete bus')
    }
  }

  return (
    <div className="flex min-h-screen bg-surface-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-surface-200 hidden lg:flex flex-col sticky top-16 h-[calc(100vh-64px)]">
        <div className="p-6">
          <p className="text-[10px] font-bold text-surface-400 uppercase tracking-widest mb-4">Main Menu</p>
          <nav className="space-y-1">
            <SidebarLink 
              icon={LayoutDashboard} 
              label="Overview" 
              active={activeTab === 'overview'} 
              onClick={() => setActiveTab('overview')} 
            />
            <SidebarLink 
              icon={Bus} 
              label="Buses" 
              active={activeTab === 'buses'} 
              onClick={() => setActiveTab('buses')} 
            />
            <SidebarLink 
              icon={MapIcon} 
              label="Routes" 
              active={activeTab === 'routes'} 
              onClick={() => setActiveTab('routes')} 
            />
            <SidebarLink 
              icon={Ticket} 
              label="Bookings" 
              active={activeTab === 'bookings'} 
              onClick={() => setActiveTab('bookings')} 
            />
            <SidebarLink 
              icon={Users} 
              label="Users" 
              active={activeTab === 'users'} 
              onClick={() => setActiveTab('users')} 
            />
          </nav>
        </div>
        
        <div className="mt-auto p-6 border-t border-surface-100">
           <div className="bg-brand-50 rounded-2xl p-4">
              <p className="text-xs font-bold text-brand-600 mb-1">System Health</p>
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                 <span className="text-[10px] font-medium text-brand-700 uppercase">All systems operational</span>
              </div>
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-surface-900 capitalize">{activeTab}</h1>
            <p className="text-surface-500 text-sm">Welcome back, Administrator</p>
          </div>
          <div className="flex items-center gap-3">
             <button className="btn-outline flex items-center gap-2 py-2 px-4 text-xs font-bold">
                <Search className="w-4 h-4" /> Global Search
             </button>
             <button className="btn-primary flex items-center gap-2 py-2 px-4 text-xs font-bold">
                <Plus className="w-4 h-4" /> Add New
             </button>
          </div>
        </header>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-brand-100 border-t-brand-500 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-8 animate-fade-in">
            {activeTab === 'overview' && <Overview stats={data.stats} bookings={data.bookings} />}
            {activeTab === 'buses' && <BusManagement buses={data.buses} onDelete={handleDeleteBus} />}
            {activeTab === 'routes' && <RouteManagement routes={data.routes} />}
            {activeTab === 'bookings' && <BookingManagement bookings={data.bookings} />}
            {activeTab === 'users' && <UserManagement users={data.users} />}
          </div>
        )}
      </main>
    </div>
  )
}

function SidebarLink({ icon: Icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={classNames(
        "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all",
        active 
          ? "bg-brand-500 text-white shadow-button shadow-brand-500/20" 
          : "text-surface-600 hover:bg-surface-100 hover:text-surface-900"
      )}
    >
      <Icon className="w-5 h-5" />
      {label}
    </button>
  )
}

function Overview({ stats, bookings }) {
  const cards = [
    { label: 'Total Revenue', value: formatCurrency(stats?.totalRevenue || 0), icon: TrendingUp, color: 'text-success bg-success-light' },
    { label: 'Active Bookings', value: stats?.activeBookings || 0, icon: Ticket, color: 'text-brand-500 bg-brand-50' },
    { label: 'Total Buses', value: stats?.totalBuses || 0, icon: Bus, color: 'text-accent-500 bg-accent-50' },
    { label: 'Registered Users', value: stats?.totalUsers || 0, icon: Users, color: 'text-orange-500 bg-orange-50' },
  ]

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, idx) => (
          <div key={idx} className="bg-white p-6 rounded-3xl border border-surface-200 shadow-sm flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${card.color}`}>
              <card.icon className="w-7 h-7" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-surface-400 uppercase tracking-widest">{card.label}</p>
              <h3 className="text-2xl font-extrabold text-surface-900">{card.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 bg-white rounded-3xl border border-surface-200 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-surface-100 flex justify-between items-center">
               <h3 className="font-bold text-surface-900">Recent Bookings</h3>
               <button className="text-xs font-bold text-brand-500">View All</button>
            </div>
            <div className="overflow-x-auto">
               <table className="w-full text-left">
                  <thead className="bg-surface-50">
                     <tr>
                        <th className="px-6 py-4 text-[10px] font-bold text-surface-400 uppercase">Booking ID</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-surface-400 uppercase">User</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-surface-400 uppercase">Route</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-surface-400 uppercase">Amount</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-surface-400 uppercase">Status</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-100">
                     {bookings.slice(0, 5).map(b => (
                        <tr key={b._id} className="hover:bg-surface-50 transition-colors">
                           <td className="px-6 py-4 text-xs font-bold text-surface-900 uppercase">{b.bookingId}</td>
                           <td className="px-6 py-4 text-xs font-medium text-surface-600">{b.user.name}</td>
                           <td className="px-6 py-4 text-xs font-medium text-surface-600">{b.route.from.city} → {b.route.to.city}</td>
                           <td className="px-6 py-4 text-xs font-bold text-surface-900">{formatCurrency(b.totalAmount)}</td>
                           <td className="px-6 py-4">
                              <span className={classNames(
                                 "text-[10px] font-bold px-2 py-1 rounded uppercase",
                                 b.status === 'confirmed' ? "bg-success-light text-success-dark" : "bg-error-light text-error"
                              )}>
                                 {b.status}
                              </span>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>

         <div className="bg-white rounded-3xl border border-surface-200 p-6 shadow-sm">
            <h3 className="font-bold text-surface-900 mb-6">Operator Performance</h3>
            <div className="space-y-6">
               {['SwiftLine', 'Horizon', 'Royal Cruiser'].map((op, i) => (
                  <div key={op} className="space-y-2">
                     <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-surface-700">{op}</span>
                        <span className="font-bold text-surface-900">{85 - i * 10}%</span>
                     </div>
                     <div className="w-full h-2 bg-surface-100 rounded-full overflow-hidden">
                        <div className="h-full bg-brand-500" style={{ width: `${85 - i * 10}%` }}></div>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  )
}

function BusManagement({ buses, onDelete }) {
  return (
    <div className="bg-white rounded-3xl border border-surface-200 overflow-hidden shadow-sm">
       <div className="p-6 border-b border-surface-100 flex justify-between items-center">
          <h3 className="font-bold text-surface-900">All Registered Buses</h3>
          <div className="flex items-center gap-3">
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                <input type="text" placeholder="Search bus..." className="pl-9 pr-4 py-2 bg-surface-50 border border-surface-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/20" />
             </div>
          </div>
       </div>
       <div className="overflow-x-auto">
          <table className="w-full text-left">
             <thead className="bg-surface-50">
                <tr>
                   <th className="px-6 py-4 text-[10px] font-bold text-surface-400 uppercase">Operator</th>
                   <th className="px-6 py-4 text-[10px] font-bold text-surface-400 uppercase">Bus Number</th>
                   <th className="px-6 py-4 text-[10px] font-bold text-surface-400 uppercase">Type</th>
                   <th className="px-6 py-4 text-[10px] font-bold text-surface-400 uppercase">Rating</th>
                   <th className="px-6 py-4 text-[10px] font-bold text-surface-400 uppercase text-right">Actions</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-surface-100">
                {buses.map(bus => (
                   <tr key={bus._id} className="hover:bg-surface-50 transition-colors">
                      <td className="px-6 py-4 text-xs font-bold text-surface-900">{bus.operator}</td>
                      <td className="px-6 py-4 text-xs font-medium text-surface-600">{bus.busNumber}</td>
                      <td className="px-6 py-4 text-xs font-medium text-surface-600">{bus.type}</td>
                      <td className="px-6 py-4">
                         <div className="flex items-center gap-1 text-xs font-bold text-green-600">
                            <Star className="w-3 h-3 fill-current" /> {bus.rating}
                         </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                         <div className="flex items-center justify-end gap-2">
                            <button className="p-2 hover:bg-brand-50 text-brand-500 rounded-lg transition-colors"><Edit className="w-4 h-4" /></button>
                            <button onClick={() => onDelete(bus._id)} className="p-2 hover:bg-error-light text-error rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                         </div>
                      </td>
                   </tr>
                ))}
             </tbody>
          </table>
       </div>
    </div>
  )
}

function RouteManagement({ routes }) { return <p className="p-10 text-center text-surface-400 italic">Route Management UI placeholder</p> }
function BookingManagement({ bookings }) { return <p className="p-10 text-center text-surface-400 italic">Booking Management UI placeholder</p> }
function UserManagement({ users }) { return <p className="p-10 text-center text-surface-400 italic">User Management UI placeholder</p> }

function Star({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
  )
}
