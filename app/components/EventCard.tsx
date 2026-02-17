'use client'

import Image from "next/image";
import Link from "next/link";
import posthog from "posthog-js";

// Need to define types of props warna sala typcript bolega mosquitonet ha kya `
interface Props {
  title: string;
  image: string;
  slug: string;
  location: string;
  date: string;
  time: string;
}

const EventCard = ({ title, image, slug, location, date, time }: Props) => {
  const handleClick = () => {
    posthog.capture('event_card_clicked', {
      event_title: title,
      event_slug: slug,
      event_location: location,
      event_date: date,
    });
  };

  return (
    <Link href={`/events/${slug}`} id="event-card" className="event-card" onClick={handleClick}>
      <img src={image} alt={title} className="poster" width={410} height={300} />
      <div className="flex flex-row gap-2">

        <Image src='/icons/pin.svg' alt="location" width={14} height={14} />
        <p>{location}</p>
      </div>
      <div className="datetime">
        <div>
          <Image src='/icons/calendar.svg' alt="date" width={14} height={14} />
          <p>{date}</p>
        </div>
        <div>
          <Image src='/icons/clock.svg' alt="time" width={14} height={14} />
          <p>{time}</p>
        </div>
      </div>
      <p className="title">{title}</p>
    </Link>
  )
}

export default EventCard