import { EventSourceApi } from "@fullcalendar/react";
import Calendar from "./Calendar";
import React, { useState, useEffect } from "react";

/**
 * Fetch event for specific user
 *
 * @param {string}   user        Email Address of a user
 *
 * @return {object} Return value description.
 */
async function fetchAllEvent(user) {
    // Send api 
    const response = await fetch('/api/fetchAllEvent', {
        method: 'POST',
        body: JSON.stringify({
          user: user, 
          }),
        headers: {
          'Content-Type': 'application/json',
        },
    });
    // Obtain all the data from response
    var events = null
    await response.json().then(data => {
        events = data.events;
    });
    return events;
}

/**
 * Event Calendar component is a visual calendar  
 * where all event of current user is displayed with 2 colors
 * Red event indicates user is not attend
 * Blue event indicates user is attend
 *
 * @param {object}   user    Props that includes the user email addr
 * 
 * @return {object} HTML formatted of the calendar event
 */
function EventCalendar(user) {
    // Store the event details
    const [details, setDetails] = useState(null);
    // Fetch the event and store in details
    useEffect(() => {
        fetchProducts();
    }, []);
    const fetchProducts = async () => {
        fetchAllEvent(user)
            .then(all_events => setDetails(all_events))
    };

    return (
        <>
            <Calendar events={details} />
        </>
    )

}

export default EventCalendar;