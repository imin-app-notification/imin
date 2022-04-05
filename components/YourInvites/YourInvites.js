import { React, useState, useEffect } from 'react';
import Moment from 'moment';
// reactstrap components
import {
    Table
} from "reactstrap";
import AttendOptions from '../Groups/AttendOptions';
import { useRouter } from 'next/router';

/**
 * Fetch all invitation from db
 *
 * @param {object}   user        User email address
 * 
 * @returns {object} list of event and selections
 */
async function fetchEvent(user) {
    // Send POST api to get
    const response = await fetch('/api/eventInvites', {
        method: 'POST',
        body: JSON.stringify({
            user: user,
        }),
        headers: {
            'Content-Type': 'application/json',
        },
    });
    // Obtain all event and selection in db
    var all_events = null;
    var selections = null;
    await response.json().then(data => {
        all_events = data.events;
        selections = data.isAttend;
    });
    return { events: all_events, selections: selections };
}

/**
 * Your invites component contains all the invitation of event. 
 * Similar to the structure of upcoming event.
 *
 * @param {object}   props       Props that includes the user email addr
 * 
 * @return {object} formatted HTML
 */
function YourInvites(user) {
    const router = useRouter();
    // Contains events and selection
    const [events, setEvents] = useState(null);
    const [selections, setSelections] = useState(null);
    // Fetch the data
    useEffect(() => {
        fetchProducts();
    }, []);
    const fetchProducts = async () => {
        fetchEvent(user)
            .then(d => {
                setEvents(d.events);
                setSelections(d.selections);
            })
    };
    return (
        <Table className="align-items-center table-flush" responsive>
            <thead className="thead-light">
                <tr>
                    <th scope="col">Events</th>
                    <th scope="col">Actions</th>
                </tr>
            </thead>
            <tbody>
                {events && selections && events.map((event, idx) =>
                    <tr key={idx}>
                        <th scope="row">
                            <h3
                                className='text-blue'
                                onClick={() => {
                                    router.push({
                                        pathname: '/admin/eventDetails/[id]',
                                        query: { id: event._id },
                                    })
                                }}
                            >
                                {event.eventNameRef}
                            </h3>
                            <h6>{Moment(event.startTimeRef).format('MMM DD, YYYY')} {Moment(event.startTimeRef).format('hh:mmA')}</h6>
                        </th>
                        <td>
                            <AttendOptions isAttend={selections[idx]} idx={event._id} user={user.user} />
                        </td>
                    </tr>)}
            </tbody>
        </Table>
    );
}

export default YourInvites;
