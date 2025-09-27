'use server'

export async function fetchAvailability({
  date,
  apiKey,
  calendarId,
}: {
  date: Date;
  apiKey: string;
  calendarId: string;
}) {
  const API_KEY = apiKey;
  const CALENDAR_ID = calendarId;

  // Create start and end of the day in local time, then convert to UTC
  const localStart = new Date(date);
  localStart.setHours(0, 0, 0, 0);

  const localEnd = new Date(date);
  localEnd.setHours(23, 59, 59, 999);

  const timeMinUTC = localStart.toISOString();
  const timeMaxUTC = localEnd.toISOString();

  try {
    const requestBody = {
      timeMin: timeMinUTC,
      timeMax: timeMaxUTC,
      timeZone: 'Europe/London', // or 'UTC' if you don't want conversion
      items: [{ id: CALENDAR_ID }],
    };

    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/freeBusy?key=${API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch availability');
    }

    const data = await response.json();
    const busySlots = data.calendars[CALENDAR_ID]?.busy || [];
    return busySlots;
  } catch (error) {
    console.error('Error fetching availability:', error);
    throw new Error('Unable to fetch availability');
  }
}


type getAvailableSessionTimesProps = {
  date: Date // local date from client (e.g., 2025-07-30T00:00:00.000Z)
  studentId: string;
}


export async function getAvailableSessionTimes({ date , studentId }: getAvailableSessionTimesProps) {
  try {

    console.log( 'studentId' , studentId );

    const tutorId = null;

    if (!tutorId) throw new Error("Tutor not found")

    const calendarKeyData = null;
    if (!calendarKeyData) throw new Error("Calendar key data not found for tutor")
    const { apiKey, calendarId } = calendarKeyData

    const busySlots = await fetchAvailability({
      date,
      apiKey,
      calendarId,
    })

    const dayStart = new Date(date)
    dayStart.setHours(0, 0, 0, 0)

    const dayEnd = new Date(date)
    dayEnd.setHours(23, 59, 59, 999)
    return busySlots;
  } 
  catch (error) {
    console.error("Error fetching available session times:", error)
    return []
  }
}
