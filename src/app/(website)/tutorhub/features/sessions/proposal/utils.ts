export function calculateFreeSlots(
  busySlots: { start: string; end: string }[],
  dayStart: Date,
  dayEnd: Date
): { start: Date; end: Date }[] {
  const free: { start: Date; end: Date }[] = []
  const sorted = busySlots
    .map(({ start, end }) => ({
      start: new Date(start),
      end: new Date(end),
    }))
    .sort((a, b) => a.start.getTime() - b.start.getTime())

  let last = new Date(dayStart)

  for (const slot of sorted) {
    if (last < slot.start) {
      free.push({ start: new Date(last), end: new Date(slot.start) })
    }

    if (slot.end > last) {
      last = new Date(slot.end)
    }
  }

  if (last < dayEnd) {
    free.push({ start: last, end: dayEnd })
  }

  return free
}
