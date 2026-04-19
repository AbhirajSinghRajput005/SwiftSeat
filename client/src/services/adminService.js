import api from './api'

export const adminService = {
  getDashboard: async () => {
    const { data } = await api.get('/admin/dashboard')
    return data
  },

  getAllUsers: async () => {
    const { data } = await api.get('/admin/users')
    return data
  },

  getAllBookings: async () => {
    const { data } = await api.get('/admin/bookings')
    return data
  },

  getAllBuses: async () => {
    const { data } = await api.get('/admin/buses')
    return data
  },

  addBus: async (busData) => {
    const { data } = await api.post('/admin/buses', busData)
    return data
  },

  updateBus: async (id, busData) => {
    const { data } = await api.put(`/admin/buses/${id}`, busData)
    return data
  },

  deleteBus: async (id) => {
    const { data } = await api.delete(`/admin/buses/${id}`)
    return data
  },

  getAllRoutes: async () => {
    const { data } = await api.get('/admin/routes')
    return data
  },

  addRoute: async (routeData) => {
    const { data } = await api.post('/admin/routes', routeData)
    return data
  },

  updateRoute: async (id, routeData) => {
    const { data } = await api.put(`/admin/routes/${id}`, routeData)
    return data
  },

  deleteRoute: async (id) => {
    const { data } = await api.delete(`/admin/routes/${id}`)
    return data
  },
}
