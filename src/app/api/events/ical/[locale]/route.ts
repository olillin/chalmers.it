import EventService from '@/services/eventService';
import { NextRequest, NextResponse } from 'next/server';
import { Calendar, CalendarDate, CalendarEvent } from 'iamcal';
import NewsService from '@/services/newsService';
import GammaService from '@/services/gammaService';
import i18nConfig from '@/i18nConfig';
import i18nService from '@/services/i18nService';
import ApiService from '@/services/apiService';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: NextRequest,
  ctx: { params: Promise<{ locale: string }> }
) {
  const params = await ctx.params;
  const { locale } = params;
  const invalidLocale = !i18nConfig.locales.includes(locale);

  if (invalidLocale) {
    return ApiService.jsonError('Invalid locale');
  }

  const l = i18nService.getLocale(locale);
  const isEn = locale === 'en';

  const events = await EventService.getAll();
  const calendar = new Calendar('cthit');

  for (const event of events) {
    const post =
      event.newsPostId != null ? await NewsService.get(event.newsPostId) : null;

    const uid = event.id.toString();
    const start = event.fullDay
      ? new CalendarDate(event.startTime)
      : event.startTime;
    const end = event.fullDay ? new CalendarDate(event.endTime) : event.endTime;

    const calEvent = new CalendarEvent(uid, event.startTime, start)
      .setEnd(end)
      .setSummary(isEn ? event.titleEn : event.titleSv);

    if (event.location) {
      calEvent.setLocation(event.location);
    }

    if (post) {
      const relatedEvents = post.connectedEvents
        .filter((connectedEvent) => connectedEvent.id !== event.id)
        .map((connectedEvent) => {
          const title = isEn ? connectedEvent.titleEn : connectedEvent.titleSv;
          const date = i18nService.formatDate(connectedEvent.startTime);

          return `• ${title} (${date})`;
        });
      const author = await GammaService.getNick(post.writtenByGammaUserId);
      const writtenFor = post.writtenFor
        ? ` ${l.news.for} ${post.writtenFor}`
        : '';
      const description = `${l.news.written}${writtenFor} ${l.news.by} ${author ?? l.news.unknown}

${isEn ? post.contentEn : post.contentSv}

${l.events.readMore}: https://chalmers.it/post/${post.id}${relatedEvents ? `${l.events.relatedEvents}:\n\n` + relatedEvents.join('\n') : ''}`;

      calEvent.setDescription(description);
    }

    calendar.addComponent(calEvent);
  }
  const ical = calendar.serialize();

  return new NextResponse(ical, {
    status: 200,
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': 'attachment; filename="events.ics"'
    }
  });
}
