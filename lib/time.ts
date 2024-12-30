/**
 * "zero-day"
 * 
 * All day IDs are represented as offsets from this
 * day
 */
const startDt = Temporal.ZonedDateTime.from({
  timeZone: 'America/New_York',
  year: 1998,
  month: 10,
  day: 13,
})

/**
 * Get a unique numeric timestamp for the current day
 */
export const today = () => startDt.until(now()).total('days')

/**
 * Convert a dayId into it's raw `DateTime`
 */
export const fromId = (dayId: number) => startDt.add({ days: dayId - 1 })

/**
 * Get the number of milliseconds until the next nearest midnight
 */
export const msUntilMidnight = () => now().until(nextMidnight()).total('milliseconds')

/**
 * Get a DateTime of the next nearest midnight
 */
export const nextMidnight = () => now().add({ days: 1 }).with({ hour: 0, minute: 0, second: 0 })

/**
 * Convert a number of days to milliseconds
 */
export const dayToMs = (days: number) => days * 86400000

/**
 * Get the current datetime
 */
export const now = () => Temporal.Now.plainDateTimeISO().toZonedDateTime('America/New_York')

export const toId = (dt: Temporal.ZonedDateTime) => startDt.until(dt).total('days')