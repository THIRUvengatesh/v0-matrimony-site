import swisseph from "swisseph"
import tzlookup from "tz-lookup"
import moment from "moment-timezone"

swisseph.swe_set_ephe_path("./ephe")

const RASI = [
  "Mesham",
  "Rishabam",
  "Mithunam",
  "Kadagam",
  "Simmam",
  "Kanni",
  "Thulam",
  "Viruchigam",
  "Dhanusu",
  "Makaram",
  "Kumbam",
  "Meenam",
] as const
type Raasi = (typeof RASI)[number]

export interface PlanetPosition {
  raasi: Raasi
  degree: number
  house: number
}

export interface HoroscopeChart {
  sun: PlanetPosition
  moon: PlanetPosition
  mars: PlanetPosition
  mercury: PlanetPosition
  jupiter: PlanetPosition
  venus: PlanetPosition
  saturn: PlanetPosition
  rahu: PlanetPosition
  ketu: PlanetPosition
}

const PLANETS = [
  swisseph.SE_SUN,
  swisseph.SE_MOON,
  swisseph.SE_MARS,
  swisseph.SE_MERCURY,
  swisseph.SE_JUPITER,
  swisseph.SE_VENUS,
  swisseph.SE_SATURN,
  swisseph.SE_MEAN_NODE,
  swisseph.SE_TRUE_NODE,
]

export async function generateHoroscope(input: {
  date: string
  time: string
  lat: number
  lng: number
}): Promise<HoroscopeChart> {
  const tz = tzlookup(input.lat, input.lng)
  const dt = moment.tz(`${input.date} ${input.time}`, tz)

  const jd = swisseph.swe_julday(
    dt.year(),
    dt.month() + 1,
    dt.date(),
    dt.hour() + dt.minute() / 60,
    swisseph.SE_GREG_CAL,
  )

  function calcPlanet(p: number): PlanetPosition {
    const r = swisseph.swe_calc_ut(jd, p, swisseph.SEFLG_SWIEPH)
    const deg = r.longitude
    const house = Math.floor(deg / 30) + 1
    return {
      raasi: RASI[house - 1],
      degree: Number(deg.toFixed(2)),
      house,
    }
  }

  return {
    sun: calcPlanet(PLANETS[0]),
    moon: calcPlanet(PLANETS[1]),
    mars: calcPlanet(PLANETS[2]),
    mercury: calcPlanet(PLANETS[3]),
    jupiter: calcPlanet(PLANETS[4]),
    venus: calcPlanet(PLANETS[5]),
    saturn: calcPlanet(PLANETS[6]),
    rahu: calcPlanet(PLANETS[7]),
    ketu: calcPlanet(PLANETS[8]),
  }
}
