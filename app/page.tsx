// import { events } from "../lib/constants";
// ye events import karne ki zarurat nahi hai ab jab hum backend se events fetch kar rahe hain


import { cacheLife } from "next/cache";
import { IEvent } from "../database";
import EventCard from "./components/EventCard";
import ExploreBtn from "./components/ExploreBtn";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const Page = async () => {

  // im caching conent for 1 hour
  // so that it will not fetch data from backend every time,
  // it will serve from cache for 1 hour 
  // Even if u refresht the page
  'use cache';
  cacheLife("hours");

  
  let events = [];

  try {
    if (!BASE_URL) {
      console.error('NEXT_PUBLIC_BASE_URL is not defined');
    } else {
      const response = await fetch(`${BASE_URL}/api/events`);
      if (response.ok) {
        const data = await response.json();
        events = data.events ?? [];
      }
    }
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