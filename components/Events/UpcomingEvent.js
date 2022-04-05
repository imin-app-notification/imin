import { React, useState, useEffect } from 'react';
import Moment from 'moment';

// reactstrap components
import {
  Table,
} from "reactstrap";

import AttendOptions from "../Groups/AttendOptions";
import { useRouter } from 'next/router';

/**
 * Fetch event for specific user
 *
 * @param {string}   user        Email Address of a user
 *
 * @return {object} Return value description.
 */
async function fetchEvent(user) {
  // Send GET api 
  const response = await fetch('/api/upcomingEvent', {
    method: 'GET',
    headers: {
      users: user,
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
  // Obtain all the data from response
  var all_events = null;
  var selections = null;
  await response.json().then(data => {
    all_events = data.events;
    selections = data.isAttend;
  });
  return { events: all_events, selections: selections };
}

/**
 * Upcoming event component is a table contains a list upcoming event of a user 
 * where user can lookup and switch their selections quickly
 *
 * @param {object}   props       Props that includes the user email addr
 * 
 * @return {object} HTML formatted of the upcoming event table
 */
function UpcomingEvent(props) {
  const router = useRouter();
  // Use to store the event and selections
  const [events, setEvents] = useState(null);
  const [selections, setSelections] = useState(null);
  useEffect(() => {
    fetchProducts();
  }, []);
  // Fetch from db
  const fetchProducts = async () => {
    fetchEvent(props.user)
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
              <AttendOptions isAttend={selections[idx]} idx={event._id} user={props.user} />
            </td>
          </tr>)}
      </tbody>
    </Table>
  );
}

export default UpcomingEvent;
