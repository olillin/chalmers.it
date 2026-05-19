import EventService from '@/services/eventService';
import { NextRequest, NextResponse } from 'next/server';
import { Calendar, CalendarDate, CalendarEvent } from 'iamcal';
import NewsService from '@/services/newsService';
import GammaService from '@/services/gammaService';

export const dynamic = 'force-dynamic';

export async function GET(_request: NextRequest, _ctx: { params?: unknown }) {
  const events = await EventService.getAll();
  const calendar = new Calendar('cthit');

  for (const event of events) {
    const post = event.newsPostId != null ? await NewsService.get(event.newsPostId) : null

    const uid = event.id.toString()
    const start = event.fullDay ? new CalendarDate(event.startTime) : event.startTime
    const end = event.fullDay ? new CalendarDate(event.endTime) : event.endTime

    const calEvent = new CalendarEvent(uid, event.startTime, start)
        .setEnd(end)
        .setSummary(event.titleSv)

    if (event.location) {
        calEvent.setLocation(event.location)
    }

    if (post) {
      const otherEvents = post.connectedEvents
          .filter(connectedEvent => connectedEvent.id !== event.id)
          .map(connectedEvent => `• ${connectedEvent.titleSv} (${connectedEvent.startTime.toLocaleString()})`)
      const author = await GammaService.getNick(post.writtenByGammaUserId);
      const description = `Skriven för ${post.writtenFor} av ${author ?? 'TODO UNKNOWN'}

${post.contentSv}

Läs mer: https://chalmers.it/post/${post.id}${otherEvents ? 'Relaterade tillfällen:\n\n' + otherEvents.join('\n') : ''}`
      calEvent.setDescription(description)
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
