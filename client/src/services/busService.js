import api from './api'

export const busService = {
  getCities: async () => {
    const { data } = await api.get('/buses/cities')
    return data
  },

  searchBuses: async (from, to, date) => {
    const { data } = await api.get('/buses/search', { params: { from, to, date } })
    return data
  },

  getBusDetails: async (id) => {
    const { data } = await api.get(`/buses/${id}`)
    return data
  },

  getRouteDetails: async (id) => {
    const { data } = await api.get(`/buses/route/${id}`)
    return data
  },
}
