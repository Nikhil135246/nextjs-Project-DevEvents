// import { events } from "../lib/constants";
// ye events import karne ki zarurat nahi hai ab jab hum backend se events fetch kar rahe hain


import { IEvent } from "../database";
import EventCard from "./components/EventCard";
import ExploreBtn from "./components/ExploreBtn";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
// making page an async function to fetch events from database in future when we connect it with backend
const Page = async() =>{

  const respone = await fetch(`${BASE_URL}/api/events`);
  const {events} = await respone.json();


  return (
    <section>

    <h1 className="text-center">The Hub for Every Dev <br /> Event that Matters</h1>
    <p className="text-center mt-5">Hackthon, Meetups and Conference, All in one Place</p>

    <ExploreBtn />

    <div className="mt-20 space-y-7">
      <h3>Featured Events</h3>
      <ul className="events">
        
        {events && events.length > 0 && events.map((event:IEvent) => (
          <li key={event.title}>
            <EventCard {...event}/>
          </li>
        )
      )}

      </ul>
    </div>
    
    </section>
  )

}
export default Page;