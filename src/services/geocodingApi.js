const PHOTON_URL = 'https://photon.komoot.io/api/'
const geocodingCache = new Map()

function normalizedName(value) {
  return value.toLocaleLowerCase('pt').normalize('NFD').replace(/\p{Diacritic}/gu, '').replace(/[^\p{L}\p{N}\s]/gu, '').replace(/\s+/g, ' ').trim()
}

export async function findSchoolCoordinates(school) {
  if (Number.isFinite(school.latitude) && Number.isFinite(school.longitude)) {
    return { latitude: school.latitude, longitude: school.longitude, source: 'api' }
  }

  const query = [school.name, school.district, school.province, 'Moçambique'].filter(Boolean).join(', ')
  if (geocodingCache.has(query)) return geocodingCache.get(query)

  const url = new URL(PHOTON_URL)
  url.searchParams.set('q', query)
  url.searchParams.set('limit', '5')
  url.searchParams.set('lang', 'pt')

  const response = await fetch(url)
  if (!response.ok) throw new Error(`O serviço de pesquisa geográfica respondeu com erro HTTP ${response.status}.`)

  const result = await response.json()
  const feature = result.features?.find((item) => {
    const properties = item.properties ?? {}
    const schoolName = normalizedName(school.name)
    const resultName = normalizedName(properties.name ?? '')
    const nameMatches = resultName === schoolName
      || (resultName.length >= schoolName.length * 0.6 && schoolName.includes(resultName))
      || (schoolName.length >= resultName.length * 0.6 && resultName.includes(schoolName))
    const isMozambique = properties.countrycode?.toLowerCase() === 'mz'
      || /moçambique|mozambique/i.test(properties.country ?? '')
    return nameMatches && isMozambique
  })

  if (!feature) {
    geocodingCache.set(query, null)
    return null
  }

  const [longitude, latitude] = feature.geometry.coordinates
  const coordinates = { latitude, longitude, source: 'openstreetmap' }
  geocodingCache.set(query, coordinates)
  return coordinates
}
