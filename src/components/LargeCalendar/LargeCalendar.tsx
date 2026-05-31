import EventService from '@/services/eventService';
import i18nService from '@/services/i18nService';
import LargeCalendarClient from '@/components/LargeCalendar/LargeCalendarClient';
import { EventSourceInput } from '@fullcalendar/core/index.js';

const LargeCalendar = async ({ locale }: { locale: string }) => {
  const l = i18nService.getLocale(locale);
  const isEn = locale === 'en';

  const events: EventSourceInput = await EventService.getAll().then((events) =>
    events.map((event) => ({
      title: isEn ? event.titleEn : event.titleSv,
      allDay: event.fullDay,
      ...(event.fullDay
        ? {
            date: event.startTime
          }
        : {
            start: event.startTime,
            end: event.endTime
          })
    }))
  );

  return <LargeCalendarClient locale={locale} events={events} />;
};

export default LargeCalendar;
