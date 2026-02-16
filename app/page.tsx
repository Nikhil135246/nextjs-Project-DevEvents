import { events } from "../lib/constants";
import EventCard from "./components/EventCard";
import ExploreBtn from "./components/ExploreBtn";

const Home =() =>{


  return (
    <section>

    <h1 className="text-center">The Hub for Every Dev <br /> Event that Matters</h1>
    <p className="text-center mt-5">Hackthon, Meetups and Conference, All in one Place</p>

    <ExploreBtn />

    <div className="mt-20 space-y-7">
      <h3>Featured Events</h3>
      <ul className="events">
        
        {events.map((event, index) => (
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
export default Home;