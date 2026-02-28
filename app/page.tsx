import { cacheLife } from "next/cache";
import { IEvent } from "../database";
import EventCard from "./components/EventCard";
import ExploreBtn from "./components/ExploreBtn";
import { getAllEvents } from "@/lib/actions/event.actions";
export const dynamic = 'force-dynamic';
const Page = async () => {

  // im caching conent for 1 hour
  // so that it will not fetch data from backend every time,
  // it will serve from cache for 1 hour 
  // Even if u refresht the page
  'use cache';
  cacheLife("hours");

  let events: IEvent[] = [];

  try {
    events = await getAllEvents();
  } catch (error) {
    console.error('Failed to fetch events:', error);
  }


  return (
    <section>

      <h1 className="text-center">The Hub for Every Dev <br /> Event that Matters</h1>
      <p className="text-center mt-5">Hackthon, Meetups and Conference, All in one Place</p>

      <ExploreBtn />

      <div className="mt-20 space-y-7">
        <h3>Featured Events</h3>
        <ul className="events">

          {events && events.length > 0 && events.map((event: IEvent) => (
            <li key={event.title} className="list-none">
              <EventCard {...event} />
            </li>
          )
          )}

        </ul>
      </div>

    </section>
  )

}
export default Page;