import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Navbar = () => {
  return (
    // note that we use header and nav tag for better semantics and accessibility features
    // and for better SEO as well
    <header>
        <nav>
            <Link href="/" className='logo'>
                <Image src="/icons/logo.png" alt="logo" height={40} width={40} />
                <p>DevEvent</p>
            </Link>
            <ul>
                <Link href="/events">Home</Link>
                <Link href="/events">Events</Link>
                <Link href="/events">Create Event</Link>
            </ul>
        </nav>
    </header>
  )
}

export default Navbar