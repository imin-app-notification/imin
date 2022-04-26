import { EventSourceApi } from "@fullcalendar/react";
import Calendar from "./Calendar";
import React, { useState, useEffect } from "react";
import dynamic from 'next/dynamic'
let FullCalendar

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
    var events = [];
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
function EventCalendar(props) {
    const user = props.user;
    // Store the event details
    const [details, setDetails] = useState([]);
    // Fetch the event and store in details
    useEffect(() => {
        fetchProducts();
    }, []);
    const fetchProducts = async () => {
        fetchAllEvent(user)
            .then(all_events => setDetails(all_events))
    };
    const toolBar = {
        left: 'prev,next today',
        center: null,
        right: 'title'//'dayGridMonth,timeGridWeek,timeGridDay'
    };
    const [calendarLoaded, setCalendarLoaded] = useState(false)
    useEffect(() => {
        FullCalendar = dynamic({
            modules: () => ({
                calendar: import('@fullcalendar/react'),
                dayGridPlugin: import('@fullcalendar/daygrid'),
                timeGridPlugin: import('@fullcalendar/timegrid'),
            }),
            render: (props, { calendar: Calendar, ...plugins }) => (
                <Calendar {...props}
                    plugins={Object.values(plugins)}
                    contentHeight='auto'
                    initialView='dayGridMonth'
                    editable={false}
                    selectable={true}
                    selectMirror={true}
                    dayMaxEvents={true}
                    weekends={true}
                    headerToolbar={toolBar}
                    ref={props.myRef} />
            ),
            ssr: false
        })
        setCalendarLoaded(true)
    }, [details])
    let showCalendar = (props) => {
        if (!calendarLoaded) return <div>Loading ...</div>
        return (
            <FullCalendar {...props} events={details}/>
        )
    }

    return (
        <div>
            {showCalendar(props)}
        </div>
    )

}

export default EventCalendar;