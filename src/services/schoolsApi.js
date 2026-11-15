const API_URL = 'https://moz-schools-api.vercel.app/api/mz/schools'

function firstValue(...values) {
  return values.find((value) => value !== undefined && value !== null && value !== '')
}

function asText(value, fallback = '') {
  if (typeof value === 'string' || typeof value === 'number') return String(value)
  return fallback
}

function coordinatesFrom(record) {
  const coordinates = record.coordinates ?? record.location?.coordinates ?? record.geometry?.coordinates
  const latitude = Number(firstValue(record.latitude, record.lat, record.location?.latitude, record.location?.lat, coordinates?.[1]))
  const longitude = Number(firstValue(record.longitude, record.lon, record.lng, record.location?.longitude, record.location?.lng, coordinates?.[0]))
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude) || Math.abs(latitude) > 90 || Math.abs(longitude) > 180) return null
  return { latitude, longitude }
}

function normalizeSchool(record, index) {
  if (!record || typeof record !== 'object') return null
  const name = asText(firstValue(record.name, record.school_name, record.schoolName, record.nome, record.school), '').trim()
  if (!name) return null

  const type = asText(firstValue(record.type, record.school_type, record.schoolType, record.tipo), 'Não especificado')
  const level = asText(firstValue(record.level, record.education_level, record.educationLevel, record.nivel, record.nível), type)
  const province = asText(firstValue(record.province, record.provincia, record.província, record.province_name, record.provinceName, record.location?.province), 'Não indicada')
  const district = asText(firstValue(record.district, record.distrito, record.district_name, record.districtName, record.location?.district), 'Não indicado')
  const coordinates = coordinatesFrom(record)
  const id = asText(firstValue(record.id, record._id, record.code, record.codigo), `school-${index}`)

  return {
    ...record,
    id,
    name,
    province,
    district,
    level,
    type,
    address: asText(firstValue(record.address, record.endereco, record.endereço, record.location?.address), ''),
    description: asText(firstValue(record.description, record.descricao, record.descrição), ''),
    icon: /secund|secondary|high/i.test(level) ? 'bi-mortarboard' : 'bi-book',
    ...(coordinates ?? {}),
  }
}

function extractRecords(payload) {
  if (Array.isArray(payload)) return payload
  for (const key of ['schools', 'data', 'results', 'items', 'institutions', 'escolas']) {
    if (Array.isArray(payload?.[key])) return payload[key]
    if (Array.isArray(payload?.data?.[key])) return payload.data[key]
  }
  throw new Error('A API respondeu, mas o formato da lista de escolas não é reconhecido.')
}

export async function fetchSchools() {
  let response
  try {
    response = await fetch(API_URL, { headers: { Accept: 'application/json' } })
  } catch (cause) {
    if (cause instanceof TypeError) {
      throw new Error('Não foi possível aceder à API a partir do navegador. Verifique a disponibilidade do serviço e a configuração de CORS.')
    }
    throw cause
  }
  if (!response.ok) {
    throw new Error(`Não foi possível carregar as escolas (erro HTTP ${response.status}).`)
  }

  let payload
  try {
    payload = await response.json()
  } catch {
    throw new Error('A API de escolas devolveu uma resposta que não é JSON válido.')
  }

  const schools = extractRecords(payload)
    .map(normalizeSchool)
    .filter(Boolean)

  if (schools.length === 0) {
    throw new Error('A API não devolveu instituições com nomes reconhecíveis.')
  }

  return schools
}

export const schoolsApiUrl = API_URL
