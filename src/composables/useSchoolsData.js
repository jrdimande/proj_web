import { ref } from 'vue'
import { fetchSchools } from '../services/schoolsApi'

const schools = ref([])
const loading = ref(false)
const error = ref('')
let loaded = false
let request = null

export function useSchoolsData() {
  async function loadSchools({ refresh = false } = {}) {
    if (request) return request
    if (loaded && !refresh) return schools.value

    loading.value = true
    error.value = ''
    request = fetchSchools()
      .then((items) => {
        schools.value = items
        loaded = true
        return items
      })
      .catch((cause) => {
        error.value = cause instanceof Error ? cause.message : 'Ocorreu um erro ao carregar as escolas.'
        throw cause
      })
      .finally(() => {
        loading.value = false
        request = null
      })

    return request
  }

  return { schools, loading, error, loadSchools }
}
