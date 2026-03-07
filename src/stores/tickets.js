import { defineStore } from 'pinia'
import { ref } from 'vue'

const API_URL = import.meta.env.VITE_APP_API_ENDPOINT || 'https://www.jasonbstanding.com/wp-json/jbs/v2/tickets'

export const useTicketsStore = defineStore('tickets', () => {
  const tickets = ref([])
  const loading = ref(false)
  const error = ref(null)

  async function fetchTickets() {
    if (tickets.value.length > 0) return
    loading.value = true
    error.value = null
    try {
      const res = await fetch(API_URL)
      if (!res.ok) throw new Error(`API error: HTTP ${res.status}`)
      tickets.value = await res.json()
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  return { tickets, loading, error, fetchTickets }
})
