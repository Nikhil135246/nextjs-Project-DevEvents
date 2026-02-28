import Image from 'next/image';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';
import BookEvent from '../../components/BookEvent';
import { getSimilarEventsBySlug } from '../../../lib/actions/event.actions';
import { IEvent } from '../../../database';
import EventCard from '../../components/EventCard';
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? '';
if (!BASE_URL) {
    console.warn('NEXT_PUBLIC_BASE_URL is not configured');
}
// helper component

const EventDetailItem = ({ icon, alt, label }: { icon: string, alt: string, label: string }) => (
    <div className='flex-row-gap-2 items-center'>
        <Image src={icon} alt={alt} width={17} height={17} />
        <p>{label}</p>
    </div>
);

const EventAgenda = ({ agendaItems }: { agendaItems: string[] }) => (

    <div className='agenda'>
        <h2>Agenda</h2>
        <ul>
            {agendaItems.map((item) => (
                <li key={item}> {item}</li>
            ))}
        </ul>
    </div>
);

const EventTags = ({ tags }: { tags: string[] }) => (
    <div className='flex flex-row gap-1.5 flex-wrap'>
        {tags.map((tag) => (
            <span key={tag} className='pill'>{tag}</span>
        ))}
    </div>
);


const EventDetailsPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
    const { slug } = await params;

    try {
        const response = await fetch(`${BASE_URL}/api/events/${slug}`);

        if (!response.ok) {
            return notFound();
        }

        const json = await response.json();

        if (!json.data) {
            return notFound();
        }

        const { organizer, title, image, time, date, location, mode, agenda, overview, description, audience, tags } = json.data;

        if (!description) {
            return notFound();
        }

        // Booking limit state
        const bookings = 10;
        // Getting similar events from server action funtinality
        const similarEvents: IEvent[] = await getSimilarEventsBySlug(slug);
        return (
            <section id='event'>
                <div className='header'>
                    <h1>{title}</h1>
                    <p >{description}</p>
                </div>

                <div className='details'>
                    {/* Left Side - Event Content */}

                    <div className='content'>
                        <Image src={image} alt={title} width={800} height={800} className='banner' />
                        <section className='flex-col-gap-2'>
                            <h2>Overview</h2>
                            <p>{overview}</p>
                        </section>

                        <section className='flex-col-gap-2'>
                            <h2>Event Details</h2>
                            <EventDetailItem icon='/icons/calendar.svg' alt='calendar' label={date} />
                            <EventDetailItem icon='/icons/clock.svg' alt='time' label={time} />
                            <EventDetailItem icon='/icons/pin.svg' alt='pin' label={location} />
                            <EventDetailItem icon='/icons/mode.svg' alt='mode' label={mode} />
                            <EventDetailItem icon='/icons/audience.svg' alt='audience' label={audience} />
                        </section>

                        <EventAgenda agendaItems={(agenda)} />

                        <section className='flex-col-gap-2'>
                            <h2>About the Organizer</h2>
                            <p>{organizer}</p>
                        </section>

                        <EventTags tags={(tags)} />

                    </div>

                    {/* Right Side - Booking Form */}
                    <aside className="booking">
                        <div className='signup-card'>
                            <h2>Book This Event</h2>
                            {bookings > 0 ? (
                                <p className='text-sm'> Join {bookings} people already registered</p>
                            ) : (
                                <p className='text-sm'> No bookings yet. Be the first to join!</p>
                            )}
                            <BookEvent />
                            {/* Booking form or button goes here */}

                        </div>
                    </aside>

                </div>

                <div className='flex w-full flex-col gap-4 pt-20'>
                    <h2>Similar Events</h2>
                    <div className='events'>
                        {similarEvents.length > 0 ? (
                        
                            similarEvents.map((similarEvent:IEvent) => (
                                <EventCard key={similarEvent.title} {...similarEvent} />  
                            ))
                        
                       
                        ) : (
                            <p>No similar events found.</p>
                        )}
                    </div>  
                </div>

            </section>
        );
    } catch (error: unknown) {
        console.error('Error fetching event:', error);
        
        // Check if it's a 404 error
        if (
            error instanceof Response && error.status === 404 ||
            (error as { status?: number })?.status === 404 ||
            (error as { code?: string })?.code === 'ENOENT'
        ) {
            return notFound();
        }
        
        // Rethrow other errors to trigger Next.js error boundary (500 page)
        throw error;
    }
}

export default EventDetailsPage