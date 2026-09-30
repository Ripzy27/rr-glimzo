export const DOMESTIC_SERVICES = [
  'Regular domestic cleaning',
  'End of tenancy cleaning',
  'Deep cleaning',
  'Carpet cleaning',
  'After-building cleaning',
  'Eco-friendly cleaning',
  'One-off cleaning',
  'Housekeeping',
  'Ironing',
  'Upholstery cleaning',
  'Mattress cleaning',
  'Several services / advice needed',
] as const

export type DomesticService = (typeof DOMESTIC_SERVICES)[number]

export const BUILDING_TYPES = [
  'Office',
  'Nursery or early years setting',
  'Factory or industrial premises',
  'Hospital or healthcare setting',
  'Hotel',
  'Other commercial building',
] as const

export type BuildingType = (typeof BUILDING_TYPES)[number]

export const PROPERTY_TYPES = ['House', 'Flat or apartment', 'Studio', 'Other residential property']

export const BEDROOMS = ['Studio / no separate bedroom', '1', '2', '3', '4', '5 or more']

export const DOMESTIC_FREQUENCIES = ['One-off', 'Weekly', 'Fortnightly', 'Monthly', 'To be discussed']

export const COMMERCIAL_FREQUENCIES = ['Daily', 'Several times a week', 'Weekly', 'One-off', 'To be discussed']

export const VISIT_TIMES = ['Morning', 'Afternoon', 'Evening', 'Flexible']
