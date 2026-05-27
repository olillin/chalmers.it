import styles from './page.module.scss';
import ThreePaneLayout from '@/components/ThreePaneLayout/ThreePaneLayout';
import ContactCard from '@/components/ContactCard/ContactCard';
import ContentPane from '@/components/ContentPane/ContentPane';
import i18nService from '@/services/i18nService';
import FullCalendar from '@fullcalendar/react';
import EventService from '@/services/eventService';

export default async function Page(props: {
  params: Promise<{ locale: string }>;
}) {
  const params = await props.params;

  const { locale } = params;

  return (
    <main>
      <ThreePaneLayout
        middle={<Calendar locale={locale} />}
        right={<ContactCard locale={locale} />}
      />
    </main>
  );
}

const Calendar = async ({ locale }: { locale: string }) => {
  const l = i18nService.getLocale(locale);
  const isEn = locale === 'en';

  const events = await EventService.getAll()

  return (
    <ContentPane>
      <FullCalendar events={
        events.map(event => ({
          title: isEn ? event.titleEn : event.titleSv,
          allDay: event.fullDay,
          ...(event.fullDay ? {
          date: event.startTime,
          } : {
          start: event.startTime,
          end: event.endTime,
          })
        }))
      }/>
    </ContentPane>
  );
};
