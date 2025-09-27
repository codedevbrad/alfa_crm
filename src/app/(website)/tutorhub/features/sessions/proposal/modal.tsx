'use client'

import * as React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { isToday, isBefore } from 'date-fns'

import { calculateFreeSlots } from './utils'

// import { getAvailableSessionTimes, getAvailability } from '@/db_queries/calendar/queries/teacher.queries'
// import { createProposedSession } from '../db.queries'

/* =========================
   Types
   ========================= */

type TimeSlot = {
  label: string
  iso: string       // start time ISO
  duration: number  // minutes
}

type DayName = 'Sunday'|'Monday'|'Tuesday'|'Wednesday'|'Thursday'|'Friday'|'Saturday'

type DayAvailability = {
  selected: boolean
  startTime: string // "HH:MM"
  endTime: string   // "HH:MM"
}

type WeeklyAvailability = Partial<Record<DayName, DayAvailability>> | null

const DAY_NAMES: DayName[] = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']

/* =========================
   Helpers
   ========================= */

function buildDayWindow(date: Date | undefined, availability: WeeklyAvailability) {
  if (!date || !availability) return null
  const day = DAY_NAMES[date.getDay()]
  const av = availability[day]
  if (!av?.selected) return null

  const [sh, sm] = av.startTime.split(':').map(Number)
  const [eh, em] = av.endTime.split(':').map(Number)

  const start = new Date(date)
  start.setHours(sh ?? 8, sm ?? 0, 0, 0)

  const end = new Date(date)
  end.setHours(eh ?? 23, em ?? 0, 0, 0)

  return { start, end }
}

/* =========================
     Time selection subview
   ========================= */

type TimesProps = {
  selectedDate?: Date
  setSelectedSlot: (slot: { iso: string; duration: number }) => void
  dayWindow: { start: Date; end: Date } | null
}

function AllSelectableSessionTimesForSession({
  selectedDate,
  setSelectedSlot,
  dayWindow,
}: TimesProps) {
  const [availableTimes, setAvailableTimes] = React.useState<TimeSlot[]>([])

  React.useEffect(() => {
    if (!selectedDate) return

    async function fetchTimes() {
      
        //   const busy = await getYourAvailabletutoringTimes({ date: selectedDate });

      // If we have a day window from availability, use it; otherwise fallback to 08:00–23:00
      const dayStart = dayWindow?.start ?? new Date(new Date(selectedDate).setHours(8, 0, 0, 0))
      const dayEnd   = dayWindow?.end   ?? new Date(new Date(selectedDate).setHours(23, 0, 0, 0))

      const freeSlots = calculateFreeSlots(busy, dayStart, dayEnd)

      const durations = [60, 90, 120]
      const results: TimeSlot[] = []

      for (const slot of freeSlots) {
        let current = new Date(slot.start)

        // ensure we can fit at least a 60-min session from current
        while (current.getTime() + 60 * 60 * 1000 <= slot.end.getTime()) {
          for (const duration of durations) {
            const end = new Date(current.getTime() + duration * 60 * 1000)
            if (end <= slot.end) {
              results.push({
                label: `${current.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })} - ${end.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}`,
                iso: current.toISOString(),
                duration,
              })
            }
          }
          // advance by 15 mins
          current.setMinutes(current.getMinutes() + 15)
        }
      }

      setAvailableTimes(results)
    }

    fetchTimes()
  }, [selectedDate, dayWindow])

  return (
    <Card className="p-4 w-full">
      <p className="text-muted-foreground mb-4">
        {selectedDate
          ? `Booking a session for ${selectedDate.toLocaleDateString()}`
          : 'Pick a date to see available times'}
      </p>

      <ScrollArea className="h-[300px] pr-2">
        {[60, 90, 120].map((duration) => {
          const filtered = availableTimes.filter((t) => t.duration === duration)
          if (filtered.length === 0) return null

          return (
            <div key={duration} className="mb-4">
              <p className="font-semibold text-sm mb-2">
                {duration === 60 && '🕐 60 Minute Sessions'}
                {duration === 90 && '🕒 90 Minute Sessions'}
                {duration === 120 && '🕓 120 Minute Sessions'}
              </p>
              <div className="flex flex-wrap gap-2">
                {filtered.map((time) => (
                  <Button
                    key={`${time.iso}-${time.duration}`}
                    onClick={() => setSelectedSlot({ iso: time.iso, duration: time.duration })}
                    variant="outline"
                    className="text-sm"
                  >
                    {time.label}
                  </Button>
                ))}
              </div>
            </div>
          )
        })}
        {selectedDate && availableTimes.length === 0 && (
          <p className="text-muted-foreground text-sm">No available times</p>
        )}
      </ScrollArea>
    </Card>
  )
}

/* =========================
   Main propose session UI
   ========================= */

type SessionDraft = {
  date: Date | undefined
  slot: { iso: string; duration: number } | null
  location: string // UI-only (not in Prisma model)
  title: string
  summary: string
}

type SessionProposalProps = {
  studentId: string
  initialSession?: Partial<SessionDraft>
}

export default function ProposeSession({
  studentId,
  initialSession,
}: SessionProposalProps) {
  const [sessionInfo, setSessionInfo] = React.useState<SessionDraft>({
    date: initialSession?.date,
    slot: initialSession?.slot ?? null,
    location: initialSession?.location ?? 'Google Meet',
    title: initialSession?.title ?? 'CV & LinkedIn Optimization',
    summary:
      initialSession?.summary ??
      'A session to refine your CV and LinkedIn profile to highlight your leadership strengths and position you as a top candidate for leadership roles. Please share your CV and LinkedIn 2 days in advance.',
  })

  const [availability, setAvailability] = React.useState<WeeklyAvailability>(null)

  // Fetch weekly availability once
  React.useEffect(() => {
    (async () => {
      try {
        // const data = await getAvailability();
        setAvailability([])
      } catch (e) {
        console.error('Failed to load availability', e)
      }
    })()
  }, [])

  const handleDateChange = (date: Date | undefined) => {
    setSessionInfo((prev) => ({ ...prev, date, slot: null })) // reset slot when date changes
  }

  // Disable: past days + any day not selected in availability
  const disabledDates = (date: Date) => {
    const isPast = isBefore(date, new Date()) || isToday(date)
    if (isPast) return true
    if (!availability) return false // until loaded, don't block future days

    const dayName = DAY_NAMES[date.getDay()]
    const day = availability[dayName]
    return !day?.selected
  }

  const dayWindow = React.useMemo(
    () => buildDayWindow(sessionInfo.date, availability),
    [sessionInfo.date, availability]
  )

  async function handlePropose() {
    if (!sessionInfo.date) return alert('Pick a date')
    if (!sessionInfo.slot) return alert('Pick a time')
    if (!sessionInfo.title.trim()) return alert('Add a title')
    if (!sessionInfo.summary.trim()) return alert('Add a summary')

    // const res = await createProposedSession({
    //   studentId,
    //   title: sessionInfo.title,
    //   summary: sessionInfo.summary,
    //   scheduledStartISO: sessionInfo.slot.iso,
    //   length: sessionInfo.slot.duration,
    // })

    if (res.success) {
      console.log('Created session:', res.session)
      // TODO: toast + close dialog if you want
    } else {
      console.error(res.error)
      alert(res.error ?? 'Failed to propose session')
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Book Session</Button>
      </DialogTrigger>

      <DialogContent className="max-w-6xl p-6">
        <DialogHeader className="space-y-2">
          <h1>Book a session with {studentId}</h1>

          <Input
            className="text-xl font-bold"
            value={sessionInfo.title}
            onChange={(e) =>
              setSessionInfo((prev) => ({ ...prev, title: e.target.value }))
            }
            placeholder="Session Title"
          />

          <Textarea
            className="text-sm"
            value={sessionInfo.summary}
            onChange={(e) =>
              setSessionInfo((prev) => ({ ...prev, summary: e.target.value }))
            }
            placeholder="Session Summary"
            rows={6}
          />
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          {/* LEFT PANEL */}
          <Card className="bg-muted col-span-1">
            <CardContent className="p-4 flex flex-col gap-4">


              <div className="text-sm text-muted-foreground whitespace-pre-wrap">
                {sessionInfo.summary}
              </div>

              <div className="text-sm space-y-1">
                <p>
                  <strong>Date:</strong>{' '}
                  {sessionInfo.date?.toLocaleDateString() || 'Not selected'}
                </p>
                <p>
                  <strong>Time:</strong>{' '}
                  {sessionInfo.slot
                    ? new Date(sessionInfo.slot.iso).toLocaleTimeString('en-GB', {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true,
                      })
                    : 'Not selected'}
                </p>
                <p>
                  <strong>Duration:</strong>{' '}
                  {sessionInfo.slot ? `${sessionInfo.slot.duration} min` : 'Not selected'}
                </p>
                <p>
                  <strong>Location:</strong> {sessionInfo.location}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* MIDDLE PANEL */}
          <div className="col-span-1 flex flex-col items-center">
            <Calendar
              mode="single"
              selected={sessionInfo.date}
              onSelect={handleDateChange}
              disabled={disabledDates}
              modifiers={{ today: new Date() }}
              modifiersClassNames={{
                today: 'border border-blue-500 text-blue-600 font-semibold',
              }}
              className="rounded-md border w-full flex justify-center"
            />
          </div>

          {/* RIGHT PANEL */}
          <AllSelectableSessionTimesForSession
            selectedDate={sessionInfo.date}
            setSelectedSlot={(slot) => setSessionInfo((prev) => ({ ...prev, slot }))}
            dayWindow={dayWindow}
          />
        </div>

        <div className="w-full flex justify-end mt-6">
          <Button onClick={handlePropose}>Propose this session</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
