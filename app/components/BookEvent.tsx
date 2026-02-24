'use client';

import React, { useState } from "react";

// state to tarack , email and already booked or not 
//! Now u using hooks : need to set it as clint component 


const BookEvent = () => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e:React.FormEvent)=>{
        e.preventDefault(); // prevent default form submission behavior = > page reload
    
        // Simulate booking process (e.g., API call)
        setTimeout(() => {
            setSubmitted(true);
        }, 1000);
    }
    return (
        <div id="book-event">
            {submitted ? (
                <p className="text-green-600">Thank you for booking! A confirmation email has been sent to {email}.</p>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div >
                        <label htmlFor="email">Email Address</label>
                        <input type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        id="email"
                        placeholder="Enter your email"
                        />
                    </div>
                    <button type="submit" className="button-submit">Book Event</button>
                </form>
            )}
        </div>
    )
}

export default BookEvent