import api from './api'

export const bookingService = {
  createBooking: async (bookingData) => {
    const { data } = await api.post('/bookings', bookingData)
    return data
  },

  getMyBookings: async () => {
    const { data } = await api.get('/bookings/my')
    return data
  },

  getBookingById: async (id) => {
    const { data } = await api.get(`/bookings/${id}`)
    return data
  },

  cancelBooking: async (id) => {
    const { data } = await api.put(`/bookings/${id}/cancel`)
    return data
  },
}
