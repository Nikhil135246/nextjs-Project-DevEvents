'use client'

import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import posthog from 'posthog-js'

const Navbar = () => {
  const handleLogoClick = () => {
    posthog.capture('logo_clicked', {
      navigation_target: '/',
    });
  };

  const handleNavLinkClick = (linkName: string, href: string) => {
    posthog.capture('nav_link_clicked', {
      link_name: linkName,
      navigation_target: href,
    });
  };

  return (
    // note that we use header and nav tag for better semantics and accessibility features
    // and for better SEO as well
    <header>
        <nav>
            <Link href="/" className='logo' onClick={handleLogoClick}>
                <Image src="/icons/logo.png" alt="logo" height={40} width={40} />
                <p>DevEvent</p>
            </Link>
            <ul>
                <Link href="/events" onClick={() => handleNavLinkClick('Home', '/events')}>Home</Link>
                <Link href="/events" onClick={() => handleNavLinkClick('Events', '/events')}>Events</Link>
                <Link href="/events" onClick={() => handleNavLinkClick('Create Event', '/events')}>Create Event</Link>
            </ul>
        </nav>
    </header>
  )
}

export default Navbar