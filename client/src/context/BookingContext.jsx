import { createContext, useContext, useReducer } from 'react'

const BookingContext = createContext()

const initialState = {
  searchParams: { from: '', to: '', date: '' },
  selectedRoute: null,
  selectedBus: null,
  selectedSeats: [],
  passengers: [],
  boardingPoint: null,
  droppingPoint: null,
  totalAmount: 0,
}

function bookingReducer(state, action) {
  switch (action.type) {
    case 'SET_SEARCH':
      return { ...state, searchParams: action.payload }
    case 'SET_ROUTE':
      return { ...state, selectedRoute: action.payload }
    case 'SET_BUS':
      return { ...state, selectedBus: action.payload }
    case 'SET_SEATS':
      return { ...state, selectedSeats: action.payload }
    case 'TOGGLE_SEAT': {
      const seatId = action.payload
      const exists = state.selectedSeats.find(s => s.id === seatId.id)
      const seats = exists
        ? state.selectedSeats.filter(s => s.id !== seatId.id)
        : [...state.selectedSeats, seatId]
      return { ...state, selectedSeats: seats }
    }
    case 'SET_PASSENGERS':
      return { ...state, passengers: action.payload }
    case 'SET_BOARDING':
      return { ...state, boardingPoint: action.payload }
    case 'SET_DROPPING':
      return { ...state, droppingPoint: action.payload }
    case 'SET_TOTAL':
      return { ...state, totalAmount: action.payload }
    case 'RESET':
      return initialState
    default:
      return state
  }
}

export function BookingProvider({ children }) {
  const [state, dispatch] = useReducer(bookingReducer, initialState)

  const value = { ...state, dispatch }

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
}

export const useBooking = () => {
  const context = useContext(BookingContext)
  if (!context) throw new Error('useBooking must be used within BookingProvider')
  return context
}
