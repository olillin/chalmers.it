'use client';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { EventSourceInput } from '@fullcalendar/core/index.js';

const LargeCalendarClient = ({
  locale,
  events
}: {
  locale: string;
  events: EventSourceInput;
}) => {
  return (
    <FullCalendar
      plugins={[dayGridPlugin]}
      events={events}
      initialView="dayGridMonth"
    />
  );
};

export default LargeCalendarClient;
