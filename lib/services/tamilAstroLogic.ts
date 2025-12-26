// =========================
// TAMIL ASTROLOGY CORE (TS)
// =========================

// 27 Nakshatras
export const NAKSHATRAS = [
 "Ashwini","Bharani","Krittika","Rohini","Mrigasira","Thiruvathirai","Punarpoosam",
 "Poosam","Aayilyam","Magam","Pooram","Uthiram","Hastham","Chithirai","Swathi",
 "Visakam","Anusham","Kettai","Moolam","Pooradam","Uthiradam","Thiruvonam",
 "Avittam","Sadhayam","Poorattathi","Uthirattathi","Revathi"
] as const

export const RAASI = ["Mesham","Rishabam","Mithunam","Kadagam","Simmam","Kanni","Thulam","Viruchigam","Dhanusu","Makaram","Kumbam","Meenam"] as const

export type Raasi = typeof RAASI[number]

export interface PlanetPosition {
  raasi: Raasi
  degree: number
  house: number
}

export interface HoroscopeProfile {
  nakshatra: { name: string; index: number; padam: number }
  raasi: Raasi
  mars: PlanetPosition
}

// =========================
// NAKSHATRA CALCULATION
// =========================
export function getNakshatra(moonDegree: number) {
  const size = 360 / 27
  const index = Math.floor(moonDegree / size)
  const padam = Math.floor((moonDegree % size) / (size / 4)) + 1
  return {
    name: NAKSHATRAS[index],
    index,
    padam
  }
}

// =========================
// CHEVVAI DOSHAM
// =========================
export function hasChevvai(mars: PlanetPosition): boolean {
  return [1, 4, 7, 8, 12].includes(mars.house)
}

// =========================
// 10 PORUTHAM ENGINE
// =========================
export function calculatePorutham(groom: HoroscopeProfile, bride: HoroscopeProfile) {

  const g = groom.nakshatra.index
  const b = bride.nakshatra.index

  const result = {
    dina: Math.abs(g - b) >= 9,
    gana: true,
    mahendra: true,
    stree_deerga: (b - g) >= 9,
    yoni: true,
    rasi: groom.raasi !== bride.raasi,
    adhipathi: true,
    vasiya: true,
    rajju: (g % 3) !== (b % 3),
    vedha: true
  }

  const total = Object.values(result).filter(v => v).length
  return { ...result, total }
}
