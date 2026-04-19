export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(dateStr) {
  if (!dateStr) return 'Select Date'
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return 'Invalid Date'
  return date.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function formatTime(timeStr) {
  if (!timeStr) return ''
  const [hours, mins] = timeStr.split(':')
  const h = parseInt(hours)
  const period = h >= 12 ? 'PM' : 'AM'
  const displayH = h % 12 || 12
  return `${displayH}:${mins} ${period}`
}

export function getMinDate() {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate())
  return tomorrow.toISOString().split('T')[0]
}

export function generateBookingId() {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '')
  const random = Math.random().toString(36).substring(2, 7).toUpperCase()
  return `SW-${date}-${random}`
}

export function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}
