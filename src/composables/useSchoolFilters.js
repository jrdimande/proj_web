import { computed, isRef, ref } from 'vue'

export function useSchoolFilters(schools, pageSize = 6) {
  const schoolItems = computed(() => isRef(schools) ? schools.value : schools)
  const search = ref('')
  const province = ref('')
  const district = ref('')
  const level = ref('')
  const page = ref(1)

  const districts = computed(() => {
    const source = province.value
      ? schoolItems.value.filter((school) => school.province === province.value)
      : schoolItems.value
    return [...new Set(source.map((school) => school.district))].sort()
  })

  const filteredSchools = computed(() => {
    const query = search.value.trim().toLocaleLowerCase('pt')
    return schoolItems.value.filter((school) => {
      const matchesSearch = !query || [school.name, school.province, school.district]
        .some((value) => value.toLocaleLowerCase('pt').includes(query))
      return matchesSearch
        && (!province.value || school.province === province.value)
        && (!district.value || school.district === district.value)
        && (!level.value || school.level === level.value)
    })
  })

  const pageCount = computed(() => Math.max(1, Math.ceil(filteredSchools.value.length / pageSize)))
  const paginatedSchools = computed(() => {
    const start = (page.value - 1) * pageSize
    return filteredSchools.value.slice(start, start + pageSize)
  })

  function setProvince(value) {
    province.value = value
    district.value = ''
    page.value = 1
  }

  function resetFilters() {
    search.value = ''
    province.value = ''
    district.value = ''
    level.value = ''
    page.value = 1
  }

  return { search, province, district, level, page, districts, filteredSchools, paginatedSchools, pageCount, setProvince, resetFilters }
}
